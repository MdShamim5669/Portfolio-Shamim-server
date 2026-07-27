import prisma from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
    });
    return sendSuccess(res, 'Courses retrieved', courses);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    return sendSuccess(res, 'Course created', course, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    return sendSuccess(res, 'Course deleted');
  } catch (error) {
    next(error);
  }
};
