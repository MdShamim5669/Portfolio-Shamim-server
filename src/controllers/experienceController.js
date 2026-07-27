import prisma from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getExperiences = async (req, res, next) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });
    return sendSuccess(res, 'Experiences retrieved', experiences);
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const exp = await prisma.experience.create({ data: req.body });
    return sendSuccess(res, 'Experience created', exp, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    return sendSuccess(res, 'Experience deleted');
  } catch (error) {
    next(error);
  }
};
