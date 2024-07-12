import type OpenAI from 'openai';
import z from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { services } from '../services';

export const useChunckDescriptionSchema = z.object({
  description: z.string().describe("your output for the chuck description")
})

export async function useChunckDescription(chunckContent: string) {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system', content: `The user will provide code snippets, Your task is to provide a concise but detailed description of the following code snippet. Include its purpose, functionality, and any important details that would help someone understand what this code does (your output will be then used for embedding):`
    },
    {
      role: "user", content: `
      ${chunckContent}
    ` }
  ];

  const tools: OpenAI.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "codeSnippets",
        description: "the function to call with the result",
        parameters: zodToJsonSchema(useChunckDescriptionSchema)
      }
    }
  ];

  const response = await services.openai?.chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    tools: tools,
    tool_choice: "required",
  });
  console.log(JSON.stringify(response, null, 2));
  return response;
}