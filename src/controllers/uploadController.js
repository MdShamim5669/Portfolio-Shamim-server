import { uploadService } from '../services/uploadService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const uploadFile = async (req, res, next) => {
  try {
    const data = await uploadService.uploadFileToCloudinary(req.file);
    return sendSuccess(res, 'File uploaded to Cloudinary successfully', data);
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    next(error);
  }
};
