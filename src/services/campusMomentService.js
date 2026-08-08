import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const campusMomentService = {
  getAll: async () => {
    return await prisma.campusMoment.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  },

  getById: async (id) => {
    return await prisma.campusMoment.findUnique({
      where: { id },
    });
  },

  create: async (data) => {
    return await prisma.campusMoment.create({
      data: {
        title: data.title,
        category: data.category || 'Campus Life',
        description: data.description || '',
        imageUrls: data.imageUrls || [],
        order: data.order !== undefined ? parseInt(data.order) : 0,
      },
    });
  },

  update: async (id, data) => {
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrls !== undefined) updateData.imageUrls = data.imageUrls;
    if (data.order !== undefined) updateData.order = parseInt(data.order);

    return await prisma.campusMoment.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id) => {
    return await prisma.campusMoment.delete({
      where: { id },
    });
  },
};
