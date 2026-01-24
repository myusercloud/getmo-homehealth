import express from "express";
import { EquipmentController } from "../controllers/equipment.controller.js";
import { validateEquipment } from "../dto/equipment.dto.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", EquipmentController.getAll);
router.get("/:id", EquipmentController.getOne);

router.post(
  "/",
  upload.array("images", 10),
  validateEquipment,
  EquipmentController.create
);

router.put("/:id", validateEquipment, EquipmentController.update);

router.delete("/:id", EquipmentController.delete);

export default router;
