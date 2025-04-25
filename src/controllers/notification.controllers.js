import { sendErrorResponse, sendSuccessResponse } from "../adapters/http.js";
import notificationServices from "../services/notification.services.js";

const notificationControllers = {
  get: async (req = request, res = response) => {
    try {
      const response = await notificationServices.get(req.user.userId);
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  create: async (req = request, res = response) => {
    try {
      const response = await notificationServices.create({
        message: req.body.message,
        userId: req.body.userId
      });

      sendSuccessResponse(res, 201, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  read: async (req = request, res = response) => {
    try {
      const response = await notificationServices.read(req.params.notificationId);
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default notificationControllers;