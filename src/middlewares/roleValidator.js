import { request, response } from 'express';
import { sendErrorResponse } from '../adapters/http.js';

const roleValidator = (requiredRoleId) => {
  return (req = request, res = response, next) => {
    const { userRole } = req.user;

    if (!userRole) {
      return sendErrorResponse(res, 401, { layer: 'middlewareRoleValidator', key: 'USER_DATA_NOT_FOUND' });
    }

    if (userRole < requiredRoleId) {
      return sendErrorResponse(res, 401, { layer: 'middlewareRoleValidator', key: 'USER_DOES_NOT_HAVE_ROLE' });
    }

    next();
  }
}

export default roleValidator;