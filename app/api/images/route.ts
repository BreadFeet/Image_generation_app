import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { size, number, message } = await req.json();
  const prompt = `${message}`;

  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: prompt.substring(0, Math.min(prompt.length, 1000)),
    size: size,
//     quality: "standard",
    response_format: "b64_json",
    n: number,
  });

  const images = response.data.map((image) => image.b64_json);

  return new Response(JSON.stringify(images))
}