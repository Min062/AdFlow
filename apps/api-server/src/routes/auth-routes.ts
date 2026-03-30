import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { comparePassword, hashPassword, signAuthToken } from "../utils/auth.js";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const input = signupSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    return res.status(409).json({ message: "Email is already in use" });
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: await hashPassword(input.password)
    }
  });

  const token = signAuthToken({ userId: user.id, email: user.email });
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

authRouter.post("/login", async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await comparePassword(input.password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signAuthToken({ userId: user.id, email: user.email });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    select: {
      id: true,
      email: true,
      createdAt: true
    }
  });

  return res.json({ user });
});
