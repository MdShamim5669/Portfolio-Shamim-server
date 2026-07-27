import { messageService } from '../services/messageService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return sendError(res, 'Name, email, and message are required', 400);
    }

    const newMessage = await messageService.createMessage({ name, email, subject, message });
    return sendSuccess(res, 'Message sent successfully!', newMessage, 201);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getAllMessages();
    return sendSuccess(res, 'Messages retrieved', messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await messageService.deleteMessage(id);
    return sendSuccess(res, 'Message deleted');
  } catch (error) {
    next(error);
  }
};
