import db from '../config/index.js';

const specialtyServices = {
  getSpecialties: async () => {
    try {
      const specialties = await db.Specialty.findAll();
      return specialties;
    } catch (error) {
      throw error
    }
  },

  getProfessionalsBySpecialty: async (specialtyId) => {
    try {
      const specialty = await db.Specialty.findByPk(specialtyId);

      if (!specialty) {
        throw {
          layer: 'specialtyServices',
          key: 'SPECIALTY_NOT_FOUND',
          statusCode: 404
        }
      }

      const professionalSpecialty = await db.ProfessionalSpecialty.findAll({
        where: {
          specialty_id: specialtyId
        }
      });

      if (professionalSpecialty.length === 0) {
        throw {
          layer: 'specialtyServices',
          key: 'SPECIALTY_DOES_NOT_HAVE_PROFESSIONAL',
          statusCode: 404
        }
      }

      const professionals = await db.User.findAll({
        where: { id: professionalSpecialty.map(item => item.professional_id) },
        attributes: { exclude: ['role_id', 'updatedAt', 'deletedAt', 'password'] }
      });

      return professionals;
    } catch (error) {
      throw error
    }
  },

  createSpecialty: async ({ name }) => {
    try {
      const isSpecialtyAlreadyExists = await db.Specialty.findOne({ where: { name } });

      if (isSpecialtyAlreadyExists) {
        throw {
          layer: 'specialtyServices',
          key: 'SPECIALTY_ALREADY_EXISTS',
          statusCode: 409
        }
      }

      const specialty = await db.Specialty.create({ name });
      return specialty.get({ plain: true });
    } catch (error) {
      throw error
    }
  },

  addProfessionalToSpecialty: async ({ professionalId, specialtyId }) => {
    try {
      const isProfessionalExists = await db.User.findOne({ where: { id: professionalId, role_id: 2 } });
      if (!isProfessionalExists) throw {
        layer: 'specialtyServices',
        key: 'PROFESSIONAL_NOT_FOUND',
        statusCode: 404
      }

      const isSpecialtyExists = await db.Specialty.findOne({ where: { id: specialtyId } });
      if (!isSpecialtyExists) throw {
        layer: 'specialtyServices',
        key: 'SPECIALTY_NOT_FOUND',
        statusCode: 404
      }

      const professionalHasSpecialty = await db.ProfessionalSpecialty.findOne({ where: { professional_id: professionalId, specialty_id: specialtyId } });
      if (professionalHasSpecialty) {
        throw {
          layer: 'specialtyServices',
          key: 'SPECIALTY_ALREADY_EXISTS',
          statusCode: 409
        }
      }

      await db.ProfessionalSpecialty.create({ professional_id: professionalId, specialty_id: specialtyId });

      return "El profesional ha sido añadido correctamente a la especialidad.";
    } catch (error) {
      throw error
    }
  },

  deleteProfessionalFromSpecialty: async ({ professionalId, specialtyId }) => {
    try {
      const deletedProfessionalSpeciality = await db.ProfessionalSpecialty.destroy({
        where: {
          professional_id: professionalId,
          specialty_id: specialtyId
        }
      });

      if (deletedProfessionalSpeciality === 0) {
        throw {
          layer: 'specialtyServices',
          key: 'PROFESSIONAL_DOES_NOT_HAVE_SPECIALTY',
          statusCode: 404
        }
      }

      return "El profesional ha sido eliminado correctamente de la especialidad.";
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  deleteSpecialtyById: async (specialtyId) => {
    try {
      const deletedSpecialty = await db.Specialty.destroy({
        where: {
          id: specialtyId
        }
      });

      if (deletedSpecialty === 0) {
        throw {
          layer: 'specialtyServices',
          key: 'SPECIALTY_NOT_FOUND',
          statusCode: 404
        }
      }
      
      return "La especialidad ha sido eliminada correctamente.";
    } catch (error) {
      throw error
    }
  }
}

export default specialtyServices;