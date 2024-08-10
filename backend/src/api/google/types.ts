export type GooglePlacesIdField =
  | 'id'
  | 'name'
  | 'attributions'
  | 'nextPageToken';

export type GooglePlacesBasicField =
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

export type GooglePlacesAdvancedField =
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

export type GooglePlacesPreferredField =
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

export type GooglePlaceField =
  | '*'
  | GooglePlacesIdField
  | GooglePlacesBasicField
  | GooglePlacesAdvancedField
  | GooglePlacesPreferredField;

export type GooglePlaceAutomotiveType =
  | 'car_dealer'
  | 'car_rental'
  | 'car_repair'
  | 'car_wash'
  | 'electric_vehicle_charging_station'
  | 'gas_station'
  | 'parking'
  | 'rest_stop';

export type GooglePlaceBusinessType = 'farm';

export type GooglePlaceCultureType =
  | 'art_gallery'
  | 'museum'
  | 'performing_arts_theater';

export type GooglePlaceEducationType =
  | 'library'
  | 'preschool'
  | 'primary_school'
  | 'school'
  | 'secondary_school'
  | 'university';

export type GooglePlaceEntertainmentType =
  | 'amusement_center'
  | 'amusement_park'
  | 'aquarium'
  | 'banquet_hall'
  | 'bowling_alley'
  | 'casino'
  | 'community_center'
  | 'convention_center'
  | 'cultural_center'
  | 'dog_park'
  | 'event_venue'
  | 'hiking_area'
  | 'historical_landmark'
  | 'marina'
  | 'movie_rental'
  | 'movie_theater'
  | 'national_park'
  | 'night_club'
  | 'park'
  | 'tourist_attraction'
  | 'visitor_center'
  | 'wedding_venue'
  | 'zoo';

export type GooglePlaceFinanceType = 'accounting' | 'atm' | 'bank';

export type GooglePlaceFoodDrinkType =
  | 'american_restaurant'
  | 'bakery'
  | 'bar'
  | 'barbecue_restaurant'
  | 'brazilian_restaurant'
  | 'breakfast_restaurant'
  | 'brunch_restaurant'
  | 'cafe'
  | 'chinese_restaurant'
  | 'coffee_shop'
  | 'fast_food_restaurant'
  | 'french_restaurant'
  | 'greek_restaurant'
  | 'hamburger_restaurant'
  | 'ice_cream_shop'
  | 'indian_restaurant'
  | 'indonesian_restaurant'
  | 'italian_restaurant'
  | 'japanese_restaurant'
  | 'korean_restaurant'
  | 'lebanese_restaurant'
  | 'meal_delivery'
  | 'meal_takeaway'
  | 'mediterranean_restaurant'
  | 'mexican_restaurant'
  | 'middle_eastern_restaurant'
  | 'pizza_restaurant'
  | 'ramen_restaurant'
  | 'restaurant'
  | 'sandwich_shop'
  | 'seafood_restaurant'
  | 'spanish_restaurant'
  | 'steak_house'
  | 'sushi_restaurant'
  | 'thai_restaurant'
  | 'turkish_restaurant'
  | 'vegan_restaurant'
  | 'vegetarian_restaurant'
  | 'vietnamese_restaurant';

export type GooglePlaceGeographicalAreaType =
  | 'administrative_area_level_1'
  | 'administrative_area_level_2'
  | 'country'
  | 'locality'
  | 'postal_code'
  | 'school_district';

export type GooglePlaceGovernmentType =
  | 'city_hall'
  | 'courthouse'
  | 'embassy'
  | 'fire_station'
  | 'local_government_office'
  | 'police'
  | 'post_office';

export type GooglePlaceHealthWellnessType =
  | 'dental_clinic'
  | 'dentist'
  | 'doctor'
  | 'drugstore'
  | 'hospital'
  | 'medical_lab'
  | 'pharmacy'
  | 'physiotherapist'
  | 'spa';

export type GooglePlaceLodgingType =
  | 'bed_and_breakfast'
  | 'campground'
  | 'camping_cabin'
  | 'cottage'
  | 'extended_stay_hotel'
  | 'farmstay'
  | 'guest_house'
  | 'hostel'
  | 'hotel'
  | 'lodging'
  | 'motel'
  | 'private_guest_room'
  | 'resort_hotel'
  | 'rv_park';

export type GooglePlacePlacesOfWorshipType =
  | 'church'
  | 'hindu_temple'
  | 'mosque'
  | 'synagogue';

export type GooglePlaceServicesType =
  | 'barber_shop'
  | 'beauty_salon'
  | 'cemetery'
  | 'child_care_agency'
  | 'consultant'
  | 'courier_service'
  | 'electrician'
  | 'florist'
  | 'funeral_home'
  | 'hair_care'
  | 'hair_salon'
  | 'insurance_agency'
  | 'laundry'
  | 'lawyer'
  | 'locksmith'
  | 'moving_company'
  | 'painter'
  | 'plumber'
  | 'real_estate_agency'
  | 'roofing_contractor'
  | 'storage'
  | 'tailor'
  | 'telecommunications_service_provider'
  | 'travel_agency'
  | 'veterinary_care';

