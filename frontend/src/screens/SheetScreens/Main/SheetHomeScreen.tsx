import { View, Text } from 'react-native';
import React from 'react';
import {
  MapSheetUserHeader,
  RecommendationsWithHeader,
  TabSelect,
} from '@/components/molecules';
import { Divider } from '@/components/atoms';
import { useTheme } from '@/theme';

type Props = {};

// TODO: Move this to a dedicated file containing routes.
const pageHeadings = [
  {
    text: 'Recommendations',
  },
  {
    text: 'Past Outings',
  },
  {
    text: 'Favorites',
  },
];

const recommendations = [
  {
    name: 'Bareburger',
    type: 'Restaurant',
    rating: 4.5,
    numReviews: 1856,
    costLevel: 3,
    tags: ['Chill', 'Trending'],
  },
  {
    name: "Max & Mina's Ice Cream",
    type: 'Restaurant',
    rating: 4.8,
    numReviews: 387,
    costLevel: 3,
    tags: ['Trending', 'Gen Z Approved'],
  },
  {
    name: 'Doha Bar & Lounge',
    type: 'Bar & Lounge',
    rating: 4.4,
    numReviews: 856,
    costLevel: 2,
    tags: ['Best In Class', 'Hip Hop'],
  },
];

const RecommendationsScreen = (props: Props) => {
  const { layout, gutters } = useTheme();

  return (
    <View>
      {/* TODO: Componentize this as this will be in a page that users can navigate from. */}
      <MapSheetUserHeader />
      <TabSelect
        tabOptions={pageHeadings}
        style={[gutters.marginVertical_15]}
      />
      <Divider />
      <RecommendationsWithHeader
        style={[gutters.paddingVertical_15]}
        recommendations={recommendations}
      />
    </View>
  );
};

export default RecommendationsScreen;
