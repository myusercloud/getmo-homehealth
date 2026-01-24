import prisma from "../../prisma/client.js";

export const EquipmentService = {
  async create(data, images) {
    return prisma.equipment.create({
      data: {
        ...data,
        images: {
          create: images.map((url, index) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
      },
      include: { images: true }
    });
  },

  async findAll() {
    return prisma.equipment.findMany({ include: { images: true } });
  },

  async findOne(id) {
    return prisma.equipment.findUnique({
      where: { id },
      include: { images: true },
    });
  },

  async update(id, data) {
    return prisma.equipment.update({
      where: { id },
      data,
      include: { images: true },
    });
  },

  async delete(id) {
    return prisma.equipment.delete({ where: { id } });
  }
};