export type GooglePlaceShoppingType =
  | 'auto_parts_store'
  | 'bicycle_store'
  | 'book_store'
  | 'cell_phone_store'
  | 'clothing_store'
  | 'convenience_store'
  | 'department_store'
  | 'discount_store'
  | 'electronics_store'
  | 'furniture_store'
  | 'gift_shop'
  | 'grocery_store'
  | 'hardware_store'
  | 'home_goods_store'
  | 'home_improvement_store'
  | 'jewelry_store'
  | 'liquor_store'
  | 'market'
  | 'pet_store'
  | 'shoe_store'
  | 'shopping_mall'
  | 'sporting_goods_store'
  | 'store'
  | 'supermarket'
  | 'wholesaler';

export type GooglePlaceSportsType =
  | 'athletic_field'
  | 'fitness_center'
  | 'golf_course'
  | 'gym'
  | 'playground'
  | 'ski_resort'
  | 'sports_club'
  | 'sports_complex'
  | 'stadium'
  | 'swimming_pool';

export type GooglePlaceTransportationType =
  | 'airport'
  | 'bus_station'
  | 'bus_stop'
  | 'ferry_terminal'
  | 'heliport'
  | 'light_rail_station'
  | 'park_and_ride'
  | 'subway_station'
  | 'taxi_stand'
  | 'train_station'
  | 'transit_depot'
  | 'transit_station'
  | 'truck_stop';

export type GooglePlaceType =
  | GooglePlaceAutomotiveType
  | GooglePlaceBusinessType
  | GooglePlaceCultureType
  | GooglePlaceEducationType
  | GooglePlaceEntertainmentType
  | GooglePlaceFinanceType
  | GooglePlaceFoodDrinkType
  | GooglePlaceGeographicalAreaType
  | GooglePlaceGovernmentType
  | GooglePlaceHealthWellnessType
  | GooglePlaceLodgingType
  | GooglePlacePlacesOfWorshipType
  | GooglePlaceServicesType
  | GooglePlaceShoppingType
  | GooglePlaceSportsType
  | GooglePlaceTransportationType;

export type GoogleLocationPoint = {
  latitude: number;
  longitude: number;
};

export type GoogleLocationCircle = {
  circle: { center: GoogleLocationPoint; radius: number };
};

export type GoogleLocationRectangle = {
  rectangle: {
    low: GoogleLocationPoint;
    high: GoogleLocationPoint;
  };
};

export type GooglePriceLevel =
  | 'PRICE_LEVEL_UNSPECIFIED'
  | 'PRICE_LEVEL_FREE'
  | 'PRICE_LEVEL_INEXPENSIVE'
  | 'PRICE_LEVEL_MODERATE'
  | 'PRICE_LEVEL_EXPENSIVE'
  | 'PRICE_LEVEL_VERY_EXPENSIVE';

export interface GoogleSearchParams {
  includedType?: GooglePlaceType;
  strictTypeFiltering?: boolean;
  locationBias?: GoogleLocationCircle | GoogleLocationRectangle;
  locationRestriction?: GoogleLocationRectangle;
  minRating?: number;
  openNow?: boolean;
  pageSize?: number;
  pageToken?: string;
  priceLevels?: GooglePriceLevel[];
  rankPreference?: 'RELEVANCE' | 'DISTANCE';
}

export interface GoogleSearchResult {
  places: any[];
  contextualContents: any[];
}

export type GooglePlaceDetailsIDField =
  | 'attributions'
  | 'id'
  | 'name'
  | 'photos';

export type GooglePlaceDetailsLocationField =
  | 'addressComponents'
  | 'adrFormatAddress'
  | 'formattedAddress'
  | 'location'
  | 'plusCode'
  | 'shortFormattedAddress'
  | 'types'
  | 'viewport';

export type GooglePlaceDetailsBasicField =
  | 'accessibilityOptions'
  | 'businessStatus'
  | 'displayName'
  | 'googleMapsUri'
  | 'iconBackgroundColor'
  | 'iconMaskBaseUri'
  | 'primaryType'
  | 'primaryTypeDisplayName'
  | 'subDestinations'
  | 'utcOffsetMinutes';

export type GooglePlaceDetailsAdvancedField =
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

export type GooglePlaceDetailsPreferredField =
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

export type GooglePlaceDetailsField =
  | '*'
  | GooglePlaceDetailsIDField
  | GooglePlaceDetailsLocationField
  | GooglePlaceDetailsBasicField
  | GooglePlaceDetailsAdvancedField
  | GooglePlaceDetailsPreferredField;
