import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
  ChatModel,
} from 'openai/resources';
import openai from '../api/openai';
import fs from 'fs';

import {
  SYSTEM_MESSAGES_V1,
  SYSTEM_MESSAGES_V2,
} from '../constants/recommendationPrompts';

interface RecommendationsSettings {
  setupSystemMessages?: string[];
  setupAssistantMessages?: string[];
  model?: ChatModel;
}

enum Intent {
  explore = 'Explore',
  eat = 'Eat',
  drink = 'Drink',
  party = 'Party',
  music = 'Music',
  socialize = 'Socialize',
}

enum Destination {
  restaurant = 'Restaurant',
  bar = 'Bar',
  club = 'Club',
}

enum PriceLevel {
  cheap = '$',
  moderate = '$$',
  expensive = '$$$',
  veryExpensive = '$$$$',
}

enum Vibe {
  lit = 'Lit',
  adventurous = 'Adventurous',
  playful = 'Playful',
  chill = 'Chill',
  social = 'Social',
  romantic = 'Romantic',
  festive = 'Festive',
}

interface RecommendationsInput {
  // Location of the user at time of recommendation.
  currentLocation: {
    coordinates?: [number, number];
    address?: string;
    name?: string;
  };
  // What the user intends to do primarily. They may supplement with
  // other lower priority intents.
  intent?: Intent;
  additionalIntents?: Intent[];
  vibe?: Vibe[];
  time?: Date;
  excludedDestinationTypes?: Destination[];
  distanceContext?: {
    searchRadiusMiles?: number;
    maxTravelTimeMinutes?: number;
  };
  costContext?: {
    priceLevels?: PriceLevel[];
    maxTicketPrice?: number;
  };
  userContext?: {
    id?: string;
    birthDate?: number;
    culture?: string;
    interests?: string[];
  };
}

const recommend = async (
  request: RecommendationsInput,
  options?: RecommendationsSettings,
) => {
  let {
    currentLocation,
    intent,
    additionalIntents,
    vibe,
    time = new Date(),
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

if (require.main === module) {
  (async () => {
    let start = new Date();
    console.log('Running the recommendation engine...');
    let recommendations = await recommend(
      {
        currentLocation: {
          address: '22758 Westheimer Pkwy #270, Katy, TX 77450',
          name: 'The Public House',
        },
        intent: Intent.party,
        additionalIntents: [Intent.socialize, Intent.eat],
        vibe: [Vibe.lit, Vibe.social],
        distanceContext: {
          maxTravelTimeMinutes: 25,
        },
        costContext: {
          priceLevels: [PriceLevel.moderate, PriceLevel.expensive],
        },
      },
      {
        model: 'gpt-4o-mini',
      },
    );
    let end = new Date();

    console.log(
      `Recommendation engine ran in ${(end.getTime() - start.getTime()) / 1000} seconds`,
    );

    console.log(recommendations);
    fs.writeFileSync(
      'examples/recommendations-party-socialize-eat-mini.json',
      JSON.stringify(recommendations, null, 2),
    );
  })();
}