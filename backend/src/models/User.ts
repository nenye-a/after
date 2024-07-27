import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { Schema, Types, model } from 'mongoose';

interface User {
  email: string;
  name: string;
}

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  name: { type: String, required: true },
});

const users = coreDb.model<User>(MODEL_NAMES.user, userSchema);

export default users;

export { users, User };
