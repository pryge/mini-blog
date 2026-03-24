import { Router } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { protectedRoute } from '../middleware/auth';

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET || "super_duper_secret_key_123";

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.status(201).json({ message: 'Registration successful!', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Error during registration' });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
      return res.status(401).json({error: "Invalid email or password"})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({error: "Invalid email or password"})
    }
    const token = jwt.sign({userId: user.id}, SECRET_KEY, {expiresIn: "1h"})
    res.status(200).json({message: "Login successful!", token})
  } catch (error) {
    res.status(500).json({error: "An occured problem with login"})
  }
})


router.get("/me", protectedRoute, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({where: {id: Number(userId)}, select: {id: true, email: true, name: true}});

    if (!user) {
      return res.status(404).json({error: "User not found"})
    }

    res.status(200).json({ message: "Profile found", userId });
  } catch (error) {
    res.status(500).json({ error: "Error with fetching profile" });
  }
});

export default router;
