import { services } from "../services";
import { embedData } from "./embedding";

export async function similaritySearch(query: string) {
  const queryEmbedding = await embedData(query);
  if (!queryEmbedding)
    return undefined;
  const embeddedQuery = queryEmbedding.embedding.data[0].embedding;
  const response = await services.supabase?.rpc('similarity_searchv4', {
    query_embedding: JSON.stringify(embeddedQuery),
    match_threshold: 0.0,
    match_count: 10
  });
  console.log(JSON.stringify(response, null, 2));
  return response;
}