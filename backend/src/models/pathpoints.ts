import mongoose, { Schema } from 'mongoose';
import { coreDb, MODEL_NAMES } from '../config/mongoose.db';
import { Coordinates } from '../types/location';

type PathPoint = {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  coordinates: Coordinates;
  outing_id: mongoose.Types.ObjectId;
  time: Date;
  linked_outing_id?: mongoose.Types.ObjectId;
  location_id?: mongoose.Types.ObjectId;
};

export const pathPointSchema = new Schema<PathPoint>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: MODEL_NAMES.user,
    index: true,
  },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  outing_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: MODEL_NAMES.outings,
    index: true,
  },
  time: { type: Date, required: true },
  linked_outing_id: mongoose.Schema.Types.ObjectId,
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL_NAMES.locations,
  },
});

const pathPoints = coreDb.model<PathPoint>(
  MODEL_NAMES.pathPoints,
  pathPointSchema,
);

export default pathPoints;
