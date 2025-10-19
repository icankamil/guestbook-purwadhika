"use client";

import React, { useOptimistic, useRef, Suspense, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Message } from "@/types/message";
import { Textarea } from "../ui/textarea";
import { handleFormSubmit } from "@/lib/mutation";
import { MessageSchema } from "@/validations";
import Image from "next/image";
import MessageList from "./MessageList";

export default function Guestbook({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    initialMessages,
    (currentState, newOptimisticMessage: Message) => [
      newOptimisticMessage,
      ...currentState,
    ]
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-screen lg:max-h-[600px]">
        <Card className="w-full md:h-[25rem] md:w-2/5">
          <CardHeader>
            <CardTitle>Guestbook</CardTitle>
            <CardDescription>
              Kindly fill the guestbook before attending the show
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              ref={formRef}
              action={(data) => {
                startTransition(async () => {
                  const validation = MessageSchema.safeParse({
                    username: data.get("username"),
                    content: data.get("content"),
                  });

                  if (!validation.success) {
                    JSON.parse(validation.error.message).map(
                      (item: Record<string, any>) => {
                        toast.error(item.message);
                      }
                    );
                    return;
                  }

                  addOptimisticMessage({
                    id: Math.random(),
                    username: data.get("username") as string,
                    content: data.get("content") as string,
                    createdAt: new Date().toISOString(),
                  });

                  try {
                    const res = await handleFormSubmit(data);
                    if (Object.keys(res).includes("errors")) {
                      const { errors } = await res;
                      JSON.parse(errors.message).map(
                        (eachMsg: Record<string, any>) => {
                          toast.error(eachMsg.message || "Server Error");
                        }
                      );
                      router.refresh();
                    } else {
                      console.log(res)
                      toast.success(res.message);
                      formRef.current?.reset();
                      router.refresh();
                    }
                  } catch (err: any) {
                    toast.error(err.message);
                    router.refresh();
                  }
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="username">Your Name</Label>
                <Input id="username" name="username" type="text" required />
              </div>
              <div>
                <Label htmlFor="content">Your Message</Label>
                <Textarea
                  id="content"
                  name="content"
                  className="max-h-40 h-[10rem]"
                  required
                />
              </div>
              <Suspense>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Submitting" : "Submit"}
                </Button>
              </Suspense>
            </form>
          </CardContent>
        </Card>
        <MessageList messages={optimisticMessages} />
      </div>
    </main>
  );
}
