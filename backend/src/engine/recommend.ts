import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
} from 'openai/resources';
import openai from '../api/openai';

// TODO: Store messages like this in a database.
const CHAT_GPT_SETUP_SYSTEM_MESSAGES = [
  `
You help users find the next venue/event (collectively "destination") to go from their current 
location. You will determine venues/events based on the user's mood/intent, their current location 
and search radius, price range, ticket price limit, interests, time, culture, and presence in a group.

Step 1: Understand the user's current vibe (aka current preference or intent), and expected
destination type, and general interests. Users can indicate up to 3 desired vibes, and any number 
of eligible destinations or interests. This information is helpful for filtering out venues that 
typically would not match the user's current vibe. Prioritize destination and vibe, and only use
interest as a secondary filter. Understand if the user is looking as an individual or as a group.
Factor in the users age, and only choose age appropriate destinations. Consider the user's culture
as well, but to a much lesser extent.

Step 2. Understand the user's current location, search radius in both miles and minutes, and time.
Do not suggest any destinations that are outside of this range. However, if you find very good
destinations slightly outside of range, keep them in mind for later. 

DO NOT SUGGEST any locations that are closed, or are expected to be closed by the time the user arrives,
in any circumstance. Assume the user will be leaving the current location within 5 minutes after the provided time.
So evaluate if a location will be closed by the time the user arrives, and if so, do not suggest it.

Step 3. Understand the user's price range and ticket price limit. This is an important filter, but you
can be slightly flexible. A dollar sign rating, or number representing such (similar to what's used on Google) 
will be provided. You may suggest locations that are exactly that $$ or less. If a ticket price limit is 
provided, you can show locations that are 10% higher and less, if that information is available or can be 
estimated. These may not be provided, and if not can be ignored for purpose of this task.

Step 4. Search for eligible destinations based on the prior steps. Search primarily for venues, and then for
any active events. Focus on accuracy, if there's a destination that seems a match, but has potentially inaccurate
information, mark it with a warning and point to the field that may be incorrect. Attempt to find 5 - 10 destinations. 
If none are available, but you have some matches outside of range, provide them with a mark for out of range. 
If no matches at all, provide an empty list.

For each destination, provide:
- Info: name, address, open hours, google maps link, website link, phone, brief description, price range, ticket price.
- Type: venue or event. If venue, list any potential events. If event, provide link to the event.
- Context: Provide as labels any of the matching input vibes, with a brief description of why this is a match
- Warning: Boolean - if there are any potential inaccuracies, or closures, mark this as true.
- Out of range: Boolean - if this is outside of the search radius, mark this as true.
- Inaccuracies: list any fields that may be inaccurate, and provide a brief description of why.
- Travel: Distance away, potential travel time -- by walk or car
- Not enough time: Boolean - if we think they may arrive without enough time to enjoy the destination. If any locations
  are like this, then penalize their match score and place a note explaining that they were penalized. For restaurants and
  bars -- arriving less than 30 minutes for close. For others use best judgement.
- Match score: A score from 0-100, indicating how well this matches the user's preferences.
- Notes: Other notes that are releavant and critical to the user's ability to go there.
- Why good followup given current location.


Rank the user by match score. Provide the resulting list as an output to the user, in JSON format. In the json format
place the list under the key "destinations".
`,
  `User Vibes and their meanings:
  Lit: Seeking high-energy environments.
  Adventurous: Interested in exploring new or unfamiliar places.
  Games: Wanting a fun, playful experience (arcades, amusement parks).
  Chill: Looking for a calm and peaceful place.
  Hungry: Craving food and dining experiences.
  Social: Wanting to meet new people or hang out with friends.
  Lounging: Wanting to lounge and kick back, optionally with a drink
  Educational: Desiring to learn or see something new (museums, galleries).
  Romantic: Looking for a place with a romantic atmosphere.
  Active: Wanting to engage in physical activities (parks, gyms).
  Cultural: Interested in experiencing local culture and traditions.
  Musical: Interested in experiencing local culture and traditions.
  Festive: Looking to celebrate or join in on an event or festival.

  If any vibes are not listed, please infer the meaning based on the other details
  and general user interests.
  `,
  `Google maps links must be official links to the location, not a dynamic google link. 
  If you can't find the official link, don't provide one.`,
];

const CHAT_GPT_ASSISTANT_MESSAGES: string[] = [];

