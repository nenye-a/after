import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { Schema, Types, model } from 'mongoose';
import { PriceLevel, Vibe } from '../engine/types';

export type User = {
  // Personal information
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo_url: String;
  home_address: string;
  // Advanced user information
  date_of_birth: Date;
  culture: string;
  interests: string[];
  // Preferences
  after_preferences: {
    default_vibes: Vibe[];
    default_radius_miles: number;
    preferred_price_levels: PriceLevel[];
    max_ticket_price: number;
  };
  // Billing information & connection. TODO: determine the correct support for iOS and Android
  stripe_id: string;
  apple_id: string;
};

export const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  phone: String,
  home_address: String,
  date_of_birth: Date,
  culture: String,
  interests: [String],
  after_preferences: {
    default_vibes: [String],
    default_radius_miles: Number,
    default_radius_in_minutes: Number,
    preferred_price_levels: [String],
    max_ticket_price: Number,
  },
  stripe_id: String,
  apple_id: String,
});

const users = coreDb.model<User>(MODEL_NAMES.user, userSchema);

export default users;
