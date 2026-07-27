import cloudinary from '../config/cloudinary.js';
import prisma from '../config/db.js';

const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  // Match Cloudinary URL pattern: samim_portfolio/...
  const regex = /(samim_portfolio\/[^.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const projectService = {
  getAllProjects: async () => {
    return await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createProject: async (data) => {
    return await prisma.project.create({ data });
  },

  updateProject: async (id, data) => {
    return await prisma.project.update({
      where: { id },
      data,
    });
  },

  deleteProject: async (id) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (project) {
      const thumbnailPublicId = extractPublicIdFromUrl(project.thumbnailUrl);
      const videoPublicId = extractPublicIdFromUrl(project.videoDemoUrl);

      if (thumbnailPublicId) {
        try {
          await cloudinary.uploader.destroy(thumbnailPublicId);
        } catch (err) {
          console.error('Cloudinary Thumbnail Cleanup Error:', err);
        }
      }
      if (videoPublicId) {
        try {
          await cloudinary.uploader.destroy(videoPublicId, { resource_type: 'video' });
        } catch (err) {
          console.error('Cloudinary Video Cleanup Error:', err);
        }
      }
    }

    return await prisma.project.delete({
      where: { id },
    });
  },
};
