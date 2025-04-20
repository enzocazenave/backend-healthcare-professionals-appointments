import { request, response } from 'express';
import scheduleServices from '../services/schedule.services.js';
import { sendErrorResponse, sendSuccessResponse } from '../adapters/http.js';

const scheduleControllers = {
  createProfessionalSchedule: async (req = request, res = response) => {
    try {
      const schedule = await scheduleServices.createProfessionalSchedule({
        professionalId: req.params.professionalId,
        dayOfWeek: req.body.dayOfWeek,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        appointmentDuration: req.body.appointmentDuration
      })
      sendSuccessResponse(res, 201, schedule);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  getProfessionalSchedules: async (req = request, res = response) => {
    try {
      const schedules = await scheduleServices.getProfessionalSchedules(req.params.professionalId);
      sendSuccessResponse(res, 200, schedules);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  deleteProfessionalSchedule: async (req = request, res = response) => {
    try {
      const schedule = await scheduleServices.deleteProfessionalSchedule(req.params.professionalScheduleId);
      sendSuccessResponse(res, 200, schedule);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  createProfessionalScheduleBlock: async (req = request, res = response) => {
    try {
      const scheduleBlock = await scheduleServices.createProfessionalScheduleBlock({
        professionalId: req.params.professionalId,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        reason: req.body.reason
      });
      sendSuccessResponse(res, 201, scheduleBlock);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  getProfessionalScheduleBlocks: async (req = request, res = response) => {
    try {
      const scheduleBlocks = await scheduleServices.getProfessionalScheduleBlocks(req.params.professionalId);
      sendSuccessResponse(res, 200, scheduleBlocks);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  },

  deleteProfessionalScheduleBlock: async (req = request, res = response) => {
    try {
      const scheduleBlock = await scheduleServices.deleteProfessionalScheduleBlock(req.params.professionalScheduleBlockId);
      sendSuccessResponse(res, 200, scheduleBlock);
    } catch (error) {
      sendErrorResponse(res, error?.statusCode, error);
    }
  }
}

export default scheduleControllers;