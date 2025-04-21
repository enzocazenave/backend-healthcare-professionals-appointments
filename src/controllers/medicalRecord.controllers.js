import { sendErrorResponse, sendSuccessResponse } from "../adapters/http.js";
import medicalRecordServices from '../services/medicalRecord.services.js';

const medicalRecordControllers = {
  getPatientMedicalRecords: async (req = request, res = response) => {
    try {
      const response = await medicalRecordServices.getPatientMedicalRecords({
        patientId: req.params.patientId
      });
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  createPatientMedicalRecord: async (req = request, res = response) => {
    try {
      const response = await medicalRecordServices.createPatientMedicalRecord({
        patientId: req.params.patientId,
        record: req.body.record,
        fileUrl: req.body.fileUrl
      });
      sendSuccessResponse(res, 201, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  deleteMedicalRecord: async (req = request, res = response) => {
    try {
      const response = await medicalRecordServices.deleteMedicalRecord({
        medicalRecordId: req.params.medicalRecordId
      });
      sendSuccessResponse(res, 200, response);
    } catch(error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default medicalRecordControllers;