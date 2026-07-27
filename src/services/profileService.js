import prisma from '../config/db.js';

export const profileService = {
  getProfile: async () => {
    return await prisma.profile.findFirst();
  },

  updateProfile: async (data) => {
    // Destructure to remove read-only fields
    const { id, createdAt, updatedAt, ...rawCleanData } = data;

    const cleanData = {};
    const allowedFields = [
      'fullName',
      'title',
      'bio',
      'email',
      'phone',
      'location',
      'cgpa',
      'university',
      'degree',
      'profilePicUrl',
      'educationPicUrl',
      'githubUrl',
      'linkedinUrl',
      'resumeUrl',
    ];

    allowedFields.forEach((field) => {
      if (rawCleanData[field] !== undefined) {
        cleanData[field] = rawCleanData[field];
      }
    });

    if (cleanData.cgpa !== undefined && cleanData.cgpa !== null) {
      cleanData.cgpa = parseFloat(cleanData.cgpa) || 3.55;
    }

    const profile = await prisma.profile.findFirst();

    try {
      if (!profile) {
        return await prisma.profile.create({ data: cleanData });
      }
      return await prisma.profile.update({
        where: { id: profile.id },
        data: cleanData,
      });
    } catch (error) {
      // Graceful fallback if profilePicUrl is not yet present on remote DB/cached client
      if (
        error.message &&
        (error.message.includes('profilePicUrl') || error.message.includes('Unknown argument')) &&
        cleanData.profilePicUrl !== undefined
      ) {
        console.warn('`profilePicUrl` omitted for backward compatibility:', error.message);
        delete cleanData.profilePicUrl;

        if (!profile) {
          return await prisma.profile.create({ data: cleanData });
        }
        return await prisma.profile.update({
          where: { id: profile.id },
          data: cleanData,
        });
      }
      throw error;
    }
  },
};
