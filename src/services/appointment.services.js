import { Sequelize } from "sequelize";
import getWeekday from "../utils/getWeekday.js";
import { formatInTimeZone } from "date-fns-tz";
import {
  addMinutes,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parse,
} from "date-fns";
import db from "../config/index.js";

const appointmentServices = {
  create: async (
    { professionalId, patientId, specialtyId, date, startTime, endTime },
    user
  ) => {
    try {
      const parsedDate = parse(date, "yyyy-MM-dd", new Date());

      if (user.userRole === 1) {
        if (user.userId !== patientId) {
          throw {
            layer: "appointmentServices",
            key: "USER_DOES_NOT_HAVE_PERMISSION",
            statusCode: 403,
          };
        }
      }

      const professional = await db.User.findOne({
        where: { id: professionalId, role_id: 2 },
      });
      if (!professional)
        throw {
          layer: "appointmentServices",
          key: "PROFESSIONAL_NOT_FOUND",
          statusCode: 404,
        };

      const patient = await db.User.findOne({
        where: { id: patientId, role_id: 1 },
      });
      if (!patient)
        throw {
          layer: "appointmentServices",
          key: "PATIENT_NOT_FOUND",
          statusCode: 404,
        };

      const specialty = await db.Specialty.findByPk(specialtyId);
      if (!specialty)
        throw {
          layer: "appointmentServices",
          key: "SPECIALTY_NOT_FOUND",
          statusCode: 404,
        };

      const professionalHasSpecialty = await db.ProfessionalSpecialty.findOne({
        where: { professional_id: professionalId, specialty_id: specialtyId },
      });
      if (!professionalHasSpecialty)
        throw {
          layer: "appointmentServices",
          key: "PROFESSIONAL_DOES_NOT_HAVE_SPECIALTY",
          statusCode: 404,
        };

      const professionalSchedule = await db.ProfessionalSchedule.findOne({
        where: {
          professional_id: professionalId,
          day_of_week: getWeekday(parsedDate),
          start_time: { [Sequelize.Op.lte]: startTime },
          end_time: { [Sequelize.Op.gte]: endTime },
        },
      });

      if (!professionalSchedule)
        throw {
          layer: "appointmentServices",
          key: "TIME_SLOT_IS_NOT_IN_PROFESSIONAL_SCHEDULE",
          statusCode: 409,
        };

      const appointmentDuration = differenceInMinutes(
        new Date(`1970-01-01T${endTime}:00`),
        new Date(`1970-01-01T${startTime}:00`)
      );

      if (appointmentDuration !== professionalSchedule.appointment_duration)
        throw {
          layer: "appointmentServices",
          key: "APPOINTMENT_DURATION_IS_NOT_VALID",
          statusCode: 409,
        };

      const isTimeSlotInScheduleBlocks =
        await db.ProfessionalScheduleBlock.findOne({
          where: {
            professional_id: professionalId,
            date: parsedDate,
            [Sequelize.Op.and]: [
              { start_time: { [Sequelize.Op.lt]: endTime } },
              { end_time: { [Sequelize.Op.gt]: startTime } },
            ],
          },
        });

      if (isTimeSlotInScheduleBlocks)
        throw {
          layer: "appointmentServices",
          key: "PROFESSIONAL_DOES_NOT_WORK_ON_THAT_DAY",
          statusCode: 409,
        };

      const isTimeSlotReserved = await db.Appointment.findOne({
        where: {
          professional_id: professionalId,
          date: parsedDate,
          appointment_state_id: { [Sequelize.Op.in]: [1, 3] },
          [Sequelize.Op.and]: [
            { start_time: { [Sequelize.Op.lt]: endTime } },
            { end_time: { [Sequelize.Op.gt]: startTime } },
          ],
        },
      });

      if (isTimeSlotReserved)
        throw {
          layer: "appointmentServices",
          key: "TIME_SLOT_IS_RESERVED",
          statusCode: 409,
        };

      const appointment = await db.Appointment.create({
        professional_id: professionalId,
        patient_id: patientId,
        specialty_id: specialtyId,
        date: parsedDate,
        start_time: startTime,
        end_time: endTime,
        appointment_state_id: 1,
      });

      return appointment.get({ plain: true });
    } catch (error) {
      throw error;
    }
  },

  complete: async ({ appointmentId }) => {
    try {
      const appointment = await db.Appointment.findByPk(appointmentId);

      if (!appointment)
        throw {
          layer: "appointmentServices",
          key: "APPOINTMENT_NOT_FOUND",
          statusCode: 404,
        };

      if (appointment.appointment_state_id === 3)
        throw {
          layer: "appointmentServices",
          key: "APPOINTMENT_ALREADY_COMPLETED",
          statusCode: 409,
        };

      await appointment.update({ appointment_state_id: 3 });

      return "El turno fue completado con éxito.";
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsByProfessional: async ({
    professionalId,
    startDate,
    endDate,
    patientId,
    appointmentStateId,
  }) => {
    try {
      const professional = await db.User.findOne({
        where: { id: professionalId, role_id: 2 },
      });

      if (!professional)
        throw {
          layer: "appointmentServices",
          key: "PROFESSIONAL_NOT_FOUND",
          statusCode: 404,
        };

      if (patientId) {
        const patient = await db.User.findOne({
          where: { id: patientId, role_id: 1 },
        });
        if (!patient)
          throw {
            layer: "appointmentServices",
            key: "PATIENT_NOT_FOUND",
            statusCode: 404,
          };
      }

      const whereClause = {
        professional_id: professionalId,
      };

      if (appointmentStateId) {
        whereClause.appointment_state_id = appointmentStateId;
      }

      if (startDate && endDate) {
        whereClause.date = {
          [Sequelize.Op.gte]: new Date(startDate),
          [Sequelize.Op.lte]: new Date(endDate),
        };
      } else if (startDate) {
        whereClause.date = { [Sequelize.Op.gte]: new Date(startDate) };
      } else if (endDate) {
        whereClause.date = { [Sequelize.Op.lte]: new Date(endDate) };
      }

      if (patientId) {
        whereClause.patient_id = patientId;
      }

      const appointments = await db.Appointment.findAll({
        where: whereClause,
        attributes: {
          exclude: ["professional_id", "patient_id", "specialty_id"],
        },
        order: [
          ["date", "ASC"],
          ["start_time", "ASC"],
        ],
        include: [
          {
            model: db.Specialty,
            as: "specialty",
            attributes: ["name"],
          },
        ],
      });

      return appointments;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsByPatient: async ({
    patientId,
    startDate,
    endDate,
    appointmentStateId,
  }) => {
    try {
      const patient = await db.User.findOne({
        where: { id: patientId, role_id: 1 },
      });

      if (!patient)
        throw {
          layer: "appointmentServices",
          key: "PATIENT_NOT_FOUND",
          statusCode: 404,
        };

      const whereClause = {
        patient_id: patientId,
      };

      if (appointmentStateId) {
        whereClause.appointment_state_id = appointmentStateId;
      }

      if (startDate && endDate) {
        whereClause.date = {
          [Sequelize.Op.gte]: parse(startDate, "yyyy-MM-dd", new Date()),
          [Sequelize.Op.lte]: parse(endDate, "yyyy-MM-dd", new Date()),
        };
      } else if (startDate) {
        whereClause.date = {
          [Sequelize.Op.gte]: parse(startDate, "yyyy-MM-dd", new Date()),
        };
      } else if (endDate) {
        whereClause.date = {
          [Sequelize.Op.lte]: parse(endDate, "yyyy-MM-dd", new Date()),
        };
      }

      const appointments = await db.Appointment.findAll({
        where: whereClause,
        order: [
          ["date", "ASC"],
          ["start_time", "ASC"],
        ],
        attributes: {
          exclude: ["professional_id", "patient_id", "specialty_id"],
        },
        include: [
          {
            model: db.Specialty,
            as: "specialty",
            attributes: ["name"],
          },
          {
            model: db.User,
            as: "professional",
            attributes: ["full_name", "email", "phone_number"],
          },
        ],
      });

      return appointments;
    } catch (error) {
      throw error;
    }
  },

  getMoreRecentAppointmentsByPatientId: async ({ patientId }) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const appointment = await db.Appointment.findOne({
        where: {
          patient_id: patientId,
          appointment_state_id: { [Sequelize.Op.in]: [1, 3] },
          [Sequelize.Op.or]: [
            {
              date: { [Sequelize.Op.gt]: today },
            },
            {
              date: today,
              start_time: {
                [Sequelize.Op.gte]: format(new Date(), "HH:mm:ss"),
              },
            },
          ],
        },
        order: [
          ["date", "ASC"],
          ["start_time", "ASC"],
        ],
        attributes: {
          exclude: ["professional_id", "patient_id", "specialty_id"],
        },
        include: [
          {
            model: db.Specialty,
            as: "specialty",
            attributes: ["name"],
          },
          {
            model: db.User,
            as: "professional",
            attributes: ["full_name", "email", "phone_number"],
          },
        ],
      });

      return appointment;
    } catch (error) {
      throw error;
    }
  },

  cancelAppointment: async ({ appointmentId }) => {
    try {
      const appointment = await db.Appointment.findByPk(appointmentId);

      if (!appointment)
        throw {
          layer: "appointmentServices",
          key: "APPOINTMENT_NOT_FOUND",
          statusCode: 404,
        };

      if (appointment.appointment_state_id === 2)
        throw {
          layer: "appointmentServices",
          key: "APPOINTMENT_ALREADY_CANCELLED",
          statusCode: 409,
        };

      await appointment.update({ appointment_state_id: 2 });

      return "El turno fue cancelado con éxito.";
    } catch (error) {
      throw error;
    }
  },

  getAvailabilityByProfessionalId: async ({
    professionalId,
    startDate,
    endDate,
  }) => {
    try {
      const professional = await db.User.findOne({
        where: { id: professionalId, role_id: 2 },
      });

      if (!professional)
        throw {
          layer: "appointmentServices",
          key: "PROFESSIONAL_NOT_FOUND",
          statusCode: 404,
        };

      const startDateRange = parse(startDate, "yyyy-MM-dd", new Date());
      const endDateRange = parse(endDate, "yyyy-MM-dd", new Date());

      const dateRange = eachDayOfInterval({
        start: startDateRange,
        end: endDateRange,
      });

      const schedule = await db.ProfessionalSchedule.findAll({
        where: { professional_id: professionalId },
      });

      const blocks = await db.ProfessionalScheduleBlock.findAll({
        where: {
          professional_id: professionalId,
          date: {
            [Sequelize.Op.gte]: startDateRange,
            [Sequelize.Op.lte]: endDateRange,
          },
        },
      });

      const appointments = await db.Appointment.findAll({
        where: {
          professional_id: professionalId,
          date: {
            [Sequelize.Op.gte]: startDateRange,
            [Sequelize.Op.lte]: endDateRange,
          },
          appointment_state_id: { [Sequelize.Op.in]: [1, 3] },
        },
      });

      const availability = [];

      for (const date of dateRange) {
        const formattedDate = format(date, "yyyy-MM-dd");
        const dayOfWeek = getWeekday(date);

        const scheduleForDay = schedule.filter(
          (s) => s.day_of_week === dayOfWeek
        );

        const blocksForDay = blocks.filter(
          (b) => formattedDate === format(b.date, "yyyy-MM-dd")
        );

        const appointmentsForDay = appointments.filter(
          (a) => formattedDate === format(a.date, "yyyy-MM-dd")
        );

        const timeSlots = [];
        const now = new Date();

        for (const s of scheduleForDay) {
          const startTimeStr = formatInTimeZone(s.start_time, "UTC", "HH:mm");
          const endTimeStr = formatInTimeZone(s.end_time, "UTC", "HH:mm");

          let start = new Date(`${formattedDate}T${startTimeStr}`);
          const end = new Date(`${formattedDate}T${endTimeStr}`);
          const duration = s.appointment_duration;

          while (isBefore(start, end)) {
            const slotEnd = addMinutes(start, duration);
            if (isAfter(slotEnd, end)) break;

            const isBlocked = blocksForDay.some((b) => {
              const blockStartStr = formatInTimeZone(
                b.start_time,
                "UTC",
                "HH:mm"
              );
              const blockEndStr = formatInTimeZone(b.end_time, "UTC", "HH:mm");

              const blockStart = new Date(`${formattedDate}T${blockStartStr}`);
              const blockEnd = new Date(`${formattedDate}T${blockEndStr}`);

              return start < blockEnd && slotEnd > blockStart;
            });

            const isReserved = appointmentsForDay.some((a) => {
              const apptStartStr = formatInTimeZone(
                a.start_time,
                "UTC",
                "HH:mm"
              );
              const apptEndStr = formatInTimeZone(a.end_time, "UTC", "HH:mm");

              const apptStart = new Date(`${formattedDate}T${apptStartStr}`);
              const apptEnd = new Date(`${formattedDate}T${apptEndStr}`);

              return start < apptEnd && slotEnd > apptStart;
            });

            const isToday = isSameDay(date, now);
            const hasAlreadyPassed = isToday && isBefore(start, now);

            if (!isBlocked && !isReserved && !hasAlreadyPassed) {
              timeSlots.push({
                start_time: format(start, "HH:mm"),
                end_time: format(slotEnd, "HH:mm"),
              });
            }

            start = addMinutes(start, duration);
          }
        }

        availability.push({
          date: formattedDate,
          slots: timeSlots,
        });
      }

      return availability;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default appointmentServices;
