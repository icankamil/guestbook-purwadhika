"use server";

export const handleFormSubmit = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const content = formData.get("content") as string;

  const res = await fetch(`${process.env.INTERNAL_API_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, content }),
  });

  return await res.json();
};
