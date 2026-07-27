import prisma from '../config/db.js';

export const messageService = {
  createMessage: async (data) => {
    return await prisma.message.create({ data });
  },

  getAllMessages: async () => {
    return await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  deleteMessage: async (id) => {
    return await prisma.message.delete({
      where: { id },
    });
  },
};
