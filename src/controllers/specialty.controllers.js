import { request, response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../adapters/http.js';
import specialtyServices from '../services/specialty.services.js';

const specialtyControllers = {
  getSpecialties: async (req = request, res = response) => {
    try {
      const response = await specialtyServices.getSpecialties();
      sendSuccessResponse(res, 200, response);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  getProfessionalsBySpecialty: async (req = request, res = response) => {
    try {
      const response = await specialtyServices.getProfessionalsBySpecialty(req.params.specialtyId);
      sendSuccessResponse(res, 200, response);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  createSpecialty: async (req = request, res = response) => {
    try {
      const response = await specialtyServices.createSpecialty(req.body);
      sendSuccessResponse(res, 201, response);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  addProfessionalToSpecialty: async (req = request, res = response) => {
    try {
      const response = await specialtyServices.addProfessionalToSpecialty({
        professionalId: req.params.professionalId,
        specialtyId: req.body.specialtyId
      });
      sendSuccessResponse(res, 201, response);
    } catch (error) {
      console.log(error)
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  deleteProfessionalFromSpecialty: async (req = request, res = response) => {
    try {
      const response = await specialtyServices.deleteProfessionalFromSpecialty({
        professionalId: req.params.professionalId,
        specialtyId: req.body.specialtyId
      });    
      sendSuccessResponse(res, 200, response);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  deleteSpecialtyById: async (req = request, res = response) => {
    try {
      const response = await specialtyServices.deleteSpecialtyById(req.params.specialtyId);
      sendSuccessResponse(res, 200, response);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default specialtyControllers;