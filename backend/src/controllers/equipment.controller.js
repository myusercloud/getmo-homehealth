import cloudinary from "../config/cloudinary.js";
import { EquipmentService } from "../services/equipment.service.js";

export const EquipmentController = {
  async create(req, res) {
    try {
      const imageUrls = req.files.map((file) => file.path);

      const equipment = await EquipmentService.create(
        req.validatedData,
        imageUrls
      );

      res.json(equipment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create equipment" });
    }
  },

  async getAll(req, res) {
    const items = await EquipmentService.findAll();
    res.json(items);
  },

  async getOne(req, res) {
    const item = await EquipmentService.findOne(req.params.id);
    res.json(item);
  },

  async update(req, res) {
    const updated = await EquipmentService.update(req.params.id, req.body);
    res.json(updated);
  },

  async delete(req, res) {
    await EquipmentService.delete(req.params.id);
    res.json({ message: "Deleted successfully" });
  }
};
