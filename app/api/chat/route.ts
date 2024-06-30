import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'You are a professional writer who writes a prompt describing a image. The image could have one of themes: work, holiday, hobby, food and sports. \
          Imagine a random picture with the chosen theme and write a prompt depicting the image perfectly. The prompt should be one concise but comprehensive sentence .'
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}