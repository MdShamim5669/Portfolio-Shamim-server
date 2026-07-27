import { authService } from '../services/authService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const data = await authService.login(email, password);
    return sendSuccess(res, 'Login successful', data);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 'User profile fetched', req.user);
  } catch (error) {
    next(error);
  }
};
