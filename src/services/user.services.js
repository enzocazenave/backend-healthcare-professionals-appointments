import Prepaid from '../models/Prepaid.js';
import Role from '../models/Role.js';
import User from '../models/User.js';

const userServices = {
  getUserById: async (userId) => {
    try {
      const user = await User.findOne({
        where: { id: userId},
        attributes: { exclude: ['role_id', 'prepaid_id', 'password', 'deletedAt']},
        include: [{ model: Role }, { model: Prepaid }]
      });

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  addPrepaid: async (userId, { name, plan, code }) => {
    try {
      const user = await User.findByPk(userId);

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      if (user.prepaid_id) throw {
        layer: 'userServices',
        key: 'PREPAID_ALREADY_EXISTS',
        statusCode: 409
      }

      const prepaid = await Prepaid.create({ name, plan, code });
      await user.update({ prepaid_id: prepaid.id });

      return "La prepaga ha sido añadida correctamente.";
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (userId, { phoneNumber, name, plan, code }) => {
    try {
      const user = await User.findByPk(userId);

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      if (phoneNumber) {
        await user.update({ phone_number: phoneNumber });
      }

      if (user.prepaid_id) {
        const updatedFields = {}

        if (name) updatedFields.name = name;
        if (plan) updatedFields.plan = plan;
        if (code) updatedFields.code = code;

        if (Object.keys(updatedFields).length > 0) {
          await Prepaid.update(updatedFields, { where: { id: user.prepaid_id } });
        }
      }

      return "Datos actualizados correctamente.";
    } catch (error) {
      throw error;
    }
  },

  deleteUserById: async (userId) => {
    try {
      const user = await User.findByPk(userId);

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      await user.destroy();

      return "Usuario eliminado correctamente.";
    } catch (error) {
      throw error;
    }
  }
}

export default userServices;