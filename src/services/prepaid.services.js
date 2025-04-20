import db from "../config/index.js"

const prepaidServices = {
  create: async ({ name }) => {
    try {
      const isPrepaidAlreadyExists = await db.Prepaid.findOne({ where: { name } });

      if (isPrepaidAlreadyExists) {
        throw {
          layer: 'prepaidServices',
          key: 'PREPAID_ALREADY_EXISTS',
          statusCode: 409
        }
      }

      await db.Prepaid.create({ name });

      return "La prepaga ha sido creada correctamente.";
    } catch (error) {
      throw error;
    }
  },

  get: async () => {
    try {
      const prepaids = await db.Prepaid.findAll();
      return prepaids;
    } catch (error) {
      throw error;
    }
  },

  delete: async (prepaidId) => {
    try {
      const deletedPrepaid = await db.Prepaid.destroy({
        where: {
          id: prepaidId
        }
      });

      if (deletedPrepaid === 0) {
        throw {
          layer: 'prepaidServices',
          key: 'PREPAID_NOT_FOUND',
          statusCode: 404
        }
      }

      return "La prepaga ha sido eliminada correctamente.";
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}

export default prepaidServices;