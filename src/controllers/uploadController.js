import { uploadService } from '../services/uploadService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const uploadFile = async (req, res, next) => {
  try {
    const data = await uploadService.uploadFileToCloudinary(req.file);
    return sendSuccess(res, 'File uploaded to Cloudinary successfully', data);
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return sendError(res, 'public_id is required', 400);
    }
    const result = await uploadService.deleteFileFromCloudinary(public_id);
    return sendSuccess(res, 'File deleted from Cloudinary', result);
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    next(error);
  }
};
