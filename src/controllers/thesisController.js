import prisma from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getThesis = async (req, res, next) => {
  try {
    const thesis = await prisma.thesis.findFirst();
    return sendSuccess(res, 'Thesis data retrieved', thesis);
  } catch (error) {
    next(error);
  }
};

export const updateThesis = async (req, res, next) => {
  try {
    const existing = await prisma.thesis.findFirst();
    if (!existing) {
      const created = await prisma.thesis.create({ data: req.body });
      return sendSuccess(res, 'Thesis record created', created, 201);
    }
    const updated = await prisma.thesis.update({
      where: { id: existing.id },
      data: req.body,
    });
    return sendSuccess(res, 'Thesis updated', updated);
  } catch (error) {
    next(error);
  }
};
