import { response } from 'express';
import formatError from './formatError.js';

const sendSuccessResponse = (res = response, statusCode, data = {}) => {
  res.status(statusCode).json({
    ok: true,
    status: statusCode,
    error: null,
    data
  })
}

const sendErrorResponse = (res = response, statusCode, error = {}) => {
  const formattedError = error.layer && formatError(error)

  const formattedResponse = {
    ok: false,
    status: statusCode,
    error: formattedError ?? 'Ocurrió un error inesperado.',
    data: {}
  }

  res.status(statusCode).json(formattedResponse)
}

export {
  sendErrorResponse,
  sendSuccessResponse
}