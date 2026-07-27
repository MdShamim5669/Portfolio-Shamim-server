import { profileService } from '../services/profileService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile();
    return sendSuccess(res, 'Profile retrieved successfully', profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await profileService.updateProfile(req.body);
    return sendSuccess(res, 'Profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};
