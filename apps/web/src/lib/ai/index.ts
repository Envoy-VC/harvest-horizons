import { createOllama } from 'ollama-ai-provider';

import { generateText } from 'ai';
import {
  GENERATE_ACTIONS_SYSTEM_PROMPT,
  getPlayerDetailsMessage,
} from './data';

import { createDeepSeek } from '@ai-sdk/deepseek';
// import { z } from 'zod';
// import { npcActionSchema } from '~/types/game';

const ollama = createOllama();
const deepseek = createDeepSeek({
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
});

const devModel = ollama('deepseek-r1:8b');
const prodModel = deepseek('deepseek-chat');

const model = import.meta.env.DEV ? devModel : prodModel;

export const generateActions = async (
  prompt: string,
  playerAddress: string
) => {
  try {
    const message = await getPlayerDetailsMessage(playerAddress);
    const data = await generateText({
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
      // schema: z.object({
      //   response: z.string().describe('A response given for the message'),
      //   actions: z.array(npcActionSchema),
      // }),
    });
    console.log(data.text);
  } catch (error) {
    console.error(error);
  }
};
