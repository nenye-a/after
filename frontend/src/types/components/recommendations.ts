import type {
  FlatListProps,
  ImageSourcePropType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import type { LocationInfoProps } from './location';

export type RecommendationListItemProps = {
  image?: ImageSourcePropType;
} & LocationInfoProps;

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
