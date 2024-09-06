import type {
  FlatListProps,
  ImageSourcePropType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type RecommendationInfoProps = {
  name: string;
  type: string;
  rating: number;
  numReviews: number;
  costLevel: number;
  tags: string[];
};

export type RecommendationListItemProps = {
  image?: ImageSourcePropType;
  name: string;
} & RecommendationInfoProps;

export type RecommendationsHeaderProps = ViewProps & {
  numRecommendations?: number;
};

export type RecommendationsListProps = Omit<
  FlatListProps<RecommendationListItemProps>,
  'renderItem'
>;

export type RecommendationsWithHeaderProps = ViewProps & {
  recommendations: RecommendationListItemProps[];
  headerStyle?: StyleProp<ViewStyle>;
};
