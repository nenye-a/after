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
  // Perferences
  after_preferences: {};
}

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  phone: String,
  home_address: String,
});

const users = coreDb.model<User>(MODEL_NAMES.user, userSchema);

export default users;

export { users, User };
