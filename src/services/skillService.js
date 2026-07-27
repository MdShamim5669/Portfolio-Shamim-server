import prisma from '../config/db.js';

export const skillService = {
  getAllSkills: async () => {
    return await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createSkill: async (data) => {
    return await prisma.skill.create({ data });
  },

  updateSkill: async (id, data) => {
    return await prisma.skill.update({
      where: { id },
      data,
    });
  },

  deleteSkill: async (id) => {
    return await prisma.skill.delete({
      where: { id },
    });
  },
};
