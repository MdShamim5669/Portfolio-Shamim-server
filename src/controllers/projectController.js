import prisma from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return sendSuccess(res, 'Projects retrieved', projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    return sendSuccess(res, 'Project created successfully', project, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.project.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, 'Project updated', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return sendSuccess(res, 'Project deleted');
  } catch (error) {
    next(error);
  }
};
