import prisma from '../config/db.js';

const sanitizeCourseData = (data = {}) => {
  const {
    id,
    createdAt,
    updatedAt,
    title,
    subtitle,
    description,
    platform,
    creatorRole,
    courseUrl,
    liveUrl,
    thumbnailUrl,
    imageUrl,
    order,
  } = data;

  const clean = {};

  if (title !== undefined) clean.title = title;
  if (subtitle !== undefined) {
    clean.subtitle = subtitle;
  } else if (description !== undefined) {
    clean.subtitle = description;
  }
  if (platform !== undefined) clean.platform = platform;
  if (creatorRole !== undefined) clean.creatorRole = creatorRole;
  if (courseUrl !== undefined) {
    clean.courseUrl = courseUrl;
  } else if (liveUrl !== undefined) {
    clean.courseUrl = liveUrl;
  }
  if (thumbnailUrl !== undefined) {
    clean.thumbnailUrl = thumbnailUrl;
  } else if (imageUrl !== undefined) {
    clean.thumbnailUrl = imageUrl;
  }
  if (order !== undefined) clean.order = Number(order) || 0;

  return clean;
};

export const courseService = {
  getAllCourses: async () => {
    return await prisma.course.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createCourse: async (data) => {
    const cleanData = sanitizeCourseData(data);
    return await prisma.course.create({ data: cleanData });
  },

  updateCourse: async (id, data) => {
    const updateData = sanitizeCourseData(data);
    return await prisma.course.update({
      where: { id },
      data: updateData,
    });
  },

  deleteCourse: async (id) => {
    return await prisma.course.delete({
      where: { id },
    });
  },
};

