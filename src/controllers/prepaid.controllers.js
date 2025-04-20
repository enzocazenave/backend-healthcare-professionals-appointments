import { sendErrorResponse, sendSuccessResponse } from "../adapters/http.js";
import prepaidServices from "../services/prepaid.services.js";

const prepaidControllers = {
  create: async (req = request, res = response) => {
    try {
      const response = await prepaidServices.create({
        name: req.body.name
      });

      sendSuccessResponse(res, 201, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  get: async (req = request, res = response) => {
    try {
      const response = await prepaidServices.get();
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  delete: async (req = request, res = response) => {
    try {
      const response = await prepaidServices.delete(req.params.prepaidId);
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default prepaidControllers;