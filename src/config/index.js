import sequelize from './database.js';

import AppointmentState from '../models/AppointmentState.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Notification from '../models/Notification.js';
import PasswordResetCode from '../models/PasswordResetCode.js';
import Prepaid from '../models/Prepaid.js';
import PrepaidAffiliation from '../models/PrepaidAffiliation.js';
import Role from '../models/Role.js';
import Specialty from '../models/Specialty.js';
import User from '../models/User.js';
import ProfessionalSpecialty from '../models/ProfessionalSpecialty.js';
import ProfessionalSchedule from '../models/ProfessionalSchedule.js';
import ProfessionalScheduleBlock from '../models/ProfessionalScheduleBlock.js';

try {
  await sequelize.authenticate();
  await sequelize.sync();

  await Role.findOrCreate({
    where: { name: 'PATIENT' }
  })

  await Role.findOrCreate({
    where: { name: 'PROFESSIONAL' }
  })

  await Role.findOrCreate({
    where: { name: 'ADMIN' }
  })

  await AppointmentState.findOrCreate({
    where: { name: 'SCHEDULED' }
  })

  await AppointmentState.findOrCreate({
    where: { name: 'CANCELLED' }
  })

  await AppointmentState.findOrCreate({
    where: { name: 'COMPLETED' }
  })
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const db = {
  sequelize,
  AppointmentState,
  Appointment,
  MedicalRecord,
  Notification,
  PasswordResetCode,
  Prepaid,
  PrepaidAffiliation,
  Role,
  Specialty,
  User,
  ProfessionalSpecialty,
  ProfessionalSchedule,
  ProfessionalScheduleBlock
}

export default db