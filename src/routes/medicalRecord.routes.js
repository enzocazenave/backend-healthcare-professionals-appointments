import { Router } from 'express';
import medicalRecordControllers from '../controllers/medicalRecord.controllers.js';
import { body, param } from 'express-validator';
import tokenValidator from '../middlewares/tokenValidator.js';
import fieldValidator from '../middlewares/fieldValidator.js';
import roleValidator from '../middlewares/roleValidator.js';

const router = Router();

router.get('/patients/:patientId', [
  tokenValidator,
  param('patientId', 'PATIENT_ID_IS_REQUIRED').isInt(),
  fieldValidator
], medicalRecordControllers.getPatientMedicalRecords);

router.post('/patients/:patientId', [
  tokenValidator,
  roleValidator(2),
  param('patientId', 'PATIENT_ID_IS_REQUIRED').isInt(),
  body('record', 'RECORD_IS_REQUIRED').isString(),
  body('fileUrl', 'FILE_URL_IS_REQUIRED').isString(),
  fieldValidator
], medicalRecordControllers.createPatientMedicalRecord);

router.delete('/:medicalRecordId', [
  tokenValidator,
  roleValidator(2),
  param('medicalRecordId', 'MEDICAL_RECORD_ID_IS_REQUIRED').isInt(),
  fieldValidator
], medicalRecordControllers.deleteMedicalRecord);

export default router;