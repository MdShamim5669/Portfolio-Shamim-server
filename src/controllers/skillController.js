import { skillService } from '../services/skillService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getSkills = async (req, res, next) => {
  try {
    const skills = await skillService.getAllSkills();
    return sendSuccess(res, 'Skills retrieved', skills);
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const skill = await skillService.createSkill(req.body);
    return sendSuccess(res, 'Skill created successfully', skill, 201);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await skillService.updateSkill(id, req.body);
    return sendSuccess(res, 'Skill updated', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    await skillService.deleteSkill(id);
    return sendSuccess(res, 'Skill deleted');
  } catch (error) {
    next(error);
  }
};