interface RecommendationsInput {
  location: {
    coordinates?: [number, number];
    address?: string;
    name?: string;
    home?: boolean;
    work?: boolean;
  };
  vibes: string[];
  destinationTypes?: string[];
  searchRadius: number;
  priceRange?: number;
  ticketPriceLimit?: number;
  interests?: string[];
  time?: Date;
  otherDetails?: {
    userId?: string;
    userAge?: number;
    userCulture?: string;
    preferredMinuteRadius?: number;
  };
  group?: boolean;
}

/**
 * Provide recommendations for next location, using situational
 * preferences.
 * @param location
 * @param vibes
 * @param destinationTypes
 * @param searchRadius
 * @param priceRange
 * @param ticketPriceLimit
 * @param interests
 * @param time
 * @param otherDetails
 */
const recommend = async (request: RecommendationsInput) => {
  let {
    location,
    vibes,
    destinationTypes,
    searchRadius,
    priceRange,
    ticketPriceLimit,
    interests,
    time,
    otherDetails,
  } = request;

  let { userId, userAge, userCulture, preferredMinuteRadius } =
    otherDetails ?? {};
  // 1. Preprocess information for search engine. Underlying engine will first use chatGPT.

  // Handle locations.
  let { address, coordinates, name: locationName, work, home } = location;
  let locationMessage = `Currently at ${locationName}(${location.address}).`;
  let homeMessage = home ? 'At home.' : '';
  let workMessage = work ? 'At work.' : '';
  let timeMessage = time ? `Time: ${time.toISOString()}` : '';
  // Output:
  let compiledLocationMessage = `${locationMessage} ${homeMessage} ${workMessage} ${timeMessage}`;

  // Handle mood and interests.
  let vibesMessage = 'Vibes: ' + vibes.join(', ');
  let destinationTypesMessage = destinationTypes
    ? `Destination types: ${destinationTypes.join(', ')}`
    : '';
  let interestsMessage = interests ? `Interests: ${interests.join(', ')}` : '';

  // Search radius.
  let searchRadiusMessage = `Search radius: ${searchRadius} miles.`;
  let searchRadiusMinutesMessage = preferredMinuteRadius
    ? `Search radius: ${preferredMinuteRadius} minutes.`
    : '';

  // Price range.
  let priceRangeMessage = priceRange
    ? `Price range: $${priceRange} or less.`
    : '';
  let ticketPriceLimitMessage = ticketPriceLimit
    ? `Ticket price limit: $${ticketPriceLimit} or less.`
    : '';

  let userAgeMessage = userAge ? `User age: ${userAge}.` : '';
  let userCultureMessage = userCulture ? `User culture: ${userCulture}.` : '';

  // 2. Obtain recommendations from the search engine.
  console.log('Making request');
  let rawRecommendations = await openai.chat.completions.create({
    messages: [
      ...CHAT_GPT_SETUP_SYSTEM_MESSAGES.map(
        (content: string): ChatCompletionSystemMessageParam => ({
          role: 'system',
          content,
        }),
      ),
      ...CHAT_GPT_ASSISTANT_MESSAGES.map(
        (content: string): ChatCompletionAssistantMessageParam => ({
          role: 'assistant',
          content,
        }),
      ),
      { role: 'user', content: compiledLocationMessage },
      { role: 'user', content: vibesMessage },
      { role: 'user', content: destinationTypesMessage },
      { role: 'user', content: interestsMessage },
      { role: 'user', content: searchRadiusMessage },
      { role: 'user', content: searchRadiusMinutesMessage },
      { role: 'user', content: priceRangeMessage },
      { role: 'user', content: ticketPriceLimitMessage },
      { role: 'user', content: userAgeMessage },
      { role: 'user', content: userCultureMessage },
    ],
    model: 'gpt-4o',
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
  recommend({
    location: {
      address: '1010 Banks St, Houston, TX 77006',
      name: 'Grand Prize',
    },
    vibes: ['Lit', 'Adventurous', 'Social'],
    searchRadius: 10,
    priceRange: 2,
    // ticketPriceLimit: 10,
    // interests: ['Food', 'Drinks'],
    time: new Date(),
    otherDetails: {
      // userId: '1234',
      userAge: 28,
      userCulture: 'Nigerian',
      preferredMinuteRadius: 20,
    },
  }).then((recommendations) => {
    recommendations.forEach(console.log);
  });
}
