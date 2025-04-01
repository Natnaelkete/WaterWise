export const getAIResult = async (base64: string) => {
  const res = await fetch("/api/analyze-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });

  const data = await res.json();

  return data;
};
