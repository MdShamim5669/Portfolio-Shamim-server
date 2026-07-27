import prisma from '../config/db.js';

export const experienceService = {
  getAllExperiences: async () => {
    return await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createExperience: async (data) => {
    return await prisma.experience.create({ data });
  },

  deleteExperience: async (id) => {
    return await prisma.experience.delete({
      where: { id },
    });
  },
};
