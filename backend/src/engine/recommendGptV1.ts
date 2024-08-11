import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
  ChatModel,
} from 'openai/resources';
import openai from '../api/openai';

import { SYSTEM_MESSAGES_V2 } from '../constants/recommendationPrompts';
import { Intent, RecommendationsInput, Vibe } from './types';

interface RecommendationsSettings {
  setupSystemMessages?: string[];
  setupAssistantMessages?: string[];
  model?: ChatModel;
}

export const recommendGptV1 = async (
  request: RecommendationsInput,
  options?: RecommendationsSettings,
) => {
  let time = new Date();
  let {
    currentLocation,
    intent,
    additionalIntents,
    vibe,
    excludedDestinationTypes,
    distanceContext,
    costContext,
    userContext,
  } = request;
  let {
    setupSystemMessages = SYSTEM_MESSAGES_V2,
    setupAssistantMessages,
    model = 'gpt-4o',
  } = options ?? {};

  // TODO: Convert coordinates to address if not provided.
  let address = currentLocation.address;
  let locationName = currentLocation.name ?? '';
  let timeString = `${time.toISOString()} UTC`;

  let userMessageContent = `
    Current Location: ${locationName}(${address})
    Time: ${timeString}
    Intent: ${intent ?? Intent.explore}. Additional Intents: ${additionalIntents?.length ? additionalIntents.join(', ') : 'None'}
    Vibe: ${vibe?.length ? vibe.join(', ') : Vibe.adventurous}
    Excluded Destination Types: ${excludedDestinationTypes?.length ? excludedDestinationTypes.join(', ') : 'None'}
    Distance Context: ${distanceContext?.searchRadiusMiles ?? 15} miles, ${distanceContext?.maxTravelTimeMinutes ?? 45} minutes
    Price Levels: ${costContext?.priceLevels?.length ? costContext.priceLevels.join(', ') : 'None'}
    Max Ticket Price: ${costContext?.maxTicketPrice ?? 'None'}
  `;

  // 2. Obtain recommendations from the search engine.
  let rawRecommendations = await openai.chat.completions.create({
    messages: [
      ...(setupSystemMessages
        ? setupSystemMessages.map(
            (content: string): ChatCompletionSystemMessageParam => ({
              role: 'system',
              content,
            }),
          )
        : []),
      ...(setupAssistantMessages
        ? setupAssistantMessages.map(
            (content: string): ChatCompletionAssistantMessageParam => ({
              role: 'assistant',
              content,
            }),
          )
        : []),
      { role: 'user', content: userMessageContent },
    ],
    model,
    response_format: { type: 'json_object' },
    max_tokens: 4000,
  });

  let {
    choices: [
      {
        message: { content: recommendationJson },
      },
    ],
    usage,
  } = rawRecommendations;

  console.log({ recommendationJson });
  console.log(rawRecommendations);
  let recommendations = recommendationJson
    ? JSON.parse(recommendationJson)?.destinations
    : [];

  // 3. Refine recommendations for display to the user.
  // TODO:
  // 4. Record this data for future training and improvement of the engine.
  // TODO: Store context for the users if they are provided.

  return recommendations;
};
