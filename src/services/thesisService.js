import prisma from '../config/db.js';

export const thesisService = {
  getThesis: async () => {
    return await prisma.thesis.findFirst();
  },

  updateThesis: async (data) => {
    const existing = await prisma.thesis.findFirst();
    if (!existing) {
      return await prisma.thesis.create({ data });
    }
    return await prisma.thesis.update({
      where: { id: existing.id },
      data,
    });
  },
};
