import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { Schema, Types, model } from 'mongoose';

interface User {
  // Personal information
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo_url: String;
  home_address: string;
  work_address: string;
  // Advanced user information
  date_of_birth: Date;
  culture: string; // TODO: Convert to enum, or reference to another model
  interests: string[]; // TODO: Convert to enum, or reference to another model
  // Preferences
  after_preferences: {
    default_vibe: string; // TODO: Convert to enum, or reference to another model.
    default_radius_miles: number;
    price_range: number;
  };
  app_preferences: {
    ui_theme: string; // TODO: Convert to enum, or reference to another model.
  };
  // Billing information & connection. TODO: determine the correct support for iOS and Android
  stripe_id: string;
  apple_id: string;
}

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  phone: String,
  home_address: String,
  work_address: String,
  date_of_birth: Date,
  culture: String,
  interests: [String],
  after_preferences: {
    default_vibe: String,
    default_radius_miles: Number,
    default_radius_in_minutes: Number,
    price_range: Number,
    ticket_price_limit: Number,
  },
  app_preferences: {
    ui_theme: String,
  },
  stripe_id: String,
  apple_id: String,
});

const users = coreDb.model<User>(MODEL_NAMES.user, userSchema);

export default users;

export { users, User };
