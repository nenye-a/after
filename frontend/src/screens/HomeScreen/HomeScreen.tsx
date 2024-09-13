import { AfterMap } from '@/components/atoms';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { useTheme } from '@/theme';
import { View } from 'react-native';
import RecommendationDetailScreen from '../SheetScreens/Main/RecommendationDetailScreen';
import SheetHomeScreen from '../SheetScreens/Main/SheetHomeScreen';
import { useMapSheet } from '@/context/MapSheetContext';
import OutingDetailScreen from '../SheetScreens/Main/OutingDetailScreen';
import LocationStatusBar from '@/components/molecules/LocationStatusBar/LocationStatusBar';
import { useOuting } from '@/context/OutingContext';

const exampleDeepDetail = {
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

const exampleCurrentLocation = 'Doha Bar & Lounge';
const exampleDurationsTring = 'Started at 6:35PM';

function HomeScreen() {
  const { layout, gutters } = useTheme();
  const { mapSheetPage } = useMapSheet();

  return (
    <>
      <AfterMap />
      <SafeScreen style={[layout.itemsCenter]}>
        <View style={[{ width: '100%' }]}>
          <LocationStatusBar
            currentLocation={exampleCurrentLocation}
            durationString={exampleDurationsTring}
            style={[]}
          />
        </View>
      </SafeScreen>
      <MapBottomSheet snapPoints={['5%', '25%', '50%', '70%', '90%']} index={1}>
        {mapSheetPage === 'Recommendation Detail' ? (
          <RecommendationDetailScreen {...exampleDeepDetail} />
        ) : mapSheetPage === 'Outing Detail' ? (
          <OutingDetailScreen />
        ) : (
          <SheetHomeScreen />
        )}
      </MapBottomSheet>
    </>
  );
}

export default HomeScreen;
