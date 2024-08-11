import convert from 'convert';
import {
  getCoordinates,
  GooglePlaceEntertainmentType,
  GooglePlaceFoodDrinkType,
  googleSearch,
} from '../api/google';
import { Intent, PriceLevel, RecommendationsInput, Vibe } from './types';

const DEFAULT_RADIUS_MILES = 10;

/**
 * Google based nearby ranked recommendations. This version of the function will
 * directly obtain recommendations from the Google Places API. Future versions
 * of this function will make use of semi-cached recommendations, to prevent needing
 * to make a request to the Google Places API every time.
 *
 * @param request
 */
export const recommendGSearchV1 = async (request: RecommendationsInput) => {
  let {
    currentLocation: { coordinates, address },
    intent,
    additionalIntents,
    vibe,
    distanceContext,
    costContext,
  } = request;

  if (!coordinates && address) {
    // Get coordinates from address.
    coordinates = (await getCoordinates(address)) ?? undefined;
  }

  if (!coordinates) {
    throw new Error('Coordinates or a valid address must be provided.');
  }

  let searchRadiusMiles = convert(
    distanceContext?.searchRadiusMiles ?? DEFAULT_RADIUS_MILES,
    'miles',
  ).to('meters');

  // Compile search text. Due to the limitations on the parameters for neaby search, will
  // search for places using google search.
  let searchQueries = generateSearchQueries({
    intent,
    additionalIntents,
    vibes: vibe,
  });

  console.log(coordinates, searchRadiusMiles, searchQueries);

  let searchResults = await Promise.all(
    searchQueries.map((query) =>
      // NOTE: Will only run a single query for now, and get the first page results for each.
      // Technically could get up to 60 for each, but this will be too expensive for getting
      // the MVP up and running.
      googleSearch(
        query.searchText,
        [
          'id',
          'displayName',
          'formattedAddress',
          'googleMapsUri',
          'photos',
          'primaryTypeDisplayName',
          'currentOpeningHours',
          'businessStatus',
          'location',
          'rating',
          'userRatingCount',
          'websiteUri',
          'nationalPhoneNumber',
          'priceLevel',
          'editorialSummary',
        ],
        {
          ...(query.includedType ? { includedType: query.includedType } : {}),
          locationBias: {
            circle: {
              center: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              },
              radius: searchRadiusMiles,
            },
          },
          openNow: true,
          rankPreference: 'RELEVANCE',
          ...(costContext?.priceLevels
            ? {
                priceLevels: [
                  ...costContext.priceLevels.map((priceLevel) => {
                    switch (priceLevel) {
                      case PriceLevel.cheap:
                        return 'PRICE_LEVEL_INEXPENSIVE';
                      case PriceLevel.moderate:
                        return 'PRICE_LEVEL_MODERATE';
                      case PriceLevel.expensive:
                        return 'PRICE_LEVEL_EXPENSIVE';
                      case PriceLevel.veryExpensive:
                        return 'PRICE_LEVEL_VERY_EXPENSIVE';
                      default:
                        return 'PRICE_LEVEL_UNSPECIFIED';
                    }
                  }),
                  'PRICE_LEVEL_UNSPECIFIED',
                ],
              }
            : {}),
        },
      ),
    ),
  ).then((results) =>
    results.flatMap((result) => {
      console.log(result);
      return result?.places ?? [];
    }),
  );

  if (searchResults?.length) searchResults = compositeRatingSort(searchResults);

  return searchResults;
};

/**
 * Take the intent and additional intents and generate search queries.
 * @param options
 * @returns
 */
function generateSearchQueries(options: {
  intent: Intent;
  additionalIntents?: Intent[];
  vibes?: Vibe[];
}): {
  searchText: string;
  includedType?:
    | GooglePlaceEntertainmentType
    | GooglePlaceFoodDrinkType
    | null
    | undefined;
}[] {
  const queries = [];
  const { intent, additionalIntents = [], vibes = [] } = options;

  // Define type mappings

  const typeMapping: {
    [key in Intent]:
      | GooglePlaceEntertainmentType
      | GooglePlaceFoodDrinkType
      | null;
  } = {
    Eat: 'restaurant',
    Drink: 'bar',
    Party: 'night_club',
    Music: null,
    Socialize: null,
    Explore: null,
  };

  // Primary intent search
  let searchText = String(intent);
  let includedType = typeMapping[intent];

  // Supplement with additional intents and vibes
  if (additionalIntents?.length) {
    searchText += ' ' + additionalIntents.join(' ');
  }

  let searchTextWithVibes = searchText + ' ' + vibes.join(' ');

  // // Push the main search query, without any vibes.
  // queries.push({
  //   searchText: searchText,
  //   includedType: includedType,
  // });

  // Push search query with vibes
  queries.push({
    searchText: searchTextWithVibes,
  });

  // if (includedType) {
  //   // Push search query with vibes and type
  //   queries.push({
  //     searchText: searchTextWithVibes,
  //     includedType,
  //   });
  // }

  // NOTE: For now just returning a single text query to save cost. Will only take the first page of results
  // but maybe later will expand depending on cost analysis and usage.
  return queries;
}

/**
 * Sorts the places list based on a composite rating.
 * @param placesList
 * @returns
 */
function compositeRatingSort(
  placesList: ({
    rating: number;
    userRatingCount: number;
  } & Record<string, unknown>)[],
) {
  const ratingResponsivenessFactor = 5; // 1 - 10 scale. 5 is neutral. Lower is more responsive to the actual rating.
  const totalRatings = placesList.reduce(
    (acc, item) => acc + item.userRatingCount,
    0,
  );
  const totalWeightedRating = placesList.reduce(
    (acc, item) => acc + item.rating * item.userRatingCount,
    0,
  );
  const baselineRating = totalWeightedRating / totalRatings;

  return placesList
    .map((place) => {
      let trueRating =
        (place.rating * place.userRatingCount +
          baselineRating * ratingResponsivenessFactor) /
        (place.userRatingCount + ratingResponsivenessFactor);
      return {
        place,
        trueRating,
      };
    })
    .sort((a, b) => b.trueRating - a.trueRating)
    .map((item) => item.place);
}
