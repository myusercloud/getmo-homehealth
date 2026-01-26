import { z } from "zod";

const baseEquipmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  type: z.enum(["SALE", "LEASE", "BOTH"]).optional(),
});

export const equipmentSchema = baseEquipmentSchema.extend({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  type: z.enum(["SALE", "LEASE", "BOTH"]),
});

export const validateEquipment = (req, res, next) => {
  try {
    req.body = equipmentSchema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: "Validation error", details: err.errors });
  }
};

export const validateEquipmentUpdate = (req, res, next) => {
  try {
    req.body = baseEquipmentSchema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: "Validation error", details: err.errors });
  }
};
