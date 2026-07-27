import cloudinary from '../config/cloudinary.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'samim_portfolio',
      resource_type: 'auto', // handles image, video, raw pdf/files
    });

    return sendSuccess(res, 'File uploaded to Cloudinary successfully', {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    next(error);
  }
};
