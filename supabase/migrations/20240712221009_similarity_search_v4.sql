create or replace function similarity_searchV4 (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  path text,
  description text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.path,
    documents.description,
    1 - (documents.description_embedding <=> query_embedding) as similarity
  from documents
  where documents.description_embedding <=> query_embedding < 1 - match_threshold
  order by documents.description_embedding <=> query_embedding
  limit match_count;
$$;