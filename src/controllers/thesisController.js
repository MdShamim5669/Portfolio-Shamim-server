import { thesisService } from '../services/thesisService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getThesis = async (req, res, next) => {
  try {
    const thesis = await thesisService.getThesis();
    return sendSuccess(res, 'Thesis data retrieved', thesis);
  } catch (error) {
    next(error);
  }
};

export const updateThesis = async (req, res, next) => {
  try {
    const updated = await thesisService.updateThesis(req.body);
    return sendSuccess(res, 'Thesis updated', updated);
  } catch (error) {
    next(error);
  }
};
