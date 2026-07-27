import { projectService } from '../services/projectService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    return sendSuccess(res, 'Projects retrieved', projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    return sendSuccess(res, 'Project created successfully', project, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await projectService.updateProject(id, req.body);
    return sendSuccess(res, 'Project updated', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await projectService.deleteProject(id);
    return sendSuccess(res, 'Project deleted');
  } catch (error) {
    next(error);
  }
};
