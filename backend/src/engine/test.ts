import fs from 'fs';
import { SYSTEM_MESSAGES_V1 } from '../constants/recommendationPrompts';
import { recommendGptV1 } from './recommendGptV1';
import { Intent, PriceLevel, RecommendationsInput, Vibe } from './types';
import { recommendGSearchV1 } from './recommendGV1';

const testCases: {
  name: string;
  params: RecommendationsInput;
}[] = [
  {
    name: 'Party, Socialize, Eat',
    params: {
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
  },
  {
    name: 'Music, Socialize, Eat, LA',
    params: {
      currentLocation: {
        address: '732 S Spring Street, Los Angeles, CA 90014',
      },
      intent: Intent.music,
      additionalIntents: [Intent.socialize, Intent.eat],
      vibe: [Vibe.romantic, Vibe.chill],
      distanceContext: {
        maxTravelTimeMinutes: 25,
      },
      costContext: {
        priceLevels: [
          PriceLevel.cheap,
          PriceLevel.moderate,
          PriceLevel.expensive,
        ],
      },
    },
  },
];

const testGPT = async (index: number) => {
  let start = new Date();
  console.log('Running the recommendation engine...');
  let recommendations = await recommendGptV1(testCases[index].params, {
    model: 'gpt-4o',
    setupSystemMessages: SYSTEM_MESSAGES_V1,
  });
  let end = new Date();

  console.log(
    `Recommendation engine ran in ${(end.getTime() - start.getTime()) / 1000} seconds`,
  );

  console.log(recommendations);
  fs.writeFileSync(
    'examples/recommendations-party-socialize-eat.json',
    JSON.stringify(recommendations, null, 2),
  );
};

const testGoogleRecs = async (index: number) => {
  let start = new Date();
  console.log('Running the recommendation engine...');
  let recommendations = await recommendGSearchV1(testCases[index].params);
  let end = new Date();

  console.log(
    `Recommendation engine ran in ${(end.getTime() - start.getTime()) / 1000} seconds`,
  );

  console.log(recommendations);
  fs.writeFileSync(
    'examples/recommendations-goog-party-socialize-eat.json',
    JSON.stringify(recommendations, null, 2),
  );
};

if (require.main === module) {
  (async () => {
    // await testGPT();
    await testGoogleRecs(1);
  })();
}
