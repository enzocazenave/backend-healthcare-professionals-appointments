import { request, response } from 'express';
import { sendErrorResponse } from '../adapters/http.js';
import jwt from 'jsonwebtoken'

const tokenValidator = (req = request, res = response, next) => { 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendErrorResponse(res, 401, { layer: 'middlewareTokenValidator', key: 'TOKEN_NOT_FOUND' });
  }
  
  try {
    const tokenPayload = jwt.verify(token, process.env.SECRET_JWT_TOKEN_KEY);
    req.user = tokenPayload;
    next();
  } catch(error) {
    sendErrorResponse(res, 401, { layer: 'middlewareTokenValidator', key: 'TOKEN_NOT_VALID' });
  }
}

export default tokenValidator;