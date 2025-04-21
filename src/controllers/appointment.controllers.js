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
  },

  complete: async (req = request, res = response) => {
    try {
      const response = await appointmentServices.complete({
        appointmentId: req.params.appointmentId
      });
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },
  
  getAppointmentsByProfessional: async (req = request, res = response) => {
    try {
      const response = await appointmentServices.getAppointmentsByProfessional({
        professionalId: req.params.professionalId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        patientId: req.query.patientId
      });
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  getAppointmentsByPatient: async (req = request, res = response) => {
    try {
      const response = await appointmentServices.getAppointmentsByPatient({
        patientId: req.params.patientId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      });
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  cancelAppointment: async (req = request, res = response) => {
    try {
      const response = await appointmentServices.cancelAppointment({
        appointmentId: req.params.appointmentId
      });
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  getAvailabilityByProfessionalId: async (req = request, res = response) => {
    try {
      const response = await appointmentServices.getAvailabilityByProfessionalId({
        professionalId: req.params.professionalId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      });
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default appointmentControllers;