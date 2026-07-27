import prisma from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findFirst();
    return sendSuccess(res, 'Profile retrieved successfully', profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      const newProfile = await prisma.profile.create({ data: req.body });
      return sendSuccess(res, 'Profile created', newProfile, 201);
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: req.body,
    });
    return sendSuccess(res, 'Profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};
