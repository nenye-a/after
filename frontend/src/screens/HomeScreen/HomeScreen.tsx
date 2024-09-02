import { AfterMap, AfterText, Avatar } from '@/components/atoms';
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
        >
          <AfterText fontType="header">Header</AfterText>
        </View>
      </SafeScreen>
      <MapBottomSheet snapPoints={['5%', '25%', '50%', '90%']} index={2}>
        <AfterText fontType="header">Header</AfterText>
      </MapBottomSheet>
    </>
  );
}

export default HomeScreen;
