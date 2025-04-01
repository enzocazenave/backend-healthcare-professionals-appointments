import { request, response } from 'express';

const scheduleControllers = {
  createProfessionalSchedule: async (req = request, res = response) => {},

  getProfessionalSchedules: async (req = request, res = response) => {},

  deleteProfessionalSchedule: async (req = request, res = response) => {},

  createProfessionalScheduleBlock: async (req = request, res = response) => {},

  getProfessionalScheduleBlocks: async (req = request, res = response) => {},

  deleteProfessionalScheduleBlock: async (req = request, res = response) => {}
}

export default scheduleControllers;