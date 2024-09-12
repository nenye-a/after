import mongoose, { Model, Schema } from 'mongoose';
import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { Coordinates } from '../types/location';
import { PriceLevel } from '../engine/types';

export type Location = {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  outing_id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  coordinates: Coordinates;
  city?: string;
  start_time: Date; // TODO: Change to arrival & departure time.
  end_time?: Date;
  info: {
    type?: string; // Convert to enum.
    rating?: number;
    num_ratings?: number;
    price_level?: PriceLevel; // TODO: Centralize price level.
    image_urls?: string[];
    google_photo_names?: string[];
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

interface LocationModel extends Model<Location> {}

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
      google_photo_names: [String],
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
    statics: {},
  },
);

const locations = coreDb.model<Location, LocationModel>(
  MODEL_NAMES.locations,
  locationSchema,
);

export default locations;
