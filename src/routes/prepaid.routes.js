import { Router } from "express";
import { body, param } from "express-validator";
import tokenValidator from "../middlewares/tokenValidator.js";
import roleValidator from '../middlewares/roleValidator.js';
import prepaidControllers from "../controllers/prepaid.controllers.js";

const router = Router();

router.post('/', [
  tokenValidator,
  roleValidator(3),
  body('name', 'NAME_IS_REQUIRED').isString(),
], prepaidControllers.create)

router.get('/', [
  tokenValidator,
], prepaidControllers.get)

router.delete('/:prepaidId', [
  tokenValidator,
  roleValidator(3),
  param('prepaidId', 'PREPAID_ID_IS_REQUIRED').isInt({ min: 1 }),
], prepaidControllers.delete)

export default router;