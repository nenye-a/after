import { AfterMap, AfterText, Avatar } from '@/components/atoms';
import { MapSheetUserHeader } from '@/components/molecules';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { useTheme } from '@/theme';
import { View } from 'react-native';

function HomeScreen() {
  const { layout } = useTheme();

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
        {/* <AfterText fontType="header">Header</AfterText> */}
        <MapSheetUserHeader />
      </MapBottomSheet>
    </>
  );
}

export default HomeScreen;
