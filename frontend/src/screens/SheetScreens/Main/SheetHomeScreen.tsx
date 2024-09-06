import { View, Text } from 'react-native';
import React from 'react';
import {
  MapSheetUserHeader,
  PastOutings,
  RecommendationsWithHeader,
  TabSelect,
} from '@/components/molecules';
import { Divider } from '@/components/atoms';
import { useTheme } from '@/theme';
import { useMapSheet } from '@/context/MapSheetContext';
import { mapSheetSubComponentRoutes } from '@/router';
import { MapSheetPage } from '@/types/components/mapsheet';
import { TabProps } from '@/types/components/tabs';

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

const SheetHomeScreen = (props: Props) => {
  const { layout, gutters } = useTheme();
  const { mapSheetPage, setMapSheetPage, activeOuting } = useMapSheet();

  const tabOptions: TabProps[] = mapSheetSubComponentRoutes
    .filter((name) => name !== 'Active Outing')
    .map((name) => ({ text: name, onPress: () => setMapSheetPage(name) }));

  return (
    <View>
      {/* TODO: Componentize this as this will be in a page that users can navigate from. */}
      <MapSheetUserHeader />
      <TabSelect tabOptions={tabOptions} style={[gutters.marginVertical_15]} />
      <Divider />
      {/* {getMapSheetSubComponent(mapSheetPage)(mapSheetProps)} */}
      <View style={[gutters.paddingVertical_15]}>
        {mapSheetPage === 'Recommendations' ? (
          <RecommendationsWithHeader recommendations={recommendations} />
        ) : mapSheetPage === 'Past Outings' ? (
          <PastOutings />
        ) : null}
      </View>
    </View>
  );
};

export default SheetHomeScreen;
