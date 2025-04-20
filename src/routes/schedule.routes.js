import { Router } from 'express';
import scheduleControllers from '../controllers/schedule.controllers.js';
import fieldValidator from '../middlewares/fieldValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import roleValidator from '../middlewares/roleValidator.js';
import { body, param } from 'express-validator';

const router = Router();

router.post('/:professionalId', [
  tokenValidator,
  roleValidator(2),
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  body('dayOfWeek', 'DAY_OF_WEEK_IS_REQUIRED').isString(),
  body('startTime', 'START_TIME_IS_REQUIRED').isTime(),
  body('endTime', 'END_TIME_IS_REQUIRED').isTime(),
  body('appointmentDuration', 'APPOINTMENT_DURATION_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.createProfessionalSchedule)

router.get('/:professionalId', [
  tokenValidator,
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.getProfessionalSchedules)

router.delete('/:professionalScheduleId', [
  tokenValidator,
  roleValidator(2),
  param('professionalScheduleId', 'PROFESSIONAL_SCHEDULE_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.deleteProfessionalSchedule)

router.post('/:professionalId/block', [
  tokenValidator,
  roleValidator(2),
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  body('date', 'DATE_IS_REQUIRED').isDate(),
  body('startTime', 'START_TIME_IS_REQUIRED').isTime(),
  body('endTime', 'END_TIME_IS_REQUIRED').isTime(),
  body('reason', 'REASON_IS_REQUIRED').isString(),
  fieldValidator
], scheduleControllers.createProfessionalScheduleBlock)

router.get('/:professionalId/block', [
  tokenValidator,
  param('professionalId', 'PROFESSIONAL_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.getProfessionalScheduleBlocks)

router.delete('/:professionalScheduleBlockId/block', [
  tokenValidator,
  roleValidator(2),
  param('professionalScheduleBlockId', 'PROFESSIONAL_SCHEDULE_BLOCK_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], scheduleControllers.deleteProfessionalScheduleBlock)

export default router;