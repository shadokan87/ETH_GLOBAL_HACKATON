import { services } from "../services";
import type { Database } from "../types/supabase";
import { embedData } from "./embedding";

export async function similaritySearch(query: string) {
  console.log("HIT_HERE");
  const queryEmbedding = await embedData(query);
  if (!queryEmbedding)
    return undefined;
  const embeddedQuery = queryEmbedding.embedding.data[0].embedding;
  const response = await services.supabase?.rpc('similarity_searchv6', {
    query_embedding: JSON.stringify(embeddedQuery),
    match_threshold: 0.3,
    match_count: 30
  });
  console.log(JSON.stringify(response, null, 2));
  return response;
}

export async function sortDocumentsResult(result: Database['public']['Functions']['similarity_searchv6']['Returns']) {
  const removePathDuplicate = result.reduce((acc, item) => {
    const pathSet = new Set(acc.map(i => i.path));
    if (!pathSet.has(item.path)) {
      acc.push(item);
    }
    return acc;
  }, [] as typeof result);
  const reference = result[0];
  return removePathDuplicate.filter(e => {
    return !(e.similarity < (reference.similarity - 0.1))
  }).map(e => e.path);
}