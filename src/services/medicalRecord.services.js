import db from "../config/index.js";

const medicalRecordServices = {
  getPatientMedicalRecords: async ({ patientId }) => {
    try {
      const patient = await db.User.findOne({ where: { id: patientId, role_id: 1 } });

      if (!patient) throw {
        layer: 'medicalRecordServices',
        key: 'PATIENT_NOT_FOUND',
        statusCode: 404
      }

      const medicalRecords = await db.MedicalRecord.findAll({
        where: {
          patient_id: patientId
        },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['professional_id', 'patient_id'] },
        include: [
          {
            model: db.User,
            as: 'professional',
            attributes: ['full_name', 'email', 'phone_number']
          }
        ]
      });

      return medicalRecords;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  createPatientMedicalRecord: async ({ professionalId, patientId, record, fileUrl }) => {
    try {
      const patient = await db.User.findOne({ where: { id: patientId, role_id: 1 } });

      if (!patient) throw {
        layer: 'medicalRecordServices',
        key: 'PATIENT_NOT_FOUND',
        statusCode: 404
      }

      const medicalRecord = await db.MedicalRecord.create({
        professional_id: professionalId,
        patient_id: patientId,
        record: record,
        file_url: fileUrl
      });

      return medicalRecord.get({ plain: true });
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  deleteMedicalRecord: async ({ medicalRecordId }) => {
    try {
      const medicalRecord = await db.MedicalRecord.findByPk(medicalRecordId);

      if (!medicalRecord) throw {
        layer: 'medicalRecordServices',
        key: 'MEDICAL_RECORD_NOT_FOUND',
        statusCode: 404
      }

      await medicalRecord.destroy();

      return "El registro médico fue eliminado correctamente.";
    } catch (error) {
      throw error;
    }
  }
}

export default medicalRecordServices;