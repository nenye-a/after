import { AfterMap, AfterText, Avatar, Divider } from '@/components/atoms';
import { MapSheetUserHeader, TabSelect } from '@/components/molecules';
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
      </MapBottomSheet>
    </>
  );
}

export default HomeScreen;
