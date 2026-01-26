import prisma from "../../prisma/client.js";
import slugify from "slugify";
import { uploadToSupabase } from "../utils/uploadSupabase.js";

export const EquipmentController = {

  // ----------------------
  // CREATE
  // ----------------------
  async create(req, res) {
    try {
      const { name, description, price, stock, type } = req.body;
      const files = req.files || [];

      // 1️⃣ Generate unique slug
      const baseSlug = slugify(name, { lower: true, strict: true });
      let finalSlug = baseSlug;
      let counter = 1;

      while (await prisma.equipment.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${baseSlug}-${counter++}`;
      }

      // 2️⃣ Create equipment entry
      const equipment = await prisma.equipment.create({
        data: {
          name,
          slug: finalSlug,
          description: description || "",
          price: Number(price),
          stock: Number(stock),
          type,
        },
      });

      // 3️⃣ Upload files to Supabase & save URLs
      if (files.length > 0) {
        const uploadedImages = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Upload from memory buffer to supabase
          const uploaded = await uploadToSupabase(file);

          if (uploaded?.url) {
            uploadedImages.push({
              equipmentId: equipment.id,
              url: uploaded.url,
              isPrimary: i === 0,
              sortOrder: i,
            });
          }
        }

        if (uploadedImages.length > 0) {
          await prisma.equipmentImage.createMany({ data: uploadedImages });
        }
      }

      res.json({
        message: "Equipment created successfully",
        equipment,
      });

    } catch (err) {
      console.error("Create error:", err);
      res.status(500).json({ error: "Failed to create equipment" });
    }
  },

  // ----------------------
  // GET ALL
  // ----------------------
  async getAll(req, res) {
    try {
      const items = await prisma.equipment.findMany({
        include: { images: true },
        orderBy: { created_at: "desc" },
      });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ----------------------
  // GET ONE
  // ----------------------
  async getOne(req, res) {
    try {
      const item = await prisma.equipment.findUnique({
        where: { id: req.params.id },
        include: { images: true },
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ----------------------
  // UPDATE
  // ----------------------
  async update(req, res) {
    try {
      const data = req.body;

      if (data.name) {
        data.slug = slugify(data.name, { lower: true, strict: true });
      }

      const item = await prisma.equipment.update({
        where: { id: req.params.id },
        data,
        include: { images: true },
      });

      res.json(item);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ----------------------
  // DELETE
  // ----------------------
  async delete(req, res) {
    try {
      await prisma.equipmentImage.deleteMany({
        where: { equipmentId: req.params.id },
      });

      await prisma.equipment.delete({
        where: { id: req.params.id },
      });

      res.json({ message: "Equipment deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
