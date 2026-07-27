import prisma from '../config/db.js';

export const profileService = {
  getProfile: async () => {
    return await prisma.profile.findFirst();
  },

  updateProfile: async (data) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      return await prisma.profile.create({ data });
    }
    return await prisma.profile.update({
      where: { id: profile.id },
      data,
    });
  },
};
