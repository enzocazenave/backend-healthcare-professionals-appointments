import { request, response } from 'express'
import { sendErrorResponse, sendSuccessResponse } from '../adapters/http.js';
import authServices from '../services/auth.services.js';

const authControllers = {
  register: async (req = request, res = response) => {
    try {
      const response = await authServices.register({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        role_id: req.body?.roleId
      });

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.SECRET_JWT_REFRESH_TOKEN_MAX_AGE
      });

      sendSuccessResponse(res, 201, {
        userId: response.userId,
        userRole: response.userRole,
        token: response.token
      });
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  login: async (req = request, res = response) => {
    try {
      const response = await authServices.login({
        email: req.body.email,
        password: req.body.password
      });

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.SECRET_JWT_REFRESH_TOKEN_MAX_AGE
      });

      sendSuccessResponse(res, 200, {
        userId: response.userId,
        userRole: response.userRole,
        token: response.token
      });
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  refreshToken: async (req = request, res = response) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) throw { layer: 'authControllers', key: 'REFRESH_TOKEN_IS_REQUIRED', statusCode: 401 }  

      const response = await authServices.refreshToken(refreshToken);
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  logout: async (req = request, res = response) => {
    try {
      if (!req.cookies.refreshToken) throw { layer: 'authControllers', key: 'REFRESH_TOKEN_IS_REQUIRED', statusCode: 401 }
      
      res.clearCookie('refreshToken');
      sendSuccessResponse(res, 200, "Sesión cerrada correctamente.");
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  forgotPassword: async (req = request, res = response) => {
    try {
      await authServices.forgotPassword({
        email: req.body.email
      });

      sendSuccessResponse(res, 200, {});
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  resetPassword: async (req = request, res = response) => {
    try {
      const response = await authServices.resetPassword({
        email: req.body.email,
        password: req.body.password,
        code: req.body.code
      });

      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default authControllers;