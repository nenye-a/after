import mongoose, { Schema } from 'mongoose';
import { PriceLevel, RecommendationsInput } from '../engine/types';
import { MODEL_NAMES } from '../constants/models';
import { coreDb } from '../config/mongoose.db';
import { Coordinates } from '../types/location';

export type RecommendationStatus =
  | 'recommendations_requested' // The user has requested recommendations.
  | 'recommendations_failed' // The recommendation engine failed to provide recommendations.
  | 'recommendations_provided' // The recommendation engine has provided recommendations.
  | 'recommendation_chosen' // The user has chosen a recommendation.
  | 'recommendation_rejected' // The user has rejected a recommendation.
  | 'feedback_provided'; // The user has provided feedback on recommendations

export type RecommendationFeedback =
  | 'bad_recommendations'
  | 'good_recommendations'
  | 'bad_chosen_recommendation'
  | 'good_chosen_recommendation'
  | 'good_chosen_recommendation';

export type Recommendation = {
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
  chosen_recommendation?: Recommendation;
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
    default: 'recommendations_requested',
    enum: [
      'recommendations_requested',
      'recommendations_failed',
      'recommendations_provided',
      'recommendation_chosen',
      'recommendation_rejected',
      'feedback_provided',
    ],
  },
  status_detail: [
    {
      status: {
        type: String,
        required: true,
        enum: [
          'recommendations_requested',
          'recommendations_failed',
          'recommendations_provided',
          'recommendation_chosen',
          'recommendation_rejected',
          'feedback_provided',
        ],
      },
      feedback: {
        type: String,
        enum: [
          'bad_recommendations',
          'good_recommendations',
          'bad_chosen_recommendation',
          'good_chosen_recommendation',
          'good_chosen_recommendation',
          null,
        ],
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
  MODEL_NAMES.recommendationTransaction,
  recommendationRequestSchema,
);

export default recommendationRequests;
