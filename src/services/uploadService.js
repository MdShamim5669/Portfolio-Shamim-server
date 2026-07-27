import cloudinary from '../config/cloudinary.js';

export const uploadService = {
  uploadFileToCloudinary: async (file) => {
    if (!file) {
      const error = new Error('No file uploaded');
      error.statusCode = 400;
      throw error;
    }

    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'samim_portfolio',
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  },

  deleteFileFromCloudinary: async (publicId) => {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  },
};
