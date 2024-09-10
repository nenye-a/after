import mongoose, { Schema } from 'mongoose';
import { PriceLevel, RecommendationsInput } from '../engine/types';
import { MODEL_NAMES } from '../constants/models';
import { coreDb } from '../config/mongoose.db';
import { Coordinates } from '../types/location';

export type RecommendationStatus =
  | 'requested' // The user has requested recommendations.
  | 'failed' // The recommendation engine failed to provide recommendations.
  | 'active' // The recommendation engine has provided recommendations.
  | 'stale'; // The user has chosen a recommendation.

export type RecommendationFeedback =
  | 'bad_recommendations'
  | 'good_recommendations';

export type Recommendation = {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: string;
  phone: string;
  maps_url: string;
  address: string;
  coordinates?: Coordinates;
  website_url: string;
  price_level?: PriceLevel;
  rating: number;
  number_ratings: number;
  open_hours: {
    open: string;
    close: string;
  };
  description: string;
  photo_urls?: string[];
  distance?: number;
  travel_time?: number;
  website: string;
  raw_place: any;
};

export type RecommendationRequest = {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  request_date: Date;
  outing_id?: mongoose.Types.ObjectId;
  status: RecommendationStatus;
  status_detail: [
    {
      status: RecommendationStatus;
      feedback?: RecommendationFeedback;
      date: Date;
    },
  ];
  recommendation_model: string; // Which recommendation model was used. TODO: Use enum.
  params: RecommendationsInput;
  recommendations?: Recommendation[]; // The first recommendation is the most important.
  chosen_recommendation?: mongoose.Types.ObjectId; // The user's chosen recommendation id.
  performance_context?: {
    recommendation_time_ms: number;
    recommendation_count: number;
  };
};

export const recommendationRequestSchema = new Schema<RecommendationRequest>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: MODEL_NAMES.user,
  },
  request_date: { type: Date, required: true, default: Date.now },
  outing_id: { type: mongoose.Types.ObjectId, ref: MODEL_NAMES.outings },
  status: {
    type: String,
    required: true,
    default: 'requested',
    enum: ['requested', 'failed', 'active', 'stale'],
  },
  status_detail: [
    {
      _id: false,
      status: {
        type: String,
        required: true,
        enum: ['requested', 'failed', 'active', 'stale'],
      },
      feedback: {
        type: String,
        enum: ['bad_recommendations', 'good_recommendations', null],
      },
      date: { type: Date, required: true, default: Date.now },
    },
  ],
  recommendation_model: { type: String, required: true },
  params: { type: Object, required: true },
  recommendations: [Object],
  chosen_recommendation: Object,
  performance_context: {
    recommendation_time_ms: Number,
    recommendation_count: Number,
  },
});

const recommendationRequests = coreDb.model<RecommendationRequest>(
  MODEL_NAMES.recommendationRequests,
  recommendationRequestSchema,
);

export default recommendationRequests;
