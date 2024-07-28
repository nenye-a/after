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
  ethnicity: string; // TODO: Convert to enum, or reference to another model
  interests: string[]; // TODO: Convert to enum, or reference to another model
  // Preferences
  after_preferences: {
    default_mood: string; // TODO: Convert to enum, or reference to another model.
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
  ethnicity: String,
  interests: [String],
  after_preferences: {
    default_mood: String,
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
