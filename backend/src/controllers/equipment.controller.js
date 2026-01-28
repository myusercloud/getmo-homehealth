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

      // Generate unique slug
      const baseSlug = slugify(name, { lower: true, strict: true });
      let finalSlug = baseSlug;
      let counter = 1;

      while (await prisma.equipment.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${baseSlug}-${counter++}`;
      }

      // Create equipment
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

      // Upload images
      if (files.length > 0) {
        const uploadedImages = [];

        for (let i = 0; i < files.length; i++) {
          const uploaded = await uploadToSupabase(files[i]);

          if (uploaded?.url) {
            uploadedImages.push({
              equipmentId: equipment.id,
              url: uploaded.url,
              isPrimary: i === 0,
              sortOrder: i,
            });
          }
        }

        await prisma.equipmentImage.createMany({ data: uploadedImages });
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
  // UPDATE MAIN DATA
  // ----------------------
  async update(req, res) {
    try {
      const data = req.body;

      // Update slug when name changes
      if (data.name) {
        data.slug = slugify(data.name, { lower: true, strict: true });
      }

      const updated = await prisma.equipment.update({
        where: { id: req.params.id },
        data,
        include: { images: true },
      });

      res.json(updated);

    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ----------------------
  // UPLOAD IMAGES FOR EXISTING EQUIPMENT
  // ----------------------
  async uploadImages(req, res) {
    try {
      const equipmentId = req.params.id;
      const files = req.files || [];

      if (files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const uploaded = await uploadToSupabase(files[i]);

        if (uploaded?.url) {
          uploadedImages.push({
            equipmentId,
            url: uploaded.url,
            isPrimary: false,
            sortOrder: i,
          });
        }
      }

      const saved = await prisma.equipmentImage.createMany({
        data: uploadedImages,
      });

      res.json({
        message: "Images uploaded successfully",
        count: saved.count,
      });

    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload images" });
    }
  },

  // ----------------------
  // DELETE A SINGLE IMAGE
  // ----------------------
  async deleteImage(req, res) {
    try {
      const imageId = req.params.imageId;

      const deleted = await prisma.equipmentImage.delete({
        where: { id: imageId },
      });

      res.json({ message: "Image deleted", deleted });

    } catch (err) {
      console.error("Delete image error:", err);
      res.status(500).json({ error: "Failed to delete image" });
    }
  },

  // ----------------------
  // REPLACE AN IMAGE (UPLOAD NEW, DELETE OLD)
  // ----------------------
  async replaceImage(req, res) {
    try {
      const imageId = req.params.imageId;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No replacement image uploaded" });
      }

      // Upload to supabase
      const uploaded = await uploadToSupabase(file);

      if (!uploaded?.url) {
        return res.status(500).json({ error: "Failed to upload new image" });
      }

      // Update DB image record
      const updated = await prisma.equipmentImage.update({
        where: { id: imageId },
        data: {
          url: uploaded.url,
        },
      });

      res.json({
        message: "Image replaced successfully",
        updated,
      });

    } catch (err) {
      console.error("Replace image error:", err);
      res.status(500).json({ error: "Failed to replace image" });
    }
  },

  // ----------------------
  // DELETE EQUIPMENT
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
