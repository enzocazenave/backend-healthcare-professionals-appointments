import { request, response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../adapters/http.js';
import appointmentServices from '../services/appointment.services.js';

const appointmentControllers = {
  create: async (req = request, res = response) => {
    try {
      const response = await appointmentServices.create(
        {
          ...req.body,
          patientId: req.body.patientId ?? req.user.userId
        }, 
        req.user
      );
      sendSuccessResponse(res, 201, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default appointmentControllers;