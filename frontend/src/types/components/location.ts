export type LocationInfoProps = {
  name: string;
  type: string;
  rating?: number | null;
  numReviews?: number | null;
  costLevel?: number | null;
  tags?: string[];
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export enum SameLocationDistanceCutoffMeters {
  HIGH_CONFIDENCE = 7, // Roughly hypotnuse of 5x5 square meters (likely still in a small shop)
  MEDIUM_CONFIDENCE = 14, // Roughly hypotnuse of 10x10 square meters area
  LOW_CONFIDENCE = 28, // Roughly hypotnuse of 20x20 square meters area
  VERY_LOW_CONFIDENCE = 56, // Roughly hypotnuse of 40x40 square meters area
  NO_CONFIDENCE = 112, // Roughly hypotnuse of 80x80 square meters area
}
