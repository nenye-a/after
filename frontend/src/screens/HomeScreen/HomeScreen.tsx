import { AfterMap } from '@/components/atoms';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { useTheme } from '@/theme';
import { ActivityIndicator, View } from 'react-native';
import RecommendationDetailScreen from '../SheetScreens/Main/RecommendationDetailScreen';
import SheetHomeScreen from '../SheetScreens/Main/SheetHomeScreen';
import { useMapSheet } from '@/context/MapSheetContext';
import OutingDetailScreen from '../SheetScreens/Main/OutingDetailScreen';
import LocationStatusBar from '@/components/molecules/LocationStatusBar/LocationStatusBar';
import { useOuting } from '@/context/OutingContext';
import NoOutingsScreen from '../SheetScreens/Main/NoOutingsScreen';
import { useUser } from '@/context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

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

const DEFAULT_SNAP_POINTS = ['12%', '30%', '50%', '70%', '90%'];
const INITIAL_SNAP_POINT = ['30%', '30%'];

function HomeScreen() {
  const { layout, backgrounds, colors } = useTheme();
  const { mapSheetPage } = useMapSheet();
  const { pastOutings, activeOuting, outingDataLoading } = useOuting();
  const { isAuthorized } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthorized) {
      navigation.navigate('LoginScreen');
    }
  }, [isAuthorized]);

  const noHistoricalOutings = !pastOutings?.length && !activeOuting;

  const LoadingIndicator = (
    <SafeScreen style={[layout.justifyCenter, layout.itemsCenter]}>
      <ActivityIndicator size="large" color={colors.white} />
    </SafeScreen>
  );

  if (outingDataLoading) {
    return LoadingIndicator;
  }

  const mapSheetProps = noHistoricalOutings
    ? {
        snapPoints: INITIAL_SNAP_POINT,
      }
    : {
        snapPoints: DEFAULT_SNAP_POINTS,
      };

  return (
    <>
      <AfterMap />
      <SafeScreen style={[layout.itemsCenter]}>
        <View style={[{ width: '100%' }]}>
          <LocationStatusBar />
        </View>
      </SafeScreen>
      <MapBottomSheet {...mapSheetProps} index={1}>
        {noHistoricalOutings ? (
          <NoOutingsScreen />
        ) : mapSheetPage === 'Recommendation Detail' ? (
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
