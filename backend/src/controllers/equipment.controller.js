import { EquipmentService } from "../services/equipment.service.js";
import { uploadToSupabase } from "../utils/uploadSupabase.js";
import slugify from "slugify";

export const EquipmentController = {
  async create(req, res) {
    try {
      const data = req.body;

      // Auto-generate slug
      data.slug = slugify(data.name, { lower: true, strict: true });

      // Upload images to Supabase
      const imageUploads = await Promise.all(
        req.files.map((file) => uploadToSupabase(file))
      );

      const equipment = await EquipmentService.create(data, imageUploads);

      return res.status(201).json(equipment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create equipment" });
    }
  },

  async getAll(req, res) {
    try {
      const items = await EquipmentService.findAll();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const item = await EquipmentService.findOne(req.params.id);
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = req.body;

      // Regenerate slug only if name is changed
      if (data.name) {
        data.slug = slugify(data.name, { lower: true, strict: true });
      }

      const item = await EquipmentService.update(req.params.id, data);
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await EquipmentService.delete(req.params.id);
      res.json({ message: "Equipment deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
