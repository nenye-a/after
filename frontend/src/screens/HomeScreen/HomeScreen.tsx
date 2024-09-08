import { AfterMap } from '@/components/atoms';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { useTheme } from '@/theme';
import { View } from 'react-native';
import RecommendationDetailScreen from '../SheetScreens/Main/RecommendationDetailScreen';
import SheetHomeScreen from '../SheetScreens/Main/SheetHomeScreen';
import { useMapSheet } from '@/context/MapSheetContext';
import OutingDetailScreen from '../SheetScreens/Main/OutingDetailScreen';
import LocationStatusBar from '@/components/molecules/LocationStatusBar/LocationStatusBar';
import { useQuery } from '@tanstack/react-query';
import { afterInstance } from '@/services/afterInstance';
import { GET_ALL_USERS } from '@/services/graphql/after/queries/user';

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
  const { mapSheetPage, activeOuting } = useMapSheet();

  const {
    isFetching,
    data: allUsers,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['getAllUsers'],
    queryFn: async () => {
      return afterInstance.request(GET_ALL_USERS, {});
    },
  });

  if (isFetching) {
    console.log('Fetching');
    return (
      <View style={[layout.flex_1, layout.justifyCenter, layout.itemsCenter]} />
    );
  } else if (isSuccess) {
    console.log('All users', allUsers);
    console.log(allUsers?.getAllUsers[0].first_name);
  } else if (isError) {
    console.log('Error', error);
  } else {
    console.log('Random ');
  }

  return (
    <>
      <AfterMap />
      <SafeScreen
        style={[
          layout.itemsCenter, // Hell
        ]}
      >
        <View style={[{ width: '100%' }]}>
          <LocationStatusBar
            currentLocation={exampleCurrentLocation}
            activeOuting={activeOuting}
            durationString={exampleDurationsTring}
            style={[]}
          />
        </View>
      </SafeScreen>
      <MapBottomSheet snapPoints={['5%', '25%', '50%', '70%', '90%']} index={2}>
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
