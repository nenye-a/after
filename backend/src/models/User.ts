import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { Schema, Types, model } from 'mongoose';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  homeAddress: string;
}

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  phone: String,
  homeAddress: String,
});

const users = coreDb.model<User>(MODEL_NAMES.user, userSchema);

export default users;

export { users, User };
