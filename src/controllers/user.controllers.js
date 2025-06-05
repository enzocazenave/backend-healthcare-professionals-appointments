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

  getPrepaids: async (req = request, res = response) => {
    try {
      const prepaids = await userServices.getPrepaids(req.user.userId);

      sendSuccessResponse(res, 200, prepaids);
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

  deletePrepaid: async (req = request, res = response) => {
    try {
      const user = await userServices.deletePrepaid(req.user.userId, req.body);
      
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
  },

  addOrUpdatePushToken: async (req = request, res = response) => {
    try {
      const response = await userServices.addOrUpdatePushToken(req.user.userId, req.body.pushToken);

      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  deletePushToken: async (req = request, res = response) => {
    try {
      const response = await userServices.deletePushToken(req.user.userId);

      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default userControllers;