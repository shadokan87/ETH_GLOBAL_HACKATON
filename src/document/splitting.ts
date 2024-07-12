import { $ } from "bun";
import {
  SupportedTextSplitterLanguages,
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";

const extensionsAsString = SupportedTextSplitterLanguages.map(elem => String(elem));
export async function splitSourceCode(path: string) {
  console.log("!splitting: ", path);
  const extension = path.split('.').pop();
  if (!extension || !extensionsAsString.includes(extension))
    return undefined;
  const sourceCode = await $`cat ${path}`.text();
  if (!sourceCode)
    return undefined;
  const splitter = RecursiveCharacterTextSplitter.fromLanguage(extension as typeof SupportedTextSplitterLanguages[0], {
    chunkSize: 200,
    chunkOverlap: 50,
  });
  const output = await splitter.createDocuments([sourceCode]);
  console.log(JSON.stringify(output, null, 2));
  return output
}