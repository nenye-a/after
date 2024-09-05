import { AfterMap, AfterText, Avatar, Divider } from '@/components/atoms';
import {
  MapSheetUserHeader,
  RecommendationsWithHeader,
  TabSelect,
} from '@/components/molecules';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { useTheme } from '@/theme';
import { View } from 'react-native';
import RecommendationDetailScreen from '../SheetScreens/Main/RecommendationDetailScreen';
import SheetHomeScreen from '../SheetScreens/Main/SheetHomeScreen';
import { useMapSheet } from '@/context/MapSheetContext';

let exampleDeepDetail = {
  name: 'Bareburger',
  type: 'Restaurant',
  rating: 4.5,
  numReviews: 1856,
  costLevel: 3,
  tags: ['Chill', 'Trending'],
  description:
    `Since ’09, our journey is more than food – it’s a tale ` +
    `of crafting the raddest, high-quality, organic, and eco-friendly burgers in town.`,
  images: [null, null, null],
};

function HomeScreen() {
  const { layout, gutters } = useTheme();
  const { mapSheetPage } = useMapSheet();

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
      <MapBottomSheet snapPoints={['5%', '25%', '50%', '70%', '90%']} index={2}>
        {mapSheetPage === 'Recommendation Detail' ? (
          <RecommendationDetailScreen {...exampleDeepDetail} />
        ) : (
          <SheetHomeScreen />
        )}
      </MapBottomSheet>
    </>
  );
}

export default HomeScreen;
