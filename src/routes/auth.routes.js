import { Router } from 'express';
import { body } from 'express-validator';
import authControllers from '../controllers/auth.controllers.js';
import fieldValidator from '../middlewares/fieldValidator.js';

const router = Router();

router.post("/register", [
  body('fullName', 'FULL_NAME_IS_REQUIRED').isString(),
  body('email', 'EMAIL_IS_REQUIRED').isString().isEmail(),
  body('password', 'PASSWORD_IS_REQUIRED').isString().isLength({ min: 6 }),
  fieldValidator
], authControllers.register);

router.post("/login", [
  body('email', 'EMAIL_IS_REQUIRED').isString().isEmail(),
  body('password', 'PASSWORD_IS_REQUIRED').isString().isLength({ min: 6 }),
  fieldValidator
], authControllers.login);

router.post("/refresh-token", [], authControllers.refreshToken);

router.post("/logout", [], authControllers.logout);

router.post("/forgot-password", [
  body('email', 'EMAIL_IS_REQUIRED').isString().isEmail(),
  fieldValidator
], authControllers.forgotPassword); 

router.post("/reset-password", [
  body('email', 'EMAIL_IS_REQUIRED').isString().isEmail(),
  body('password', 'PASSWORD_IS_REQUIRED').isString().isLength({ min: 6 }),
  body('code', 'CODE_IS_REQUIRED').isInt(),
  fieldValidator
], authControllers.resetPassword);

export default router;