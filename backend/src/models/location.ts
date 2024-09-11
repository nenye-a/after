import mongoose, { Model, Schema } from 'mongoose';
import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { Coordinates } from '../types/location';
import { PriceLevel } from '../engine/types';
import {
  convertGooglePriceLevel,
  findCityFromGoogleAddressComponents,
} from '../helpers/locations';

export type Location = {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  outing_id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  coordinates: Coordinates;
  city?: string;
  start_time: Date;
  end_time?: Date;
  info: {
    type?: string; // Convert to enum.
    rating?: number;
    num_ratings?: number;
    price_level?: PriceLevel; // TODO: Centralize price level.
    image_urls?: string[];
    tags?: string[];
  };
  external_ids: {
    google_place_id?: string;
    yelp_id?: string;
    here_id?: string;
  };
  recommendation_id?: mongoose.Types.ObjectId;
  nickname?: string;
  notes?: string;
  favorite?: boolean;
};

interface LocationModel extends Model<Location> {
  fromGoogleTextSearchPlace: (
    place: any,
    userId: mongoose.Types.ObjectId,
    outingId: mongoose.Types.ObjectId,
  ) => Location;
}

const locationSchema = new Schema<Location, LocationModel>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.user,
      index: true,
    },
    outing_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.outings,
      index: true,
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    city: String,
    start_time: { type: Date, required: true, default: Date.now },
    end_time: Date,
    info: {
      type: { type: String },
      rating: Number,
      num_ratings: Number,
      price_level: String,
      image_urls: [String],
      tags: [String],
    },
    external_ids: {
      google_place_id: String,
      yelp_id: String,
      here_id: String,
    },
    recommendation_id: mongoose.Schema.Types.ObjectId,
    nickname: String,
    notes: String,
    favorite: Boolean,
  },
  {
    statics: {
      fromGoogleTextSearchPlace: function (
        place: any,
        userId: mongoose.Types.ObjectId,
        outingId: mongoose.Types.ObjectId,
      ) {
        console.log({
          type: place.types[0],
          rating: place.rating,
          num_ratings: place.userRatingCount,
          price_level: convertGooglePriceLevel(place.priceLevel),
          // image_urls: place.photos?.map((photo) => photo.photo_reference),
          tags: place.types,
        });
        let formattedLocation: Location = new locations({
          user_id: userId,
          outing_id: outingId,
          name: place.displayName.text,
          address: place.formattedAddress,
          coordinates: place.location,
          city: findCityFromGoogleAddressComponents(place.addressComponents),
          info: {
            type: place.types[0],
            rating: place.rating,
            num_ratings: place.userRatingCount,
            price_level: convertGooglePriceLevel(place.priceLevel),
            image_urls: place.photos?.map(
              (photo: { name: string }) => photo.name,
            ),
            tags: place.types,
          },
          external_ids: {
            google_place_id: place.name,
          },
        });
        return formattedLocation;
      },
    },
  },
);

const locations = coreDb.model<Location, LocationModel>(
  MODEL_NAMES.locations,
  locationSchema,
);

export default locations;
