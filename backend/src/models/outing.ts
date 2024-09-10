import mongoose, { Schema } from 'mongoose';
import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { OutingStatus } from '../types/outing';

type Outing = {
  user_id: mongoose.Types.ObjectId;
  name: string;
  status: OutingStatus;
  start_date: Date;
  end_date?: Date;
  linked_outing_id?: mongoose.Types.ObjectId;
  favorite?: boolean;
  automatically_ended?: boolean;
};

export const outingSchema = new Schema<Outing>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: MODEL_NAMES.user,
    index: true,
  },
  name: { type: String, required: true },
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'paused', 'ended'],
  },
  start_date: { type: Date, required: true, default: Date.now },
  end_date: Date,
  linked_outing_id: mongoose.Schema.Types.ObjectId,
  favorite: Boolean,
  automatically_ended: Boolean,
});

outingSchema.index({
  user_id: 1,
  start_date: -1,
});

outingSchema.index(
  {
    user_id: 1,
  },
  {
    // Can only have one active outing at a time per user.
    unique: true,
    partialFilterExpression: {
      status: 'active',
    },
  },
);

const outings = coreDb.model<Outing>(MODEL_NAMES.outings, outingSchema);

export default outings;
