import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

// This will automatically authenticate using the environment variable.
const openai = new OpenAI();

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

const chat = async (messages: string[], model: string & {} = 'gpt-4o-mini') => {
  let formattedMessages: ChatCompletionMessage[] = messages.map(
    (message: string) => ({
      role: 'user',
      content: message,
    }),
  );

  formattedMessages.unshift({
    role: 'system',
    content:
      'You are an bot powering a site that helps people find the next places. You provide top 3 answers by default, and give 2 additionals as helpers.',
  });

  const response = await openai.chat.completions.create({
    messages: formattedMessages,
    model,
    response_format: { type: 'json_object' },
  });

  return response.choices;
};

export default openai;
export { chat };

// if (require.main === module) {
//   chat(
//     [
//       "I'm at Toca Madera, looking for the next best place to go. I'm in a festive mood. What do you recommend?",
//       'Location: The Reserve, Mood: Come down from current, Radius: within 10 miles, Neihborhood: Downtown, Price: $ - Response: Json',
//     ],
//     'gpt-4o-mini',
//   )
//     .then((results) => console.log(results))
//     .catch((err) => console.error(err));
// }
