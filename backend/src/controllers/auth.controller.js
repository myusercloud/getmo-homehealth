import prisma from "../../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//confirm
export const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return res.status(400).json({ error: "Email already exists" });

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email, password: hashed }
      });

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ message: "Login success", token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  },
  async getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" }
    });

    res.json(users);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
}
  



};
