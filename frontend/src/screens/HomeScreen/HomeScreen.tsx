import { AfterMap, AfterText, Avatar, Divider } from '@/components/atoms';
import {
  MapSheetUserHeader,
  RecommendationsWithHeader,
  TabSelect,
} from '@/components/molecules';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { useTheme } from '@/theme';
import { View } from 'react-native';

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

function HomeScreen() {
  const { layout, gutters } = useTheme();

  return (
    <>
      <AfterMap />
      <SafeScreen>
        <View
          style={[
            layout.flex_1,
            layout.col,
            layout.itemsCenter,
            layout.justifyCenter,
          ]}
        ></View>
      </SafeScreen>
      <MapBottomSheet snapPoints={['5%', '25%', '50%', '90%']} index={2}>
        {/* TODO: Componentize this as this will be in a page that users can navigate from. */}
        <MapSheetUserHeader />
        <TabSelect
          tabOptions={pageHeadings}
          style={[gutters.marginVertical_15]}
        />
        <Divider />
        <RecommendationsWithHeader recommendations={recommendations} />
      </MapBottomSheet>
    </>
  );
}

export default HomeScreen;
