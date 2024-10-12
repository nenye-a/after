import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import mongoose, { Model, Schema } from 'mongoose';

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

export const sessionSchema = new Schema<Session, SessionModel>(
  {
    token: { type: String, required: true, unique: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.users,
    },
    time: { type: Date, required: true, default: Date.now },
  },
  {
    statics: {
      createSession: function (
        token: string,
        user_id: mongoose.Types.ObjectId | undefined | null,
      ) {
        return this.create({ token, user_id });
      },
      findSession: function (token: string) {
        return this.findOne({ token });
      },
    },
  },
);

const sessions = coreDb.model<Session, SessionModel>(
  MODEL_NAMES.sessions,
  sessionSchema,
);

export default sessions;
