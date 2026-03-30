import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../utils/auth.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.auth = verifyAuthToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
