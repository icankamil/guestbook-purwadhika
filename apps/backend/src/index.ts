import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import { z } from "zod";
import { PrismaClient } from "./generated/prisma";

export const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const MessageSchema = z.object({
  username: z.string().min(2, "Fullname must be at least 2 characters long"),
  content: z.string().min(20, "Message must be at least 20 characters long"),
});

app.get("/api/messages", async (req: Request, res: Response) => {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(messages);
});

app.post("/api/messages", async (req: Request, res: Response) => {
  const payload = MessageSchema.safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ errors: payload.error });
  }

  const result = await prisma.message.create({
    data: {
      username: payload.data.username,
      content: payload.data.content,
    },
  });

  res.status(201).json({ result, message: "Successfully store data" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

app.listen(port, () => {
  console.log("Server running on port : " + port);
});
