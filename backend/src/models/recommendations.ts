import mongoose, { modelNames, Schema } from 'mongoose';
import { PriceLevel, RecommendationsInput } from '../engine/types';
import { MODEL_NAMES } from '../constants/models';

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
  coordinates?: {
    latitude: number;
    longitude: number;
  };
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

export type RecommendationTransaction = {
  user_id: string;
  request_date: Date;
  trip_id?: Date;
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

export const recommendationTransactionSchema =
  new Schema<RecommendationTransaction>({
    user_id: { type: String, required: true, ref: MODEL_NAMES.user },
    request_date: { type: Date, required: true, default: Date.now },
    trip_id: { type: mongoose.Types.ObjectId, ref: MODEL_NAMES.trip },
    status: {
      type: String,
      required: true,
      default: 'recommendations_requested',
    },
    status_detail: [
      {
        status: { type: String, required: true },
        feedback: String,
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

const recommendationTransactions = mongoose.model<RecommendationTransaction>(
  MODEL_NAMES.recommendationTransaction,
  recommendationTransactionSchema,
);

export default recommendationTransactions;
