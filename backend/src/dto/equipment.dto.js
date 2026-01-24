import { z } from "zod";

export const EquipmentDTO = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  type: z.enum(["SALE", "LEASE", "BOTH"]),
  specifications: z.any().optional(),
  categoryId: z.string().uuid().optional(),
});

export const validateEquipment = (req, res, next) => {
  try {
    const data = EquipmentDTO.parse(req.body);
    req.validatedData = data;
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }
};

