import { ollama } from 'ollama-ai-provider';

import { generateObject } from 'ai';
import {
  GENERATE_ACTIONS_SYSTEM_PROMPT,
  getPlayerDetailsMessage,
} from './data';

import { z } from 'zod';
import { npcActionSchema } from '~/types/game';

export const model = ollama('llama3', { structuredOutputs: true });

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
        response: z.string().describe('A response given for the message'),
        actions: z.array(npcActionSchema),
      }),
    });
    console.log(data.object);
    return data.object;
  } catch (error) {
    console.error(error);
  }
};
