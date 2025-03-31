import ProfessionalSpecialty from '../models/ProfessionalSpecialty.js';
import { Sequelize } from 'sequelize';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Specialty from '../models/Specialty.js';

const appointmentServices = {
  create: async ({ professionalId, patientId, specialtyId, date, startTime, endTime }) => {
    try {
      const professional = await User.findOne({ where: { id: professionalId, role_id: 2 } });
      const patient = await User.findOne({ where: { id: patientId, role_id: 1 } });
      const specialty = await Specialty.findByPk(specialtyId);

      if (!professional) throw {
        layer: 'appointmentServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      if (!patient) throw {
        layer: 'appointmentServices',
        key: 'PATIENT_NOT_FOUND',
        statusCode: 404
      }

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

      const isTimeSlotReserved = await Appointment.findOne({
        where: {
          professional_id: professionalId,
          date,
          [Sequelize.Op.or]: [
            {
              start_time: {
                [Sequelize.Op.lt]: endTime
              },
              end_time: {
                [Sequelize.Op.gt]: startTime
              }
            },
            {
              start_time: {
                [Sequelize.Op.lt]: startTime
              },
              end_time: {
                [Sequelize.Op.gt]: endTime
              }
            }
          ]
        }
      });

      if (isTimeSlotReserved) throw {
        layer: 'appointmentServices',
        key: 'TIME_SLOT_IS_RESERVED',
        statusCode: 409
      }

      await Appointment.create({
        professional_id: professionalId,
        patient_id: patientId,
        specialty_id: specialtyId,
        date,
        start_time: startTime,
        end_time: endTime
      });

      return 'El turno ha sido reservado correctamente.';
    } catch (error) {
      throw error;
    }
  }
}

export default appointmentServices;