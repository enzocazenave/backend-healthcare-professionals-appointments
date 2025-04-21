import { Sequelize } from 'sequelize';
import getWeekday from '../utils/getWeekday.js';
import { eachDayOfInterval, format, parse } from 'date-fns';
import db from '../config/index.js';

const appointmentServices = {
  create: async ({ professionalId, patientId, specialtyId, date, startTime, endTime }, user) => {
    try {
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date());

      if (user.userRole === 1) {
        if (user.userId !== patientId) {
          throw {
            layer: 'appointmentServices',
            key: 'USER_DOES_NOT_HAVE_PERMISSION',
            statusCode: 403
          }
        }
      }

      const professional = await db.User.findOne({ where: { id: professionalId, role_id: 2 } });
      if (!professional) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const patient = await db.User.findOne({ where: { id: patientId, role_id: 1 } });
      if (!patient) throw {
        layer: 'appointmentServices',
        key: 'PATIENT_NOT_FOUND',
        statusCode: 404
      }

      const specialty = await db.Specialty.findByPk(specialtyId);
      if (!specialty) throw {
        layer: 'appointmentServices',
        key: 'SPECIALTY_NOT_FOUND',
        statusCode: 404
      }

      const professionalHasSpecialty = await db.ProfessionalSpecialty.findOne({ where: { professional_id: professionalId, specialty_id: specialtyId } });
      if (!professionalHasSpecialty) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_DOES_NOT_HAVE_SPECIALTY',
        statusCode: 404
      }

      const isTimeSlotInSchedule = await db.ProfessionalSchedule.findOne({
        where: {
          professional_id: professionalId,
          day_of_week: getWeekday(parsedDate),
          start_time: { [Sequelize.Op.lte]: startTime },
          end_time: { [Sequelize.Op.gte]: endTime }
        }
      });

      if (!isTimeSlotInSchedule) throw {
        layer: 'appointmentServices',
        key: 'TIME_SLOT_IS_NOT_IN_PROFESSIONAL_SCHEDULE',
        statusCode: 409
      }

      const isTimeSlotInScheduleBlocks = await db.ProfessionalScheduleBlock.findOne({
        where: {
          professional_id: professionalId,
          date: new Date(date),
          [Sequelize.Op.and]: [
            { start_time: { [Sequelize.Op.lt]: endTime } },
            { end_time: { [Sequelize.Op.gt]: startTime } }
          ]
        }
      });

      if (isTimeSlotInScheduleBlocks) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_DOES_NOT_WORK_ON_THAT_DAY',
        statusCode: 409
      }

      const isTimeSlotReserved = await db.Appointment.findOne({
        where: {
          professional_id: professionalId,
          date: new Date(date),
          appointment_state_id: { [Sequelize.Op.in]: [1, 3] },
          [Sequelize.Op.and]: [
            { start_time: { [Sequelize.Op.lt]: endTime } },
            { end_time: { [Sequelize.Op.gt]: startTime } }
          ]
        }
      });

      if (isTimeSlotReserved) throw {
        layer: 'appointmentServices',
        key: 'TIME_SLOT_IS_RESERVED',
        statusCode: 409
      }

      const appointment = await db.Appointment.create({
        professional_id: professionalId,
        patient_id: patientId,
        specialty_id: specialtyId,
        date: new Date(date),
        start_time: startTime,
        end_time: endTime,
        appointment_state_id: 1
      });

      return appointment.get({ plain: true });
    } catch (error) {
      throw error;
    }
  },

  complete: async ({ appointmentId }) => {
    try {
      const appointment = await db.Appointment.findByPk(appointmentId);

      if (!appointment) throw {
        layer: 'appointmentServices',
        key: 'APPOINTMENT_NOT_FOUND',
        statusCode: 404
      }

      if (appointment.status === 'Completed') throw {
        layer: 'appointmentServices',
        key: 'APPOINTMENT_ALREADY_COMPLETED',
        statusCode: 409
      }

      await appointment.update({ appointment_state_id: 3 });

      return "El turno fue completado con éxito.";
    } catch (error) {
      throw error;
    }
  },
  
  getAppointmentsByProfessional: async ({ professionalId, startDate, endDate, patientId }) => {
    try {
      const professional = await db.User.findOne({ where: { id: professionalId, role_id: 2 } });

      if (!professional) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      if (patientId) {
        const patient = await db.User.findOne({ where: { id: patientId, role_id: 1 } });
        if (!patient) throw {
          layer: 'appointmentServices',
          key: 'PATIENT_NOT_FOUND',
          statusCode: 404
        }
      }

      startDate = new Date(startDate);
      endDate = new Date(endDate);

      const whereClause = {
        professional_id: professionalId,
        date: { [Sequelize.Op.gte]: startDate, [Sequelize.Op.lte]: endDate }
      }

      if (patientId) {
        whereClause.patient_id = patientId;
      }
      
      const appointments = await db.Appointment.findAll({
        where: whereClause,
        attributes: { exclude: ['professional_id', 'patient_id', 'specialty_id' ] },
        include: [
          {
            model: db.Specialty,
            as: 'specialty',
            attributes: ['name']
          }
        ]
      });

      return appointments;
    } catch (error) {
      throw error;
    }
  },
  
  getAppointmentsByPatient: async ({ patientId, startDate, endDate }) => {
    try {
      const patient = await db.User.findOne({ where: { id: patientId, role_id: 1 } });

      if (!patient) throw {
        layer: 'appointmentServices',
        key: 'PATIENT_NOT_FOUND',
        statusCode: 404
      }

      startDate = new Date(startDate);
      endDate = new Date(endDate);
      
      const appointments = await db.Appointment.findAll({
        where: {
          patient_id: patientId,
          date: { [Sequelize.Op.gte]: startDate, [Sequelize.Op.lte]: endDate }
        },
        attributes: { exclude: ['professional_id', 'patient_id', 'specialty_id' ] },
        include: [
          {
            model: db.Specialty,
            as: 'specialty',
            attributes: ['name']
          },
          {
            model: db.User,
            as: 'professional',
            attributes: ['full_name', 'email', 'phone_number']
          }
        ]
      });
      
      return appointments;
    } catch (error) {
      throw error;
    }
  },
  
  cancelAppointment: async ({ appointmentId }) => {
    try {
      const appointment = await db.Appointment.findByPk(appointmentId);

      if (!appointment) throw {
        layer: 'appointmentServices',
        key: 'APPOINTMENT_NOT_FOUND',
        statusCode: 404
      }

      if (appointment.appointment_state_id === 2) throw {
        layer: 'appointmentServices',
        key: 'APPOINTMENT_ALREADY_CANCELLED',
        statusCode: 409
      }

      await appointment.update({ appointment_state_id: 2 });

      return "El turno fue cancelado con éxito.";
    } catch (error) {
      throw error;
    }
  },

  getAvailabilityByProfessionalId: async ({ professionalId, startDate, endDate }) => {
    try {
      const professional = await db.User.findOne({ where: { id: professionalId, role_id: 2 } });

      if (!professional) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const startDateRange = parse(startDate, 'yyyy-MM-dd', new Date());
      const endDateRange = parse(endDate, 'yyyy-MM-dd', new Date());
      
      const dateRange = eachDayOfInterval({
        start: startDateRange,
        end: endDateRange
      }).map(date => format(date, 'yyyy-MM-dd'));

      //TODO: Implementar calculo de disponibiilidad de un profesional

      return [];
    } catch (error) {
      throw error;
    }
  }
}

export default appointmentServices;