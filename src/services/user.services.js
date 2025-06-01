import db from '../config/index.js';

const userServices = {
  getUserById: async (userId) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId},
        attributes: { exclude: ['role_id', 'password', 'deletedAt']},
        include: [{ model: db.Role }]
      });

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      return user;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  getPrepaids: async (userId) => {
    try {
      const user = await db.User.findByPk(userId);

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      const prepaids = await db.PrepaidAffiliation.findAll({
        where: { user_id: userId },
        include: [{ model: db.Prepaid }],
        attributes: { exclude: ['user_id', 'prepaid_id'] }
      });

      return prepaids;
    } catch (error) {
      throw error;
    }
  },

  addPrepaid: async (userId, { prepaidId, plan, number }) => {
    try {
      const user = await db.User.findByPk(userId);

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      const isPrepaidExists = await db.Prepaid.findOne({ where: { id: prepaidId } });

      if (!isPrepaidExists) throw {
        layer: 'userServices',
        key: 'PREPAID_NOT_FOUND',
        statusCode: 404
      }

      const prepaidAffiliation = await db.PrepaidAffiliation.findOne({
        where: { user_id: userId, prepaid_id: prepaidId }
      })

      if (prepaidAffiliation) throw {
        layer: 'userServices',
        key: 'USER_ALREADY_AFFILIATED',
        statusCode: 409
      }

      await db.PrepaidAffiliation.create({ user_id: userId, prepaid_id: prepaidId, plan, number });

      return "La afiliación a la prepaga ha sido añadida correctamente.";
    } catch (error) {
      throw error;
    }
  },

  deletePrepaid: async (userId, { prepaidId }) => {
    try {
      const user = await db.User.findByPk(userId);

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      const isPrepaidExists = await db.Prepaid.findOne({ where: { id: prepaidId } });

      if (!isPrepaidExists) throw {
        layer: 'userServices',
        key: 'PREPAID_NOT_FOUND',
        statusCode: 404
      }

      const prepaidAffiliation = await db.PrepaidAffiliation.findOne({
        where: { user_id: userId, prepaid_id: prepaidId }
      })

      if (!prepaidAffiliation) throw {
        layer: 'userServices',
        key: 'USER_NOT_AFFILIATED',
        statusCode: 409
      }

      await prepaidAffiliation.destroy();
      
      return "La afiliación a la prepaga ha sido eliminada correctamente.";
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (userId, { phoneNumber, fullName, dni }) => {
    try {
      const user = await db.User.findByPk(userId);

      if (!user) throw {
        layer: 'userServices',
        key: 'USER_NOT_FOUND',
        statusCode: 404
      }

      const updateData = {};
      
      if (phoneNumber) updateData.phone_number = phoneNumber;
      if (fullName) updateData.full_name = fullName; 
      if (dni) updateData.dni = dni;

      await user.update(updateData);

      return "Datos actualizados correctamente.";
    } catch (error) {
      throw error;
    }
  },

  deleteUserById: async (userId) => {
    try {
      const user = await db.User.findByPk(userId);

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