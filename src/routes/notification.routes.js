import { Router } from 'express';
import notificationControllers from '../controllers/notification.controllers.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import { param } from 'express-validator';
import fieldValidator from '../middlewares/fieldValidator.js';

const router = Router();

router.get('/', [
  tokenValidator
], notificationControllers.get);

router.post('/:notificationId/read', [
  tokenValidator,
  param('notificationId', 'NOTIFICATION_ID_IS_REQUIRED').isInt(),
  fieldValidator
], notificationControllers.read);

export default router;