import { Router } from 'express';
import userControllers from '../controllers/user.controllers.js';
import { body } from 'express-validator';
import fieldValidator from '../middlewares/fieldValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';

const router = Router();

router.get('/', [tokenValidator], userControllers.getUserById);

router.post('/prepaid', [
  tokenValidator,
  body('name', 'NAME_IS_REQUIRED').isString(),
  body('plan', 'PLAN_IS_REQUIRED').isString(),
  body('code', 'CODE_IS_REQUIRED').isString(),
  fieldValidator
], userControllers.addPrepaid);

router.patch('/', [
  tokenValidator,
  body('phoneNumber', 'PHONE_NUMBER_IS_REQUIRED').optional().isString(),
  body('name', 'NAME_IS_REQUIRED').optional().isString(),
  body('plan', 'PLAN_IS_REQUIRED').optional().isString(),
  body('code', 'CODE_IS_REQUIRED').optional().isString(),
  fieldValidator
], userControllers.updateUserById);

router.delete('/', [tokenValidator], userControllers.deleteUserById);

export default router;