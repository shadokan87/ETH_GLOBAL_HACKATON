import express, { type Request, type Response, type NextFunction, type Express } from 'express';
import { bootStrap } from '../env';
import { addService, services } from './services';
import { TreeService } from './services/treeService';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';
import { config } from './config';
import { splitSourceCode } from './document/splitting';
import { useChunckDescription, useChunckDescriptionSchema } from './agents/useChunckDescription';
import { findKey } from 'lodash';
import type { z } from 'zod';
import { embedData } from './document/embedding';
const app: Express = express();

app.use(express.json());

const port = process.env.PORT || 8080;


let loopCount = 0;
const loopLimit = 10;
app.post('/index_codebase', async (req: Request, res: Response) => {
  async function indexCodeBse() {
    services.tree?.setCwd(config.projectRoot);
    const list = await services.tree?.list();
    console.log("!list", list);

    const root = list;
    const stack = [root?.children];
    while (stack.length) {
      if (loopCount >= loopLimit)
        break;
      const current = stack[0];
      if (!current || !current.length) {
        stack.shift();
        continue;
      }

      for (let i = 0; i < current.length; i++) {
        const currentElem = current[i];
        if (!currentElem)
          continue;
        if (currentElem.type == 'directory') {
          stack.push(currentElem.children);
          continue;
        }
        if (currentElem.name.charAt(0) != '.') {
          const chuncks = await splitSourceCode(currentElem.path);
          const chuncksDescriptions = chuncks ? await Promise.all(chuncks.map(async (chunck) => await useChunckDescription(chunck.pageContent))) : [];
          // To get arguments
          const _arguments = chuncksDescriptions.map(response => {
            const tool_calls = response?.choices[0].message.tool_calls;
            if (tool_calls) {
              return tool_calls[0].function.arguments;
            }
            return undefined;
          });

          const argumentsParsed: (string | undefined)[] = _arguments.map(arg => {
            if (!arg)
              return undefined;
            try {
              const parsed: z.infer<typeof useChunckDescriptionSchema> = JSON.parse(arg);
              return parsed.description;
            } catch (e) {
              return undefined;
            }
          }).filter(arg => arg !== undefined && arg !== null);
          const embeddedDescriptions = await Promise.all((argumentsParsed as string[]).map(async description => {
            return await embedData(description);
          }));
          // argumentsParsed.forEach(async description => {
          //   await services.supabase?.from('documents')
          // });
          console.log("LOL", JSON.stringify(embeddedDescriptions, null, 2));

        }
        console.log("Reading: ", currentElem.path);
      }
      stack.shift();
    }
  }
  await indexCodeBse();

  res.status(200).json({
    message: config.projectRoot,
  });
});

app.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        message: 'Hurray!! we create our first server on bun js',
        success: true,
      });
    } catch (error: unknown) {
      next(new Error((error as Error).message));
    }
  },
);

app.listen(port, async () => {
  await bootStrap();
  addService('tree', TreeService);
  addService('openai', OpenAI, {
    apiKey: process.env.OPENAI_API_KEY
  })
  services['supabase'] = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
  console.log(`Server is up and running on port ${port}`);
});