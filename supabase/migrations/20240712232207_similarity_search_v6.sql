create or replace function similarity_searchV6 (
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
    (documents.description_embedding <#> query_embedding) * -1 as similarity
  from documents
  where (documents.description_embedding <#> query_embedding) * -1 > match_threshold
  order by documents.description_embedding <#> query_embedding
  limit match_count;
$$;