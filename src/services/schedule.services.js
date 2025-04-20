import { Sequelize } from 'sequelize';
import db from '../config/index.js';

const scheduleServices = {
  createProfessionalSchedule: async (schedule) => {
    try {
      const professional = await db.User.findOne({ where: { id: schedule.professionalId, role_id: 2 } });

      if (!professional) throw {
        layer: 'scheduleServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const professionalHasScheduleInThisHourRange = await db.ProfessionalSchedule.findOne({
        where: {
          professional_id: professional.id,
          day_of_week: schedule.dayOfWeek,
          [Sequelize.Op.or]: [
            { start_time: { [Sequelize.Op.lt]: schedule.endTime }, end_time: { [Sequelize.Op.gt]: schedule.startTime } },
            { start_time: { [Sequelize.Op.lt]: schedule.startTime }, end_time: { [Sequelize.Op.gt]: schedule.endTime } }
          ]
        }
      });

      if (professionalHasScheduleInThisHourRange) throw {
        layer: 'scheduleServices',
        key: 'PROFESSIONAL_HAS_SCHEDULE_IN_THIS_HOUR_RANGE',
        statusCode: 409
      }

      const newProfessionalSchedule = await db.ProfessionalSchedule.create({
        professional_id: professional.id,
        day_of_week: schedule.dayOfWeek,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        appointment_duration: schedule.appointmentDuration
      });

      return newProfessionalSchedule.get({ plain: true });
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  getProfessionalSchedules: async (professionalId) => {
    try {
      const professional = await db.User.findOne({ where: { id: professionalId, role_id: 2 } });

      if (!professional) throw {
        layer: 'scheduleServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const professionalSchedules = await db.ProfessionalSchedule.findAll({
        where: {
          professional_id: professional.id
        }
      });

      return professionalSchedules;
    } catch (error) {
      throw error;
    }
  },

  deleteProfessionalSchedule: async (professionalScheduleId) => {
    try {
      const professionalSchedule = await db.ProfessionalSchedule.findByPk(professionalScheduleId);

      if (!professionalSchedule) throw {
        layer: 'scheduleServices',
        key: 'PROFESSIONAL_SCHEDULE_NOT_FOUND',
        statusCode: 404
      }

      await professionalSchedule.destroy();

      return "El horario del profesional fue eliminado correctamente.";
    } catch (error) {
      throw error;
    }
  },

  createProfessionalScheduleBlock: async (scheduleBlock) => {
    try {
      const professional = await db.User.findOne({ where: { id: scheduleBlock.professionalId, role_id: 2 } });

      if (!professional) throw {
        layer: 'scheduleServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const professionalScheduleBlock = await db.ProfessionalScheduleBlock.create({
        professional_id: professional.id,
        date: scheduleBlock.date,
        start_time: scheduleBlock.startTime,
        end_time: scheduleBlock.endTime,
        reason: scheduleBlock.reason
      });

      return professionalScheduleBlock.get({ plain: true });
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  getProfessionalScheduleBlocks: async (professionalId) => {
    try {
      const professional = await db.User.findOne({ where: { id: professionalId, role_id: 2 } });

      if (!professional) throw {
        layer: 'scheduleServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const professionalScheduleBlocks = await db.ProfessionalScheduleBlock.findAll({
        where: {
          professional_id: professional.id
        }
      });

      return professionalScheduleBlocks;
    } catch (error) {
      throw error;
    }
  },

  deleteProfessionalScheduleBlock: async (professionalScheduleBlockId) => {
    try {
      const professionalScheduleBlock = await db.ProfessionalScheduleBlock.findByPk(professionalScheduleBlockId);

      if (!professionalScheduleBlock) throw {
        layer: 'scheduleServices',
        key: 'PROFESSIONAL_SCHEDULE_BLOCK_NOT_FOUND',
        statusCode: 404
      }

      await professionalScheduleBlock.destroy();

      return "El bloqueo de horario del profesional fue eliminado correctamente.";
    } catch (error) {
      throw error;
    }
  },
}

export default scheduleServices;