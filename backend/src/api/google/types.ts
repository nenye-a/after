export type GooglePlacesIdFields =
  | 'id'
  | 'name'
  | 'attributions'
  | 'nextPageToken';

export type GooglePlacesBasicFields =
  | 'accessibilityOptions'
  | 'addressComponents'
  | 'adrFormatAddress'
  | 'businessStatus'
  | 'displayName'
  | 'formattedAddress'
  | 'googleMapsUri'
  | 'iconBackgroundColor'
  | 'iconMaskBaseUri'
  | 'location'
  | 'photos'
  | 'plusCode'
  | 'primaryType'
  | 'primaryTypeDisplayName'
  | 'shortFormattedAddress'
  | 'subDestinations'
  | 'types'
  | 'utcOffsetMinutes'
  | 'viewport';

export type GooglePlacesAdvancedFields =
  | 'currentOpeningHours'
  | 'currentSecondaryOpeningHours'
  | 'internationalPhoneNumber'
  | 'nationalPhoneNumber'
  | 'priceLevel'
  | 'rating'
  | 'regularOpeningHours'
  | 'regularSecondaryOpeningHours'
  | 'userRatingCount'
  | 'websiteUri';

export type GooglePlacesPreferredFields =
  | 'allowsDogs'
  | 'curbsidePickup'
  | 'delivery'
  | 'dineIn'
  | 'editorialSummary'
  | 'evChargeOptions'
  | 'fuelOptions'
  | 'goodForChildren'
  | 'goodForGroups'
  | 'goodForWatchingSports'
  | 'liveMusic'
  | 'menuForChildren'
  | 'parkingOptions'
  | 'paymentOptions'
  | 'outdoorSeating'
  | 'reservable'
  | 'restroom'
  | 'reviews'
  | 'servesBeer'
  | 'servesBreakfast'
  | 'servesBrunch'
  | 'servesCocktails'
  | 'servesCoffee'
  | 'servesDessert'
  | 'servesDinner'
  | 'servesLunch'
  | 'servesVegetarianFood'
  | 'servesWine'
  | 'takeout';

export type GooglePlaceFields =
  | '*'
  | GooglePlacesIdFields
  | GooglePlacesBasicFields
  | GooglePlacesAdvancedFields
  | GooglePlacesPreferredFields;

export interface GoogleSearchParams {
  fields: GooglePlaceFields[];
}

export interface GoogleSearchResult {
  places: any[];
  contextualContents: any[];
}
