import { PrismaClient } from "@prisma/client";
import { slugify } from "../utils/slugify.js";

const prisma = new PrismaClient();


export const EquipmentService = {
  async create(data, imageFiles) {
    const equipment = await prisma.equipment.create({
      data: {
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        description: data.description || "",
        price: data.price,
        stock: data.stock,
        type: data.type,
      },
    });

    if (imageFiles.length > 0) {
      await prisma.equipmentImage.createMany({
        data: imageFiles.map((file, index) => ({
          equipmentId: equipment.id,
          url: file.path, 
          isPrimary: index === 0,
          sortOrder: index,
        })),
      });
    }

    return equipment;
  },

  async update(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true });
    }

    return prisma.equipment.update({
      where: { id },
      data,
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
