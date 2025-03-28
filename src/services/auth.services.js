import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import generateToken from '../helpers/generateToken.js';

const authServices = {
  register: async ({ fullName, email, password, role_id }) => {
    try {
      const isEmailAlreadyRegistered = await User.findOne({ where: { email: email } });

      if (isEmailAlreadyRegistered) throw {
        layer: 'authServices',
        key: 'EMAIL_ALREADY_REGISTERED'
      }
      
      const hashedPassword = hashSync(password, genSaltSync());

      const user = await User.create({
        full_name: fullName,
        email: email,
        password: hashedPassword,
        role_id: role_id ?? 1
      });

      const tokenPayload = {
        userId: user.id,
        userRole: user.role_id
      }

      const token = generateToken(
        tokenPayload,
        process.env.SECRET_JWT_TOKEN_KEY,
        process.env.SECRET_JWT_TOKEN_EXPIRATION
      )

      const refreshToken = generateToken(
        tokenPayload,
        process.env.SECRET_JWT_REFRESH_TOKEN_KEY,
        process.env.SECRET_JWT_REFRESH_TOKEN_EXPIRATION
      )

      return {
        ...tokenPayload,
        token,
        refreshToken
      }
    } catch(error) {
      throw error;
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ where: { email: email } });

      if (!user) throw { 
        layer: 'authServices', 
        key: 'INCORRECT_CREDENTIALS'
      }

      const isPasswordValid = compareSync(password, user.password);

      if (!isPasswordValid) throw { 
        layer: 'authServices', 
        key: 'INCORRECT_CREDENTIALS'
      }

      const tokenPayload = {
        userId: user.id,
        userRole: user.role_id
      }

      const token = generateToken(
        tokenPayload,
        process.env.SECRET_JWT_TOKEN_KEY,
        process.env.SECRET_JWT_TOKEN_EXPIRATION
      )

      const refreshToken = generateToken(
        tokenPayload,
        process.env.SECRET_JWT_REFRESH_TOKEN_KEY,
        process.env.SECRET_JWT_REFRESH_TOKEN_EXPIRATION
      )

      return {
        ...tokenPayload,
        token,
        refreshToken
      }
    } catch(error) {
      throw error
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const { userId, userRole } = jwt.verify(refreshToken, process.env.SECRET_JWT_REFRESH_TOKEN_KEY);
      const newToken = generateToken({ userId, userRole }, process.env.SECRET_JWT_TOKEN_KEY, process.env.SECRET_JWT_TOKEN_EXPIRATION);

      return {
        userId,
        userRole,
        token: newToken
      };
    } catch(error) {
      throw { layer: 'authServices', key: 'REFRESH_TOKEN_IS_INVALID' }
    }
  },

  forgotPassword: async () => {

  },

  resetPassword: async () => {

  }
}

export default authServices;