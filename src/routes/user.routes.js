import { Router } from 'express';
import userControllers from '../controllers/user.controllers.js';
import { body } from 'express-validator';
import fieldValidator from '../middlewares/fieldValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';

const router = Router();

router.get('/', [tokenValidator], userControllers.getUserById);

router.get('/prepaids', [tokenValidator], userControllers.getPrepaids);

router.post('/prepaid', [
  tokenValidator,
  body('prepaidId', 'PREPAID_ID_IS_REQUIRED').isInt({ min: 1 }),
  body('plan', 'PLAN_IS_REQUIRED').isString(),
  body('number', 'NUMBER_IS_REQUIRED').isString(),
  fieldValidator
], userControllers.addPrepaid);

router.delete('/prepaid', [
  tokenValidator,
  body('prepaidId', 'PREPAID_ID_IS_REQUIRED').isInt({ min: 1 }),
  fieldValidator
], userControllers.deletePrepaid);

router.patch('/', [
  tokenValidator,
  body('phoneNumber', 'PHONE_NUMBER_IS_REQUIRED').optional().isString(),
  fieldValidator
], userControllers.updateUserById);

router.delete('/', [tokenValidator], userControllers.deleteUserById);

export default router;