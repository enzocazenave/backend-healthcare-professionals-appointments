import { Router } from 'express';
import scheduleControllers from '../controllers/schedule.controllers.js';
import fieldValidator from '../middlewares/fieldValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import roleValidator from '../middlewares/roleValidator.js';
import { param } from 'express-validator';

const router = Router();

router.post('/:professionalId', [
  tokenValidator,
  roleValidator(2),
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  //TODO: Resta validar parametros del cuerpo de la solicitud
  fieldValidator
], scheduleControllers.createProfessionalSchedule)

router.get('/:professionalId', [
  tokenValidator,
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.getProfessionalSchedules)

router.delete('/:professionalScheduleId', [
  tokenValidator,
  param('professionalScheduleId', 'PROFESSIONAL_SCHEDULE_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.deleteProfessionalSchedule)

router.post('/:professionalId/block', [
  tokenValidator,
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  //TODO: Resta validar parametros del cuerpo de la solicitud
  fieldValidator
], scheduleControllers.createProfessionalScheduleBlock)

router.get('/:professionalId/block', [
  tokenValidator,
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.getProfessionalScheduleBlocks)

router.delete('/:professionalScheduleBlockId', [
  tokenValidator,
  param('blockId', 'BLOCK_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.deleteProfessionalScheduleBlock)

export default router;