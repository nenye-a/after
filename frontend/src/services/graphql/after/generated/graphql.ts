/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type CoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CoordinatesType = {
  __typename?: 'CoordinatesType';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type GooglePreviewLocationType = {
  __typename?: 'GooglePreviewLocationType';
  address: Scalars['String']['output'];
  coordinates: CoordinatesType;
  displayName: Scalars['String']['output'];
  google_place_id: Scalars['String']['output'];
  num_ratings: Maybe<Scalars['Float']['output']>;
  rating: Maybe<Scalars['Float']['output']>;
  types: Array<Scalars['String']['output']>;
};

export type LocationExternalIds = {
  __typename?: 'LocationExternalIds';
  google_place_id: Maybe<Scalars['String']['output']>;
  here_id: Maybe<Scalars['String']['output']>;
  yelp_id: Maybe<Scalars['String']['output']>;
};

export type LocationInfo = {
  __typename?: 'LocationInfo';
  google_photo_names: Maybe<Array<Scalars['String']['output']>>;
  image_urls: Maybe<Array<Scalars['String']['output']>>;
  num_ratings: Maybe<Scalars['Float']['output']>;
  price_level: Maybe<PriceLevel>;
  rating: Maybe<Scalars['Float']['output']>;
  tags: Maybe<Array<Scalars['String']['output']>>;
  type: Maybe<Scalars['String']['output']>;
};

export type LocationType = {
  __typename?: 'LocationType';
  _id: Scalars['ID']['output'];
  address: Scalars['String']['output'];
  arrival_time: Scalars['DateTimeISO']['output'];
  city: Maybe<Scalars['String']['output']>;
  coordinates: CoordinatesType;
  departure_time: Maybe<Scalars['DateTimeISO']['output']>;
  external_ids: LocationExternalIds;
  favorite: Maybe<Scalars['Boolean']['output']>;
  info: LocationInfo;
  name: Scalars['String']['output'];
  nickname: Maybe<Scalars['String']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  outing_id: Scalars['ID']['output'];
  recommendation_id: Maybe<Scalars['ID']['output']>;
  user_id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLocationFromPoint: Maybe<LocationType>;
  createPath: Scalars['Boolean']['output'];
  createUser: UserType;
  endLocationStay: Maybe<LocationType>;
  endOuting: OutingType;
  pauseOuting: OutingType;
  startOuting: OutingAndLocationType;
};


export type MutationCreateLocationFromPointArgs = {
  coordinates: CoordinatesInput;
};


export type MutationCreatePathArgs = {
  points: Array<PathInput>;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationEndLocationStayArgs = {
  locationId: Scalars['ID']['input'];
};


export type MutationStartOutingArgs = {
  coordinates?: InputMaybe<CoordinatesInput>;
};

export type OutingAndLocationType = {
  __typename?: 'OutingAndLocationType';
  location: Maybe<LocationType>;
  outing: OutingType;
};

export type OutingLocationType = {
  __typename?: 'OutingLocationType';
  locations: Array<LocationType>;
  outing_id: Scalars['ID']['output'];
};

export type OutingPathType = {
  __typename?: 'OutingPathType';
  outing_id: Scalars['ID']['output'];
  points: Array<PathType>;
};

export type OutingType = {
  __typename?: 'OutingType';
  _id: Scalars['ID']['output'];
  automatically_ended: Maybe<Scalars['Boolean']['output']>;
  city: Maybe<Scalars['String']['output']>;
  end_date: Maybe<Scalars['DateTimeISO']['output']>;
  favorite: Maybe<Scalars['Boolean']['output']>;
  images: Maybe<Array<Scalars['String']['output']>>;
  linked_outing_id: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  num_locations: Maybe<Scalars['Float']['output']>;
  num_participants: Maybe<Scalars['Float']['output']>;
  start_date: Scalars['DateTimeISO']['output'];
  status: Scalars['String']['output'];
  user_id: Scalars['String']['output'];
};

export type PathInput = {
  coordinates: CoordinatesInput;
  time: Scalars['DateTimeISO']['input'];
};

export type PathType = {
  __typename?: 'PathType';
  _id: Scalars['ID']['output'];
  coordinates: CoordinatesType;
  linked_outing_id: Maybe<Scalars['String']['output']>;
  location_id: Maybe<Scalars['ID']['output']>;
  outing_id: Scalars['ID']['output'];
  time: Scalars['DateTimeISO']['output'];
  user_id: Scalars['ID']['output'];
};

/** Price level of a location */
export enum PriceLevel {
  cheap = 'cheap',
  expensive = 'expensive',
  moderate = 'moderate',
  veryExpensive = 'veryExpensive'
}

export type Query = {
  __typename?: 'Query';
  getActiveOuting: Maybe<OutingType>;
  getAllUsers: Array<UserType>;
  getGooglePreviewLocation: Maybe<GooglePreviewLocationType>;
  getLocationDetails: Maybe<LocationType>;
  getManyOutingLocations: Array<OutingLocationType>;
  getOuting: OutingType;
  getOutingLocations: Array<LocationType>;
  getOutingPaths: Array<OutingPathType>;
  getOutings: Array<OutingType>;
  getUser: UserType;
};


export type QueryGetActiveOutingArgs = {
  includeAdditionalInfo?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetGooglePreviewLocationArgs = {
  coordinates: CoordinatesInput;
};


export type QueryGetLocationDetailsArgs = {
  locationId: Scalars['ID']['input'];
};


export type QueryGetManyOutingLocationsArgs = {
  outingIds: Array<Scalars['ID']['input']>;
};


export type QueryGetOutingArgs = {
  includeAdditionalInfo?: InputMaybe<Scalars['Boolean']['input']>;
  outingId: Scalars['String']['input'];
};


export type QueryGetOutingLocationsArgs = {
  outingId: Scalars['ID']['input'];
};


export type QueryGetOutingPathsArgs = {
  outing_ids: Array<Scalars['ID']['input']>;
};


export type QueryGetOutingsArgs = {
  includeAdditionalInfo?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UserCreateInput = {
  auth0_id: Scalars['String']['input'];
  email: Scalars['String']['input'];
  first_name?: InputMaybe<Scalars['String']['input']>;
  home_address?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  first_name: Maybe<Scalars['String']['output']>;
  home_address: Maybe<Scalars['String']['output']>;
  last_name: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
};

export type GetGooglePreviewLocationQueryVariables = Exact<{
  coordinates: CoordinatesInput;
}>;


export type GetGooglePreviewLocationQuery = { __typename?: 'Query', getGooglePreviewLocation: { __typename?: 'GooglePreviewLocationType', google_place_id: string, displayName: string, address: string, types: Array<string>, rating: number | null, num_ratings: number | null, coordinates: { __typename?: 'CoordinatesType', latitude: number, longitude: number } } | null };

export type GetOutingLocationsQueryVariables = Exact<{
  outingId: Scalars['ID']['input'];
}>;


export type GetOutingLocationsQuery = { __typename?: 'Query', getOutingLocations: Array<{ __typename?: 'LocationType', _id: string, user_id: string, outing_id: string, name: string, address: string, city: string | null, arrival_time: any, departure_time: any | null, recommendation_id: string | null, nickname: string | null, notes: string | null, favorite: boolean | null, coordinates: { __typename?: 'CoordinatesType', latitude: number, longitude: number }, info: { __typename?: 'LocationInfo', type: string | null, rating: number | null, num_ratings: number | null, price_level: PriceLevel | null, image_urls: Array<string> | null, google_photo_names: Array<string> | null, tags: Array<string> | null }, external_ids: { __typename?: 'LocationExternalIds', google_place_id: string | null, yelp_id: string | null, here_id: string | null } }> };

export type GetManyOutingLocationsQueryVariables = Exact<{
  outingIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetManyOutingLocationsQuery = { __typename?: 'Query', getManyOutingLocations: Array<{ __typename?: 'OutingLocationType', outing_id: string, locations: Array<{ __typename?: 'LocationType', _id: string, user_id: string, outing_id: string, name: string, address: string, city: string | null, arrival_time: any, departure_time: any | null, recommendation_id: string | null, nickname: string | null, notes: string | null, favorite: boolean | null, coordinates: { __typename?: 'CoordinatesType', latitude: number, longitude: number }, info: { __typename?: 'LocationInfo', type: string | null, rating: number | null, num_ratings: number | null, price_level: PriceLevel | null, image_urls: Array<string> | null, google_photo_names: Array<string> | null, tags: Array<string> | null }, external_ids: { __typename?: 'LocationExternalIds', google_place_id: string | null, yelp_id: string | null, here_id: string | null } }> }> };

export type DepartLocationMutationVariables = Exact<{
  locationId: Scalars['ID']['input'];
}>;


export type DepartLocationMutation = { __typename?: 'Mutation', endLocationStay: { __typename?: 'LocationType', _id: string, user_id: string, outing_id: string, name: string, address: string, city: string | null, arrival_time: any, departure_time: any | null, recommendation_id: string | null, nickname: string | null, notes: string | null, favorite: boolean | null, coordinates: { __typename?: 'CoordinatesType', latitude: number, longitude: number }, info: { __typename?: 'LocationInfo', type: string | null, rating: number | null, num_ratings: number | null, price_level: PriceLevel | null, image_urls: Array<string> | null, tags: Array<string> | null }, external_ids: { __typename?: 'LocationExternalIds', google_place_id: string | null, yelp_id: string | null, here_id: string | null } } | null };

export type CreateLocationFromPointMutationVariables = Exact<{
  coordinates: CoordinatesInput;
}>;


export type CreateLocationFromPointMutation = { __typename?: 'Mutation', createLocationFromPoint: { __typename?: 'LocationType', _id: string, user_id: string, outing_id: string, name: string, address: string, city: string | null, arrival_time: any, departure_time: any | null, recommendation_id: string | null, nickname: string | null, notes: string | null, favorite: boolean | null, coordinates: { __typename?: 'CoordinatesType', latitude: number, longitude: number }, info: { __typename?: 'LocationInfo', type: string | null, rating: number | null, num_ratings: number | null, price_level: PriceLevel | null, image_urls: Array<string> | null, tags: Array<string> | null }, external_ids: { __typename?: 'LocationExternalIds', google_place_id: string | null, yelp_id: string | null, here_id: string | null } } | null };

export type GetActiveOutingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOutingQuery = { __typename?: 'Query', getActiveOuting: { __typename?: 'OutingType', _id: string, name: string, start_date: any, end_date: any | null, status: string, linked_outing_id: string | null } | null };

export type GetOutingsQueryVariables = Exact<{
  includeAdditionalInfo?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetOutingsQuery = { __typename?: 'Query', getOutings: Array<{ __typename?: 'OutingType', _id: string, user_id: string, name: string, status: string, start_date: any, end_date: any | null, linked_outing_id: string | null, favorite: boolean | null, automatically_ended: boolean | null, num_locations: number | null, num_participants: number | null, images: Array<string> | null, city: string | null }> };

export type StartOutingMutationVariables = Exact<{
  coordinates?: InputMaybe<CoordinatesInput>;
}>;


export type StartOutingMutation = { __typename?: 'Mutation', startOuting: { __typename?: 'OutingAndLocationType', outing: { __typename?: 'OutingType', _id: string, name: string, start_date: any, end_date: any | null, status: string, linked_outing_id: string | null }, location: { __typename?: 'LocationType', _id: string, user_id: string, outing_id: string, name: string, address: string, city: string | null, arrival_time: any, departure_time: any | null, recommendation_id: string | null, nickname: string | null, notes: string | null, favorite: boolean | null, coordinates: { __typename?: 'CoordinatesType', latitude: number, longitude: number }, info: { __typename?: 'LocationInfo', type: string | null, rating: number | null, num_ratings: number | null, price_level: PriceLevel | null, image_urls: Array<string> | null, google_photo_names: Array<string> | null, tags: Array<string> | null }, external_ids: { __typename?: 'LocationExternalIds', google_place_id: string | null, yelp_id: string | null, here_id: string | null } } | null } };

export type EndOutingMutationVariables = Exact<{ [key: string]: never; }>;


export type EndOutingMutation = { __typename?: 'Mutation', endOuting: { __typename?: 'OutingType', _id: string, name: string, start_date: any, end_date: any | null, status: string, linked_outing_id: string | null } };

export type GetOutingPathsQueryVariables = Exact<{
  outingIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetOutingPathsQuery = { __typename?: 'Query', getOutingPaths: Array<{ __typename?: 'OutingPathType', outing_id: string, points: Array<{ __typename?: 'PathType', _id: string, user_id: string, outing_id: string, time: any, linked_outing_id: string | null, location_id: string | null, coordinates: { __typename?: 'CoordinatesType', latitude: number, longitude: number } }> }> };

export type CreatePathMutationVariables = Exact<{
  points: Array<PathInput> | PathInput;
}>;


export type CreatePathMutation = { __typename?: 'Mutation', createPath: boolean };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'UserType', _id: string, email: string, first_name: string | null, last_name: string | null, phone: string | null, home_address: string | null }> };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'UserType', _id: string, email: string, first_name: string | null, last_name: string | null, phone: string | null, home_address: string | null } };

export type CreateUserMutationVariables = Exact<{
  data: UserCreateInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserType', _id: string, email: string, first_name: string | null, last_name: string | null, phone: string | null, home_address: string | null } };


export const GetGooglePreviewLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGooglePreviewLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGooglePreviewLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"coordinates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"google_place_id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"types"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"num_ratings"}}]}}]}}]} as unknown as DocumentNode<GetGooglePreviewLocationQuery, GetGooglePreviewLocationQueryVariables>;
export const GetOutingLocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutingLocations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"outingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOutingLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"outingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"outingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_time"}},{"kind":"Field","name":{"kind":"Name","value":"departure_time"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"num_ratings"}},{"kind":"Field","name":{"kind":"Name","value":"price_level"}},{"kind":"Field","name":{"kind":"Name","value":"image_urls"}},{"kind":"Field","name":{"kind":"Name","value":"google_photo_names"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"google_place_id"}},{"kind":"Field","name":{"kind":"Name","value":"yelp_id"}},{"kind":"Field","name":{"kind":"Name","value":"here_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recommendation_id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"favorite"}}]}}]}}]} as unknown as DocumentNode<GetOutingLocationsQuery, GetOutingLocationsQueryVariables>;
export const GetManyOutingLocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetManyOutingLocations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"outingIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getManyOutingLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"outingIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"outingIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_time"}},{"kind":"Field","name":{"kind":"Name","value":"departure_time"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"num_ratings"}},{"kind":"Field","name":{"kind":"Name","value":"price_level"}},{"kind":"Field","name":{"kind":"Name","value":"image_urls"}},{"kind":"Field","name":{"kind":"Name","value":"google_photo_names"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"google_place_id"}},{"kind":"Field","name":{"kind":"Name","value":"yelp_id"}},{"kind":"Field","name":{"kind":"Name","value":"here_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recommendation_id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"favorite"}}]}}]}}]}}]} as unknown as DocumentNode<GetManyOutingLocationsQuery, GetManyOutingLocationsQueryVariables>;
export const DepartLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DepartLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endLocationStay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_time"}},{"kind":"Field","name":{"kind":"Name","value":"departure_time"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"num_ratings"}},{"kind":"Field","name":{"kind":"Name","value":"price_level"}},{"kind":"Field","name":{"kind":"Name","value":"image_urls"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"google_place_id"}},{"kind":"Field","name":{"kind":"Name","value":"yelp_id"}},{"kind":"Field","name":{"kind":"Name","value":"here_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recommendation_id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"favorite"}}]}}]}}]} as unknown as DocumentNode<DepartLocationMutation, DepartLocationMutationVariables>;
export const CreateLocationFromPointDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLocationFromPoint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLocationFromPoint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"coordinates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_time"}},{"kind":"Field","name":{"kind":"Name","value":"departure_time"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"num_ratings"}},{"kind":"Field","name":{"kind":"Name","value":"price_level"}},{"kind":"Field","name":{"kind":"Name","value":"image_urls"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"google_place_id"}},{"kind":"Field","name":{"kind":"Name","value":"yelp_id"}},{"kind":"Field","name":{"kind":"Name","value":"here_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recommendation_id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"favorite"}}]}}]}}]} as unknown as DocumentNode<CreateLocationFromPointMutation, CreateLocationFromPointMutationVariables>;
export const GetActiveOutingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveOuting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveOuting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"linked_outing_id"}}]}}]}}]} as unknown as DocumentNode<GetActiveOutingQuery, GetActiveOutingQueryVariables>;
export const GetOutingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeAdditionalInfo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOutings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeAdditionalInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeAdditionalInfo"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"linked_outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"favorite"}},{"kind":"Field","name":{"kind":"Name","value":"automatically_ended"}},{"kind":"Field","name":{"kind":"Name","value":"num_locations"}},{"kind":"Field","name":{"kind":"Name","value":"num_participants"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"city"}}]}}]}}]} as unknown as DocumentNode<GetOutingsQuery, GetOutingsQueryVariables>;
export const StartOutingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartOuting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinatesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startOuting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"coordinates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"outing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"linked_outing_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_time"}},{"kind":"Field","name":{"kind":"Name","value":"departure_time"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"num_ratings"}},{"kind":"Field","name":{"kind":"Name","value":"price_level"}},{"kind":"Field","name":{"kind":"Name","value":"image_urls"}},{"kind":"Field","name":{"kind":"Name","value":"google_photo_names"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external_ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"google_place_id"}},{"kind":"Field","name":{"kind":"Name","value":"yelp_id"}},{"kind":"Field","name":{"kind":"Name","value":"here_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recommendation_id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"favorite"}}]}}]}}]}}]} as unknown as DocumentNode<StartOutingMutation, StartOutingMutationVariables>;
export const EndOutingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndOuting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endOuting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"linked_outing_id"}}]}}]}}]} as unknown as DocumentNode<EndOutingMutation, EndOutingMutationVariables>;
export const GetOutingPathsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutingPaths"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"outingIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOutingPaths"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"outing_ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"outingIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"linked_outing_id"}},{"kind":"Field","name":{"kind":"Name","value":"location_id"}}]}}]}}]}}]} as unknown as DocumentNode<GetOutingPathsQuery, GetOutingPathsQueryVariables>;
export const CreatePathDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePath"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"points"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PathInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPath"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"points"},"value":{"kind":"Variable","name":{"kind":"Name","value":"points"}}}]}]}}]} as unknown as DocumentNode<CreatePathMutation, CreatePathMutationVariables>;
export const GetAllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"home_address"}}]}}]}}]} as unknown as DocumentNode<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"home_address"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"home_address"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;