import cloudinary from '../config/cloudinary.js';
import prisma from '../config/db.js';

export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  // Universally extracts public_id after /upload/(v12345/)? up to file extension
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
};

export const deleteCloudinaryAsset = async (url, resourceType = 'image') => {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`[Cloudinary Cleanup] Deleted ${resourceType} "${publicId}":`, result?.result);
    return result;
  } catch (err) {
    console.error(`[Cloudinary Cleanup] Error deleting "${publicId}":`, err.message);
    return null;
  }
};

export const projectService = {
  extractPublicIdFromUrl,
  deleteCloudinaryAsset,

  getAllProjects: async () => {
    return await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createProject: async (data) => {
    const { id: _id, createdAt: _c, updatedAt: _u, ...cleanData } = data;
    return await prisma.project.create({ data: cleanData });
  },

  updateProject: async (id, data) => {
    const { id: _id, createdAt: _c, updatedAt: _u, ...cleanData } = data;
    
    // 1. Fetch existing project first to compare media URLs
    const existing = await prisma.project.findUnique({ where: { id } });

    // 2. Perform DB update FIRST (Two-Phase Commit / Safe Replacement)
    const updated = await prisma.project.update({
      where: { id },
      data: cleanData,
    });

    // 3. ONLY after DB update succeeds: destroy replaced old thumbnail from Cloudinary
    if (cleanData.thumbnailUrl && existing?.thumbnailUrl && cleanData.thumbnailUrl !== existing.thumbnailUrl) {
      deleteCloudinaryAsset(existing.thumbnailUrl).catch((err) => {
        console.error('[Cloudinary] Failed to clean up old thumbnail:', err);
      });
    }

    // 4. ONLY after DB update succeeds: destroy replaced old video demo from Cloudinary
    if (cleanData.videoDemoUrl && existing?.videoDemoUrl && cleanData.videoDemoUrl !== existing.videoDemoUrl) {
      deleteCloudinaryAsset(existing.videoDemoUrl, 'video').catch((err) => {
        console.error('[Cloudinary] Failed to clean up old video:', err);
      });
    }

    return updated;
  },

  deleteProject: async (id) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (project) {
      if (project.thumbnailUrl) deleteCloudinaryAsset(project.thumbnailUrl).catch(console.error);
      if (project.videoDemoUrl) deleteCloudinaryAsset(project.videoDemoUrl, 'video').catch(console.error);
    }

    return await prisma.project.delete({
      where: { id },
    });
  },
};
