import { PrismaClient } from "@prisma/client";
import { slugify } from "../utils/slugify.js";

const prisma = new PrismaClient();


export const EquipmentService = {
  async create(data, imageUrls) {
    // Auto-generate slug from name
    const slug = slugify(data.name);

    return prisma.equipment.create({
      data: {
        ...data,
        slug,
        specifications: data.specifications || {},

        images: {
          create: imageUrls.map((url, index) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
      },
      include: { images: true },
    });
  },

  async findAll() {
    return prisma.equipment.findMany({
      include: { images: true },
      orderBy: { created_at: "desc" },
    });
  },

  async findOne(id) {
    return prisma.equipment.findUnique({
      where: { id },
      include: { images: true },
    });
  },

  async update(id, data) {
    // Slug should update if the name changes
    if (data.name) {
      data.slug = slugify(data.name);
    }

    return prisma.equipment.update({
      where: { id },
      data,
      include: { images: true },
    });
  },

  async delete(id) {
    // Must delete images first because of FK constraints
    await prisma.equipmentImage.deleteMany({
      where: { equipmentId: id },
    });

    // Now delete the equipment
    return prisma.equipment.delete({
      where: { id },
    });
  },
};
