import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import User from '../models/User.js';
import PasswordResetCode from '../models/PasswordResetCode.js';
import generateToken from '../utils/generateToken.js';
import { Sequelize } from 'sequelize';
import sendMail from '../utils/sendMail.js';

const authServices = {
  register: async ({ fullName, email, password, role_id }) => {
    try {
      const isEmailAlreadyRegistered = await User.findOne({ where: { email: email }, paranoid: false });

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

  forgotPassword: async ({ email }) => {
    try {
      const user = await User.findOne({ where: { email: email } });

      if (!user) throw { 
        layer: 'authServices', 
        key: 'EMAIL_NOT_FOUND'
      }

      await PasswordResetCode.destroy({ 
        where: {
          expirates_at: {
            [Sequelize.Op.lt]: new Date()
          }
        } 
      });

      await PasswordResetCode.destroy({ where: { email: email } });

      const code = crypto.randomInt(100000, 999999).toString();
      const currentTime = new Date().getTime();
      const codeExpiration = new Date(currentTime + (1000 * 60 * 5));

      const emailBody = `
        <h1 style="font-size: 24px">Hola ${user.full_name}, solicitaste un cambio de contraseña.</h1>
        <p style="font-size: 20px">Tu código de recuperación de contraseña es: <strong>${code}</strong></p>
        <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
      `

      await sendMail(email, 'Código de recuperación de contraseña', emailBody);

      await PasswordResetCode.create({
        code,
        email,
        expirates_at: codeExpiration
      });

    } catch(error) {
      console.log(error)
      throw error;
    }
  },

  resetPassword: async ({ email, password, code  }) => { 
    try {
      const passwordResetCode = await PasswordResetCode.findOne({ where: { code, email } });

      if (!passwordResetCode) throw { 
        layer: 'authServices', 
        key: 'CODE_NOT_FOUND'
      }

      const isCodeExpired = passwordResetCode.expirates_at < new Date();

      if (isCodeExpired) throw { 
        layer: 'authServices', 
        key: 'CODE_EXPIRED'
      }

      const hashedPassword = hashSync(password, genSaltSync());
      
      await User.update({ password: hashedPassword }, { where: { email: email } });
      await PasswordResetCode.destroy({ where: { code, email } });

      return "La contraseña ha sido actualizada correctamente.";
    } catch(error) {
      throw error;
    }
  }
}

export default authServices;