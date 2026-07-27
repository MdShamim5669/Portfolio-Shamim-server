import prisma from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getSkills = async (req, res, next) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });
    return sendSuccess(res, 'Skills retrieved', skills);
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const skill = await prisma.skill.create({ data: req.body });
    return sendSuccess(res, 'Skill created successfully', skill, 201);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.skill.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, 'Skill updated', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    return sendSuccess(res, 'Skill deleted');
  } catch (error) {
    next(error);
  }
};
