import { createOllama } from 'ollama-ai-provider';

import { generateObject } from 'ai';
import { z } from 'zod';
import { npcActionSchema } from '~/types/game';
import {
  GENERATE_ACTIONS_SYSTEM_PROMPT,
  getPlayerDetailsMessage,
} from './data';

import { createDeepSeek } from '@ai-sdk/deepseek';

const ollama = createOllama();
const deepseek = createDeepSeek({
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
});

const devModel = ollama('llama3');
const prodModel = deepseek('deepseek-chat');

const model = import.meta.env.DEV ? devModel : prodModel;

export const generateActions = async (
  prompt: string,
  playerAddress: string
) => {
  try {
    const message = await getPlayerDetailsMessage(playerAddress);
    const data = await generateObject({
      model: model,
      messages: [
        {
          role: 'system',
          content: GENERATE_ACTIONS_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `${message} \n\n ${prompt}`,
        },
      ],
      schema: z.object({
        message: z.string().describe('A response given for the message'),
        actions: z.array(npcActionSchema),
      }),
    });
    console.log(data.object);
  } catch (error) {
    console.error(error);
  }
};
