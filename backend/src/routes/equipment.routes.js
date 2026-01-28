import express from "express";
import { EquipmentController } from "../controllers/equipment.controller.js";
import { upload } from "../config/multer.js";
import { validateEquipment, validateEquipmentUpdate } from "../dto/equipment.dto.js";
import { auth } from "../middleware/auth.js";


export const router = express.Router();



router.get("/", EquipmentController.getAll);
router.get("/:id", EquipmentController.getOne);

// Admin-only routes:
router.post(
  "/",
  auth,
  upload.array("images", 10),
  validateEquipment,
  EquipmentController.create
);



router.put("/:id", auth, validateEquipmentUpdate, EquipmentController.update);

router.delete("/:id", auth, EquipmentController.delete);

// Upload new images
router.post(
  "/:id/images",
  auth,
  upload.array("images", 10),
  EquipmentController.uploadImages
);

// Delete a single image
router.delete(
  "/image/:imageId",
  auth,
  EquipmentController.deleteImage
);

// Replace an existing image
router.put(
  "/image/:imageId",
  auth,
  upload.single("image"),
  EquipmentController.replaceImage
);

