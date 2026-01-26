import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const AuthController = {
  // REGISTER ADMIN
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return res.status(400).json({ error: "Email already exists" });

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          role: role || "admin",
        },
      });

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed" });
    }
  },

  // LOGIN
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user)
        return res.status(400).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login success",
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  },
};
