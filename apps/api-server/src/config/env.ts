import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  APP_URL: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(8),
  DATABASE_URL: z.string().min(1),
  SDK_PUBLIC_URL: z.string().default("http://localhost:4000/sdk/adstream-player.js"),
  DEMO_VIDEO_URL: z.string().default("https://samplelib.com/lib/preview/mp4/sample-5s.mp4"),
  DEMO_POSTER_URL: z.string().default("https://dummyimage.com/1280x720/0f172a/ffffff&text=AdStream+Demo+Sample")
});

export const env = envSchema.parse(process.env);
