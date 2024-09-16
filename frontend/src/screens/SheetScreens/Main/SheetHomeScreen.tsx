import { View, Text } from 'react-native';
import React from 'react';
import {
  ActiveOuting,
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
import { useOuting } from '@/context/OutingContext';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';

const recommendations = [
  {
    name: 'Bareburger',
    type: 'Restaurant',
    rating: 4.5,
    numReviews: 1856,
    costLevel: 3,
    tags: ['Chill', 'Trending'],
    durationString: 'Here since 9:30PM',
  },
  {
    name: "Max & Mina's Ice Cream",
    type: 'Restaurant',
    rating: 4.8,
    numReviews: 387,
    costLevel: 3,
    tags: ['Trending', 'Gen Z Approved'],
    durationString: '7:50PM - 8:55PM (1h 5m)',
  },
  {
    name: 'Doha Bar & Lounge',
    type: 'Bar & Lounge',
    rating: 4.4,
    numReviews: 856,
    costLevel: 2,
    tags: ['Best In Class', 'Hip Hop'],
    durationString: '6:35PM - 7:30PM (55m)',
  },
];

const SheetHomeScreen = () => {
  const { layout, gutters } = useTheme();
  const { activeOuting, activeOutingLocations } = useOuting();
  const { mapSheetPage, setMapSheetPage } = useMapSheet();

  const tabOptions: TabProps[] = mapSheetSubComponentRoutes
    .filter((name) => activeOuting || name !== 'Active Outing')
    .map((name) => ({
      text: name,
      border: name === 'Active Outing',
      icon: name === 'Active Outing' ? 'burst' : undefined,
      onPress: () => setMapSheetPage(name),
    }));

  return (
    <>
      <BottomSheetView focusHook={useFocusEffect}>
        <MapSheetUserHeader />
        <TabSelect
          tabOptions={tabOptions}
          activeTab={mapSheetPage}
          style={[gutters.marginVertical_15]}
        />
      </BottomSheetView>
      <Divider style={[gutters.marginBottom_15]} />
      {/* <View style={[gutters.paddingVertical_15]}> */}
      <>
        {mapSheetPage === 'Active Outing' ? (
          <ActiveOuting />
        ) : mapSheetPage === 'Recommendations' ? (
          <RecommendationsWithHeader recommendations={recommendations} />
        ) : mapSheetPage === 'Past Outings' ? (
          <PastOutings />
        ) : null}
      </>
      {/* </View> */}
    </>
  );
};

export default SheetHomeScreen;
