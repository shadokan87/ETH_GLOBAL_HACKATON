import { services } from "../services";

/**
 * Embeds the given input string using OpenAI's embedding model.
 *
 * @param {string} input - The input string to be embedded.
 * @returns {Promise<{input: string, embedding: object} | undefined>} The input string and its corresponding embedding, or undefined if an error occurs.
 */
export async function embedData(input: string) {
  if (!services.openai) {
    console.error("Open ai error");
    return;
  }

  const embedding = await services.openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
    encoding_format: "float",
  });
  return { input, embedding };
}