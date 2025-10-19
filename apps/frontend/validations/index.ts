import { z } from "zod";

export const MessageSchema = z.object({
  username: z.string().min(2, "Name at least 2 chars long"),
  content: z.string().min(5, "Message at least 5 chars long"),
});
