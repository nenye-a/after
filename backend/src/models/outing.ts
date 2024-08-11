import mongoose, { Schema } from 'mongoose';
import { coreDb, MODEL_NAMES } from '../config/mongoose.db';

export type Outing = {
  user_id: mongoose.Types.ObjectId;
  start_date: Date;
  end_date: Date;
  name: string;
  path: [
    {
      latitude: number;
      longitude: number;
      timestamp: Date;
      duration_ms?: number;
      address?: string;
      name?: string;
      place_id?: string; // Google Maps place ID TODO: make after place id.
      starred?: boolean;
    },
  ];
  automatically_ended?: boolean;
  favorite?: boolean;
};

export const outingSchema = new Schema<Outing>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: MODEL_NAMES.user,
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  name: { type: String, required: true },
  path: [
    {
      latitude: Number,
      longitude: Number,
      timestamp: Date,
      duration_ms: Number,
      address: String,
      name: String,
      place_id: String,
      starred: Boolean,
    },
  ],
  automatically_ended: { type: Boolean },
  favorite: { type: Boolean },
});

const outings = coreDb.model<Outing>(MODEL_NAMES.outing, outingSchema);

export default outings;
