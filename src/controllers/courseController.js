import { courseService } from '../services/courseService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();
    return sendSuccess(res, 'Courses retrieved', courses);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body);
    return sendSuccess(res, 'Course created', course, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await courseService.updateCourse(id, req.body);
    return sendSuccess(res, 'Course updated', course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await courseService.deleteCourse(id);
    return sendSuccess(res, 'Course deleted');
  } catch (error) {
    next(error);
  }
};
