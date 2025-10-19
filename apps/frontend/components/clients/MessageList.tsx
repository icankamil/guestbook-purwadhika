import { Message } from "@/types/message";
import { Card, CardContent } from "../ui/card";

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4 flex w-full md:w-3/5 flex-col h-96 md:h-full overflow-y-auto scrollbar-hide">
        <h2 className="text-2xl font-medium">Messages</h2>
      {messages.map((message) => (
        <Card key={message.id} className="bg-gray-50 dark:bg-gray-900">
          <CardContent className="p-4">
            <p className="font-semibold">{message.username}</p>
            <p className="text-gray-700 dark:text-gray-300">
              {message.content}
            </p>
            <p className="mt-2 text-right text-xs text-gray-400">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
