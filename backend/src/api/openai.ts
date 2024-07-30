import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { ChatCompletionMessageParam } from 'openai/resources';
dotenv.config();

// This will automatically authenticate using the environment variable.
const openai = new OpenAI();

/**
 * Example open AI chat function. This will take in any messages and respond with the most default chat GPT support,
 * using the model provided. We need to make more functions that are more specific to our usecase, or work well.
 *
 * @param messages
 * @param model
 * @returns
 */
const exampleChat = async (
  messages: string[],
  model: string & {} = 'gpt-4o-mini',
) => {
  let formattedMessages: ChatCompletionMessageParam[] = messages.map(
    (message: string) => ({
      role: 'user',
      content: message,
    }),
  );

  formattedMessages.unshift({
    role: 'system',
    content: `You are a helpful assistant.`,
  });

  const response = await openai.chat.completions.create({
    messages: formattedMessages,
    model,
  });

  return response.choices;
};

export default openai;
export { exampleChat as chat };
