import prisma from '../config/db.js';

export const projectService = {
  getAllProjects: async () => {
    return await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createProject: async (data) => {
    return await prisma.project.create({ data });
  },

  updateProject: async (id, data) => {
    return await prisma.project.update({
      where: { id },
      data,
    });
  },

  deleteProject: async (id) => {
    return await prisma.project.delete({
      where: { id },
    });
  },
};
