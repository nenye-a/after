/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetGooglePreviewLocation($coordinates: CoordinatesInput!) {\n    getGooglePreviewLocation(coordinates: $coordinates) {\n      google_place_id\n      displayName\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      types\n      rating\n      num_ratings\n    }\n  }\n": types.GetGooglePreviewLocationDocument,
    "\n  query GetOutingLocations($outingId: ID!) {\n    getOutingLocations(outingId: $outingId) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        google_photo_names\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n": types.GetOutingLocationsDocument,
    "\n  query GetManyOutingLocations($outingIds: [ID!]!) {\n    getManyOutingLocations(outingIds: $outingIds) {\n      outing_id\n      locations {\n        _id\n        user_id\n        outing_id\n        name\n        address\n        coordinates {\n          latitude\n          longitude\n        }\n        city\n        arrival_time\n        departure_time\n        info {\n          type\n          rating\n          num_ratings\n          price_level\n          image_urls\n          google_photo_names\n          tags\n        }\n        external_ids {\n          google_place_id\n          yelp_id\n          here_id\n        }\n        recommendation_id\n        nickname\n        notes\n        favorite\n      }\n    }\n  }\n": types.GetManyOutingLocationsDocument,
    "\n  mutation DepartLocation($locationId: ID!) {\n    endLocationStay(locationId: $locationId) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n": types.DepartLocationDocument,
    "\n  mutation CreateLocationFromPoint($coordinates: CoordinatesInput!) {\n    createLocationFromPoint(coordinates: $coordinates) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n": types.CreateLocationFromPointDocument,
    "\n  query GetActiveOuting {\n    getActiveOuting {\n      _id\n      name\n      start_date\n      end_date\n      status\n      linked_outing_id\n    }\n  }\n": types.GetActiveOutingDocument,
    "\n  query GetOutings($includeAdditionalInfo: Boolean, $status: [String!]) {\n    getOutings(includeAdditionalInfo: $includeAdditionalInfo, status: $status) {\n      _id\n      user_id\n      name\n      status\n      start_date\n      end_date\n      linked_outing_id\n      favorite\n      automatically_ended\n      num_locations\n      num_participants\n      images\n      city\n    }\n  }\n": types.GetOutingsDocument,
    "\n  mutation StartOuting($coordinates: CoordinatesInput) {\n    startOuting(coordinates: $coordinates) {\n      outing {\n        _id\n        name\n        start_date\n        end_date\n        status\n        linked_outing_id\n      }\n      location {\n        _id\n        user_id\n        outing_id\n        name\n        address\n        coordinates {\n          latitude\n          longitude\n        }\n        city\n        arrival_time\n        departure_time\n        info {\n          type\n          rating\n          num_ratings\n          price_level\n          image_urls\n          google_photo_names\n          tags\n        }\n        external_ids {\n          google_place_id\n          yelp_id\n          here_id\n        }\n        recommendation_id\n        nickname\n        notes\n        favorite\n      }\n    }\n  }\n": types.StartOutingDocument,
    "\n  mutation EndOuting {\n    endOuting {\n      _id\n      name\n      start_date\n      end_date\n      status\n      linked_outing_id\n    }\n  }\n": types.EndOutingDocument,
    "\n  query GetOutingPaths($outingIds: [ID!]!) {\n    getOutingPaths(outing_ids: $outingIds) {\n      outing_id\n      points {\n        _id\n        user_id\n        coordinates {\n          latitude\n          longitude\n        }\n        outing_id\n        time\n        linked_outing_id\n        location_id\n      }\n    }\n  }\n": types.GetOutingPathsDocument,
    "\n  mutation CreatePath($points: [PathInput!]!) {\n    createPath(points: $points)\n  }\n": types.CreatePathDocument,
    "\n  query GetAllUsers {\n    getAllUsers {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n": types.GetAllUsersDocument,
    "\n  query GetUser {\n    getUser {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n": types.GetUserDocument,
    "\n  mutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n": types.CreateUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGooglePreviewLocation($coordinates: CoordinatesInput!) {\n    getGooglePreviewLocation(coordinates: $coordinates) {\n      google_place_id\n      displayName\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      types\n      rating\n      num_ratings\n    }\n  }\n"): (typeof documents)["\n  query GetGooglePreviewLocation($coordinates: CoordinatesInput!) {\n    getGooglePreviewLocation(coordinates: $coordinates) {\n      google_place_id\n      displayName\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      types\n      rating\n      num_ratings\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOutingLocations($outingId: ID!) {\n    getOutingLocations(outingId: $outingId) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        google_photo_names\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n"): (typeof documents)["\n  query GetOutingLocations($outingId: ID!) {\n    getOutingLocations(outingId: $outingId) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        google_photo_names\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetManyOutingLocations($outingIds: [ID!]!) {\n    getManyOutingLocations(outingIds: $outingIds) {\n      outing_id\n      locations {\n        _id\n        user_id\n        outing_id\n        name\n        address\n        coordinates {\n          latitude\n          longitude\n        }\n        city\n        arrival_time\n        departure_time\n        info {\n          type\n          rating\n          num_ratings\n          price_level\n          image_urls\n          google_photo_names\n          tags\n        }\n        external_ids {\n          google_place_id\n          yelp_id\n          here_id\n        }\n        recommendation_id\n        nickname\n        notes\n        favorite\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetManyOutingLocations($outingIds: [ID!]!) {\n    getManyOutingLocations(outingIds: $outingIds) {\n      outing_id\n      locations {\n        _id\n        user_id\n        outing_id\n        name\n        address\n        coordinates {\n          latitude\n          longitude\n        }\n        city\n        arrival_time\n        departure_time\n        info {\n          type\n          rating\n          num_ratings\n          price_level\n          image_urls\n          google_photo_names\n          tags\n        }\n        external_ids {\n          google_place_id\n          yelp_id\n          here_id\n        }\n        recommendation_id\n        nickname\n        notes\n        favorite\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DepartLocation($locationId: ID!) {\n    endLocationStay(locationId: $locationId) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n"): (typeof documents)["\n  mutation DepartLocation($locationId: ID!) {\n    endLocationStay(locationId: $locationId) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLocationFromPoint($coordinates: CoordinatesInput!) {\n    createLocationFromPoint(coordinates: $coordinates) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLocationFromPoint($coordinates: CoordinatesInput!) {\n    createLocationFromPoint(coordinates: $coordinates) {\n      _id\n      user_id\n      outing_id\n      name\n      address\n      coordinates {\n        latitude\n        longitude\n      }\n      city\n      arrival_time\n      departure_time\n      info {\n        type\n        rating\n        num_ratings\n        price_level\n        image_urls\n        tags\n      }\n      external_ids {\n        google_place_id\n        yelp_id\n        here_id\n      }\n      recommendation_id\n      nickname\n      notes\n      favorite\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetActiveOuting {\n    getActiveOuting {\n      _id\n      name\n      start_date\n      end_date\n      status\n      linked_outing_id\n    }\n  }\n"): (typeof documents)["\n  query GetActiveOuting {\n    getActiveOuting {\n      _id\n      name\n      start_date\n      end_date\n      status\n      linked_outing_id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOutings($includeAdditionalInfo: Boolean, $status: [String!]) {\n    getOutings(includeAdditionalInfo: $includeAdditionalInfo, status: $status) {\n      _id\n      user_id\n      name\n      status\n      start_date\n      end_date\n      linked_outing_id\n      favorite\n      automatically_ended\n      num_locations\n      num_participants\n      images\n      city\n    }\n  }\n"): (typeof documents)["\n  query GetOutings($includeAdditionalInfo: Boolean, $status: [String!]) {\n    getOutings(includeAdditionalInfo: $includeAdditionalInfo, status: $status) {\n      _id\n      user_id\n      name\n      status\n      start_date\n      end_date\n      linked_outing_id\n      favorite\n      automatically_ended\n      num_locations\n      num_participants\n      images\n      city\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartOuting($coordinates: CoordinatesInput) {\n    startOuting(coordinates: $coordinates) {\n      outing {\n        _id\n        name\n        start_date\n        end_date\n        status\n        linked_outing_id\n      }\n      location {\n        _id\n        user_id\n        outing_id\n        name\n        address\n        coordinates {\n          latitude\n          longitude\n        }\n        city\n        arrival_time\n        departure_time\n        info {\n          type\n          rating\n          num_ratings\n          price_level\n          image_urls\n          google_photo_names\n          tags\n        }\n        external_ids {\n          google_place_id\n          yelp_id\n          here_id\n        }\n        recommendation_id\n        nickname\n        notes\n        favorite\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation StartOuting($coordinates: CoordinatesInput) {\n    startOuting(coordinates: $coordinates) {\n      outing {\n        _id\n        name\n        start_date\n        end_date\n        status\n        linked_outing_id\n      }\n      location {\n        _id\n        user_id\n        outing_id\n        name\n        address\n        coordinates {\n          latitude\n          longitude\n        }\n        city\n        arrival_time\n        departure_time\n        info {\n          type\n          rating\n          num_ratings\n          price_level\n          image_urls\n          google_photo_names\n          tags\n        }\n        external_ids {\n          google_place_id\n          yelp_id\n          here_id\n        }\n        recommendation_id\n        nickname\n        notes\n        favorite\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EndOuting {\n    endOuting {\n      _id\n      name\n      start_date\n      end_date\n      status\n      linked_outing_id\n    }\n  }\n"): (typeof documents)["\n  mutation EndOuting {\n    endOuting {\n      _id\n      name\n      start_date\n      end_date\n      status\n      linked_outing_id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOutingPaths($outingIds: [ID!]!) {\n    getOutingPaths(outing_ids: $outingIds) {\n      outing_id\n      points {\n        _id\n        user_id\n        coordinates {\n          latitude\n          longitude\n        }\n        outing_id\n        time\n        linked_outing_id\n        location_id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOutingPaths($outingIds: [ID!]!) {\n    getOutingPaths(outing_ids: $outingIds) {\n      outing_id\n      points {\n        _id\n        user_id\n        coordinates {\n          latitude\n          longitude\n        }\n        outing_id\n        time\n        linked_outing_id\n        location_id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePath($points: [PathInput!]!) {\n    createPath(points: $points)\n  }\n"): (typeof documents)["\n  mutation CreatePath($points: [PathInput!]!) {\n    createPath(points: $points)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllUsers {\n    getAllUsers {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n"): (typeof documents)["\n  query GetAllUsers {\n    getAllUsers {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser {\n    getUser {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n"): (typeof documents)["\n  query GetUser {\n    getUser {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      _id\n      email\n      first_name\n      last_name\n      phone\n      home_address\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;