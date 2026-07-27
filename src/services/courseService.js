import prisma from '../config/db.js';

export const courseService = {
  getAllCourses: async () => {
    return await prisma.course.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createCourse: async (data) => {
    return await prisma.course.create({ data });
  },

  deleteCourse: async (id) => {
    return await prisma.course.delete({
      where: { id },
    });
  },
};
