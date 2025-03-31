import { Router } from 'express';
import { body } from 'express-validator';
import appointmentControllers from '../controllers/appointment.controllers.js';
import fieldValidator from '../middlewares/fieldValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';

const router = Router();

router.post("/", [
  tokenValidator,
  body('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt(),
  body('patientId', 'PATIENT_ID_IS_REQUIRED').isInt(),
  body('specialtyId', 'SPECIALTY_ID_IS_REQUIRED').isInt(),
  body('date', 'DATE_IS_REQUIRED').isDate(),
  body('startTime', 'START_TIME_IS_REQUIRED').isTime(),
  body('endTime', 'END_TIME_IS_REQUIRED').isTime(),
  fieldValidator
], appointmentControllers.create);

export default router;