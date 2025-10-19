import Guestbook from "@/components/clients/Guestbook";
import { getMessages } from "@/lib/query";
import Image from "next/image";

export default async function Home() {
  const initialMessages = await getMessages();
  return (
    <div className="font-sans">
      <Guestbook initialMessages={initialMessages} />
    </div>
  );
}
