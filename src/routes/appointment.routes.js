import { Router } from 'express';
import { body, param, query } from 'express-validator';
import appointmentControllers from '../controllers/appointment.controllers.js';
import fieldValidator from '../middlewares/fieldValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import roleValidator from '../middlewares/roleValidator.js';

const router = Router();

router.post("/", [
  tokenValidator,
  body('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt(),
  body('patientId', 'PATIENT_ID_IS_REQUIRED').isInt().optional(),
  body('specialtyId', 'SPECIALTY_ID_IS_REQUIRED').isInt(),
  body('date', 'DATE_IS_REQUIRED').isDate(),
  body('startTime', 'START_TIME_IS_REQUIRED').isTime(),
  body('endTime', 'END_TIME_IS_REQUIRED').isTime(),
  fieldValidator
], appointmentControllers.create);

router.patch('/complete/:appointmentId', [
  tokenValidator,
  roleValidator(2),
  param('appointmentId', 'APPOINTMENT_ID_IS_REQUIRED').isInt(),
  fieldValidator
], appointmentControllers.complete);

router.get('/professionals/:professionalId', [
  tokenValidator,
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt(),
  query('startDate', 'START_DATE_IS_REQUIRED').isDate().optional(),
  query('endDate', 'END_DATE_IS_REQUIRED').isDate().optional(),
  query('patientId', 'PATIENT_ID_IS_REQUIRED').isInt().optional(),
  query('appointmentStateId', 'APPOINTMENT_STATE_ID_IS_REQUIRED').isInt().optional(),
  fieldValidator
], appointmentControllers.getAppointmentsByProfessional);

router.get('/patients/:patientId', [
  tokenValidator,
  param('patientId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt(),
  query('startDate', 'START_DATE_IS_REQUIRED').isDate().optional(),
  query('endDate', 'END_DATE_IS_REQUIRED').isDate().optional(),
  query('appointmentStateId', 'APPOINTMENT_STATE_ID_IS_REQUIRED').isInt().optional(),
  fieldValidator
], appointmentControllers.getAppointmentsByPatient);

router.get('/patients/:patientId/more-recent', [
  tokenValidator,
  param('patientId', 'PATIENT_ID_IS_REQUIRED').isInt(),
  fieldValidator
], appointmentControllers.getMoreRecentAppointmentsByPatientId);

router.get('/professionals/:professionalId/availability', [
  tokenValidator,
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt(),
  query('startDate', 'START_DATE_IS_REQUIRED').isDate(),
  query('endDate', 'END_DATE_IS_REQUIRED').isDate(),
  fieldValidator
], appointmentControllers.getAvailabilityByProfessionalId);

router.delete('/:appointmentId', [
  tokenValidator,
  param('appointmentId', 'APPOINTMENT_ID_IS_REQUIRED').isInt(),
  fieldValidator
], appointmentControllers.cancelAppointment);

export default router;