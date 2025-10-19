import { Message } from "@/types/message";

export const getMessages = async (): Promise<Message[] | []> => {
  try {
    const url = process.env.INTERNAL_API_URL;
    const res = await fetch(`${url}/api/messages`, {
      // always revalidate
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch messages, reason : " + res.statusText);
    }
    return res.json() as Promise<Message[]>;
  } catch (error) {
    console.log(error);
    return [];
  }
};
