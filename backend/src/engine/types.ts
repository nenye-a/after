import { Coordinates } from '../types/location';

export enum Intent {
  explore = 'Explore',
  eat = 'Eat',
  drink = 'Drink',
  party = 'Party',
  music = 'Music',
  socialize = 'Socialize',
}

export enum Destination {
  restaurant = 'Restaurant',
  bar = 'Bar',
  club = 'Club',
}

export enum PriceLevel {
  cheap = '$',
  moderate = '$$',
  expensive = '$$$',
  veryExpensive = '$$$$',
}

export enum Vibe {
  lit = 'Lit',
  adventurous = 'Adventurous',
  playful = 'Playful',
  chill = 'Chill',
  social = 'Social',
  romantic = 'Romantic',
  festive = 'Festive',
}

export type RecommendationsInput = {
  // Location of the user at time of recommendation.
  currentLocation: {
    coordinates?: Coordinates;
    address?: string;
    name?: string;
  };
  // What the user intends to do primarily. They may supplement with
  // other lower priority intents.
  intent: Intent;
  additionalIntents?: Intent[];
  vibe?: Vibe[];
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
};

export type Recommender = {
  (request: RecommendationsInput): Promise<any>;
};
