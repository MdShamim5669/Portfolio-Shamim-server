import { campusMomentService } from '../services/campusMomentService.js';
import { uploadService } from '../services/uploadService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getCampusMoments = async (req, res, next) => {
  try {
    const moments = await campusMomentService.getAll();
    return sendSuccess(res, 'Campus moments retrieved successfully', moments);
  } catch (error) {
    next(error);
  }
};

export const getCampusMomentById = async (req, res, next) => {
  try {
    const moment = await campusMomentService.getById(req.params.id);
    if (!moment) {
      return sendError(res, 'Campus moment not found', 404);
    }
    return sendSuccess(res, 'Campus moment retrieved successfully', moment);
  } catch (error) {
    next(error);
  }
};

export const createCampusMoment = async (req, res, next) => {
  try {
    let imageUrls = [];

    // Parse existing imageUrls from body if passed as JSON/string/array
    if (req.body.imageUrls) {
      if (typeof req.body.imageUrls === 'string') {
        try {
          imageUrls = JSON.parse(req.body.imageUrls);
        } catch {
          imageUrls = [req.body.imageUrls];
        }
      } else if (Array.isArray(req.body.imageUrls)) {
        imageUrls = req.body.imageUrls;
      }
    }

    // Process multiple photos uploaded via Multer (req.files)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadService.uploadFileToCloudinary(file)
      );
      const uploadResults = await Promise.all(uploadPromises);
      const uploadedUrls = uploadResults.map((res) => res.url);
      imageUrls = [...imageUrls, ...uploadedUrls];
    }

    const momentData = {
      title: req.body.title,
      category: req.body.category || 'Campus Life',
      description: req.body.description || '',
      imageUrls,
      order: req.body.order !== undefined ? parseInt(req.body.order) : 0,
    };

    const newMoment = await campusMomentService.create(momentData);
    return sendSuccess(res, 'Campus moment created successfully', newMoment, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCampusMoment = async (req, res, next) => {
  try {
    let imageUrls;

    if (req.body.imageUrls) {
      if (typeof req.body.imageUrls === 'string') {
        try {
          imageUrls = JSON.parse(req.body.imageUrls);
        } catch {
          imageUrls = [req.body.imageUrls];
        }
      } else if (Array.isArray(req.body.imageUrls)) {
        imageUrls = req.body.imageUrls;
      }
    }

    // Process new photos uploaded via Multer (req.files)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadService.uploadFileToCloudinary(file)
      );
      const uploadResults = await Promise.all(uploadPromises);
      const uploadedUrls = uploadResults.map((res) => res.url);
      imageUrls = imageUrls ? [...imageUrls, ...uploadedUrls] : uploadedUrls;
    }

    const momentData = {
      ...req.body,
    };
    if (imageUrls) {
      momentData.imageUrls = imageUrls;
    }

    const updated = await campusMomentService.update(req.params.id, momentData);
    return sendSuccess(res, 'Campus moment updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteCampusMoment = async (req, res, next) => {
  try {
    await campusMomentService.delete(req.params.id);
    return sendSuccess(res, 'Campus moment deleted successfully');
  } catch (error) {
    next(error);
  }
};
