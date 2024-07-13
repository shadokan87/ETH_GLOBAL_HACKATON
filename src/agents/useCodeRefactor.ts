import type OpenAI from "openai";
import { z } from "zod";
import { rulesDef, attachment } from "../prompting";
import { $ } from "bun";
import { config } from "../config";
import zodToJsonSchema from "zod-to-json-schema";
import { services } from "../services";

const snippetSchema = z.object({
  actionDescription: z.string().describe("concise description of what this action does example: move element X and export it"),
  actionType: z.enum(['create', 'update']).describe("type of action: 'create' for creating new code, 'update' for modifying existing code"),
  language: z.string().describe('the language of the source code'),
  path: z.string().describe("the file path"),
  sourceCode: z.string().optional().describe("the source code, to be ignored if running in DRY mode")
});

interface document {
  path: string,
  content: string
}

export async function useCodeRefactor(prompt: string, attachmentsPaths: string[]) {
  const documents = await Promise.all(attachmentsPaths.map(async path => {
    return {
      path,
      content: await $`cat ${path}`.text()
    }
  }));

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system', content: `${rulesDef}
  #define no-partial-code "Always output the complete code without any omissions." #end
  #define no-broken-dependencies "If you move files around, make sure the dependencies stays intact or create them if required" #end
      `
    },
    {
      role: "user", content: `
    attachments:
      ${documents.map(doc => attachment(doc.path.substring(config.projectRoot.length), doc.content)).join('\n')}
    prompt:
      ${prompt}
    ` }
  ];

  const tools: OpenAI.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "codeSnippets",
        description: "the function to call with the result",
        parameters: zodToJsonSchema(snippetSchema)
      }
    }
  ];

  const response = await services.openai?.chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    tools: tools,
    tool_choice: "required",
  });
  return response;
}