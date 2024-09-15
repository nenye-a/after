import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import mongoose, { Model, Schema, Types } from 'mongoose';
import { User } from './user';

export type Session = {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  token: string;
  time: Date;
};

interface SessionModel extends Model<Session> {
  createSession: (
    token: string,
    user_id: mongoose.Types.ObjectId | undefined | null,
  ) => Promise<Session>;
  findSession: (token: string) => Promise<Session | null>;
}

export const sessionModel = new Schema<Session, SessionModel>(
  {
    token: { type: String, required: true, unique: true },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: MODEL_NAMES.users,
    },
    time: { type: Date, required: true, default: Date.now },
  },
  {
    statics: {
      createSession: (
        token: string,
        user_id: mongoose.Types.ObjectId | undefined | null,
      ) => sessions.create({ token, user_id }),
      findSession: (token: string) => sessions.findOne({ token }),
    },
  },
);

const sessions = coreDb.model<Session, SessionModel>(
  MODEL_NAMES.sessions,
  sessionModel,
);

export default sessions;
