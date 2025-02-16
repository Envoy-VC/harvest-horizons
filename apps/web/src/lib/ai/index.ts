import { createMistral } from '@ai-sdk/mistral';
import { ollama } from 'ollama-ai-provider';

const mistral = createMistral({
  apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
});

import { generateObject } from 'ai';
import {
  GENERATE_ACTIONS_SYSTEM_PROMPT,
  getPlayerDetailsMessage,
} from './data';

import { z } from 'zod';
import { npcActionSchema } from '~/types/game';

export const getModel = () => {
  // Get the Model, Ollama is used for dev, Mistral for production
  const isDev = import.meta.env.DEV;
  if (isDev) {
    return ollama('llama3.1', { structuredOutputs: true });
  }
  return mistral('mistral-large-latest');
};

export const generateActions = async (
  prompt: string,
  playerAddress: string
) => {
  const model = getModel();
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
  return data.object;
};
