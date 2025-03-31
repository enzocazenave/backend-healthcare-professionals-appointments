import { Sequelize } from 'sequelize';
import getWeekday from '../utils/getWeekday.js';
import ProfessionalSpecialty from '../models/ProfessionalSpecialty.js';
import ProfessionalSchedule from '../models/ProfessionalSchedule.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Specialty from '../models/Specialty.js';

const appointmentServices = {
  create: async ({ professionalId, patientId, specialtyId, date, startTime, endTime }, user) => {
    try {
      if (user.userRole === 1) {
        if (user.userId !== patientId) {
          throw {
            layer: 'appointmentServices',
            key: 'USER_DOES_NOT_HAVE_PERMISSION',
            statusCode: 403
          }
        }
      }

      const professional = await User.findOne({ where: { id: professionalId, role_id: 2 } });
      if (!professional) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const patient = await User.findOne({ where: { id: patientId, role_id: 1 } });
      if (!patient) throw {
        layer: 'appointmentServices',
        key: 'PATIENT_NOT_FOUND',
        statusCode: 404
      }

      const specialty = await Specialty.findByPk(specialtyId);
      if (!specialty) throw {
        layer: 'appointmentServices',
        key: 'SPECIALTY_NOT_FOUND',
        statusCode: 404
      }

      const professionalHasSpecialty = await ProfessionalSpecialty.findOne({ where: { professional_id: professionalId, specialty_id: specialtyId } });
      if (!professionalHasSpecialty) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_DOES_NOT_HAVE_SPECIALTY',
        statusCode: 404
      }

      const isTimeSlotInSchedule = await ProfessionalSchedule.findOne({
        where: {
          professional_id: professionalId,
          day_of_week: getWeekday(new Date(date)),
          [Sequelize.Op.or]: [
            { start_time: { [Sequelize.Op.lt]: endTime }, end_time: { [Sequelize.Op.gt]: startTime } },
            { start_time: { [Sequelize.Op.lt]: startTime }, end_time: { [Sequelize.Op.gt]: endTime } }
          ]
        }
      });

      if (!isTimeSlotInSchedule) throw {
        layer: 'appointmentServices',
        key: 'TIME_SLOT_IS_NOT_IN_PROFESSIONAL_SCHEDULE',
        statusCode: 409
      }

      const isTimeSlotInScheduleBlocks = await ProfessionalScheduleBlock.findOne({
        where: {
          professional_id: professionalId,
          day_of_week: getWeekday(new Date(date)),
          [Sequelize.Op.or]: [
            { start_time: { [Sequelize.Op.lt]: endTime }, end_time: { [Sequelize.Op.gt]: startTime } },
            { start_time: { [Sequelize.Op.lt]: startTime }, end_time: { [Sequelize.Op.gt]: endTime } }
          ]
        }
      });

      if (isTimeSlotInScheduleBlocks) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_DOES_NOT_WORK_ON_THAT_DAY',
        statusCode: 409
      }

      const isTimeSlotReserved = await Appointment.findOne({
        where: {
          professional_id: professionalId,
          date,
          [Sequelize.Op.or]: [
            { start_time: { [Sequelize.Op.lt]: endTime }, end_time: { [Sequelize.Op.gt]: startTime } },
            { start_time: { [Sequelize.Op.lt]: startTime }, end_time: { [Sequelize.Op.gt]: endTime } }
          ]
        }
      });

      if (isTimeSlotReserved) throw {
        layer: 'appointmentServices',
        key: 'TIME_SLOT_IS_RESERVED',
        statusCode: 409
      }

      const appointment = await Appointment.create({
        professional_id: professionalId,
        patient_id: patientId,
        specialty_id: specialtyId,
        date,
        start_time: startTime,
        end_time: endTime
      });

      return appointment;
    } catch (error) {
      throw error;
    }
  }
}

export default appointmentServices;