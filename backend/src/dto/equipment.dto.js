import { z } from "zod";

// Accepts EITHER string (JSON) OR object directly
const specsSchema = z.union([
  z.string().transform((val) => {
    try {
      return JSON.parse(val);
    } catch {
      throw new Error("Invalid JSON in specifications");
    }
  }),
  z.record(z.any()), // object allowed
  z.undefined(),
]);

// Base schema (used by both create + update)
const baseEquipmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  type: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  specifications: specsSchema.optional(),
});

// CREATE (all required)
export const equipmentSchema = baseEquipmentSchema.extend({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  type: z.string(),
});

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
