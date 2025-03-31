import { request, response } from 'express'
import { sendErrorResponse, sendSuccessResponse } from '../adapters/http.js';
import userServices from '../services/user.services.js';

const userControllers = {
  getUserById: async (req = request, res = response) => {
    try {
      const user = await userServices.getUserById(req.user.userId);

      sendSuccessResponse(res, 200, user);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  addPrepaid: async (req = request, res = response) => {
    try {
      const user = await userServices.addPrepaid(req.user.userId, req.body);

      sendSuccessResponse(res, 200, user);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  updateUserById: async (req = request, res = response) => {
    try {
      const user = await userServices.updateUserById(req.user.userId, req.body);

      sendSuccessResponse(res, 200, user);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  deleteUserById: async (req = request, res = response) => {
    try {
      const user = await userServices.deleteUserById(req.user.userId);
      
      sendSuccessResponse(res, 200, user);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default userControllers;