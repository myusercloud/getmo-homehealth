import { z } from "zod";

// Base schema (used by both create + update)
const baseEquipmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  type: z.string().optional(),
  specifications: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch (e) {
        throw new Error("Invalid JSON in specifications");
      }
    }),
});

// Full required schema for CREATE
export const equipmentSchema = baseEquipmentSchema.extend({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  type: z.string(),
});

// CREATE validator (requires all fields)
export const validateEquipment = (req, res, next) => {
  try {
    req.body = equipmentSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors ?? err.message,
    });
  }
};

// UPDATE validator (allows partial update)
export const validateEquipmentUpdate = (req, res, next) => {
  try {
    req.body = baseEquipmentSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors ?? err.message,
    });
  }
};
