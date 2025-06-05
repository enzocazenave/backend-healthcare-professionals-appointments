import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { Sequelize } from 'sequelize';
import sendMail from '../utils/sendMail.js';
import db from '../config/index.js';

const authServices = {
  register: async ({ fullName, email, password, role_id }) => {
    try {
      const isEmailAlreadyRegistered = await db.User.findOne({ where: { email: email }, paranoid: false });

      if (isEmailAlreadyRegistered) throw {
        layer: 'authServices',
        key: 'EMAIL_ALREADY_REGISTERED',
        statusCode: 409
      }
      
      const hashedPassword = hashSync(password, genSaltSync());

      const user = await db.User.create({
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
      const user = await db.User.findOne({ where: { email: email } });

      if (!user) throw { 
        layer: 'authServices', 
        key: 'INCORRECT_CREDENTIALS',
        statusCode: 401
      }

      const isPasswordValid = compareSync(password, user.password);

      if (!isPasswordValid) throw { 
        layer: 'authServices', 
        key: 'INCORRECT_CREDENTIALS',
        statusCode: 401
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
      throw { layer: 'authServices', key: 'REFRESH_TOKEN_IS_INVALID', statusCode: 401 }
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const user = await db.User.findOne({ where: { email: email } });

      if (!user) throw { 
        layer: 'authServices', 
        key: 'EMAIL_NOT_FOUND',
        statusCode: 404
      }

      await db.PasswordResetCode.destroy({ 
        where: {
          expirates_at: {
            [Sequelize.Op.lt]: new Date()
          }
        } 
      });

      await db.PasswordResetCode.destroy({ where: { email: email } });

      const code = crypto.randomInt(100000, 999999).toString();
      const currentTime = new Date().getTime();
      const codeExpiration = new Date(currentTime + (1000 * 60 * 5));

      const emailBody = `
        <h1 style="font-size: 24px">Hola ${user.full_name}, solicitaste un cambio de contraseña.</h1>
        <p style="font-size: 20px">Tu código de recuperación de contraseña es: <strong>${code}</strong></p>
        <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
      `

      await sendMail(email, 'Código de recuperación de contraseña', emailBody);

      await db.PasswordResetCode.create({
        code,
        email,
        expirates_at: codeExpiration
      });

    } catch(error) {
      console.log(error)
      throw error;
    }
  },

  validateResetPasswordCode: async ({ email, code }) => {
    try {
      const passwordResetCode = await db.PasswordResetCode.findOne({ where: { code, email } });

      if (!passwordResetCode) throw { 
        layer: 'authServices', 
        key: 'CODE_NOT_FOUND',
        statusCode: 404
      }

      const isCodeExpired = passwordResetCode.expirates_at < new Date();

      if (isCodeExpired) throw { 
        layer: 'authServices', 
        key: 'CODE_EXPIRED',
        statusCode: 400
      }

      return "El código es válido.";
    } catch(error) {
      throw error;
    }
  },

  resetPassword: async ({ email, password, code  }) => { 
    try {
      const passwordResetCode = await db.PasswordResetCode.findOne({ where: { code, email } });

      if (!passwordResetCode) throw { 
        layer: 'authServices', 
        key: 'CODE_NOT_FOUND',
        statusCode: 404
      }

      const isCodeExpired = passwordResetCode.expirates_at < new Date();

      if (isCodeExpired) throw { 
        layer: 'authServices', 
        key: 'CODE_EXPIRED',
        statusCode: 400
      }

      const hashedPassword = hashSync(password, genSaltSync());
      
      await db.User.update({ password: hashedPassword }, { where: { email: email } });
      await db.PasswordResetCode.destroy({ where: { code, email } });

      return "La contraseña ha sido actualizada correctamente.";
    } catch(error) {
      throw error;
    }
  },

  logout: async (userId) => {
    try {
      await db.User.update({ push_token: null }, { where: { id: userId } });
    } catch (error) {
      throw error;
    }
  }
}

export default authServices;