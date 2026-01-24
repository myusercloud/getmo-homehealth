import express from "express";
import { EquipmentController } from "../controllers/equipment.controller.js";
import { upload } from "../config/multer.js";
import { validateEquipment, validateEquipmentUpdate } from "../dto/equipment.dto.js";

export const router = express.Router();

router.get("/", EquipmentController.getAll);
router.get("/:id", EquipmentController.getOne);

router.post(
  "/",
  upload.array("images", 10),
  validateEquipment,
  EquipmentController.create
);


router.put("/:id", validateEquipmentUpdate, EquipmentController.update);

router.delete("/:id", EquipmentController.delete);
