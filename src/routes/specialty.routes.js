import { Router } from 'express';
import specialtyControllers from '../controllers/specialty.controllers.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import { body, param } from 'express-validator';
import fieldValidator from '../middlewares/fieldValidator.js';
import roleValidator from '../middlewares/roleValidator.js';

const router = Router();

router.get('/', [
  tokenValidator
], specialtyControllers.getSpecialties);

router.get('/:specialtyId/professionals', [
  tokenValidator,
  param('specialtyId', 'SPECIALTY_ID_IS_REQUIRED').isInt(),
  fieldValidator
], specialtyControllers.getProfessionalsBySpecialty);

router.post('/', [
  tokenValidator,
  roleValidator(3),
  body('name', 'NAME_IS_REQUIRED').isString(),
  fieldValidator
], specialtyControllers.createSpecialty);

router.post('/professionals/:professionalId', [
  tokenValidator,
  roleValidator(3),
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt(),
  body('specialtyId', 'SPECIALTY_ID_IS_REQUIRED').isInt(),
  fieldValidator
], specialtyControllers.addProfessionalToSpecialty);

router.delete('/professionals/:professionalId', [
  tokenValidator,
  roleValidator(3),
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt(),
  body('specialtyId', 'SPECIALTY_ID_IS_REQUIRED').isInt(),
  fieldValidator
], specialtyControllers.deleteProfessionalFromSpecialty);

router.delete('/:specialtyId', [
  tokenValidator,
  roleValidator(3),
  param('specialtyId', 'SPECIALTY_ID_IS_REQUIRED').isInt(),
  fieldValidator
], specialtyControllers.deleteSpecialtyById);


export default router;