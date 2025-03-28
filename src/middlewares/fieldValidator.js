import { request, response } from 'express';
import { validationResult } from 'express-validator';
import { sendErrorResponse } from '../adapters/http.js';

const fieldValidator = (req = request, res = response, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const removeDuplicatedErrors = errors.array().reduce((acc, curr) => {
      if (!acc.find(item => item.path === curr.path)) {
          acc.push(curr)
      }
      return acc
    }, []);

    const errorsFormatted = {
      layer: 'middlewareFieldValidator',
      keys: removeDuplicatedErrors.map(error => ({ key: error.msg, field: error.path }))
    }

    return sendErrorResponse(res, 400, errorsFormatted);
  }

  next();
}

export default fieldValidator;