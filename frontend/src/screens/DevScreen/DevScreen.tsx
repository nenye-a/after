/**
 * @fileoverview DevScreen
 *
 * A screen purely for development purposes. Will use to test out new components,
 * features, etc.
 */

import { Text, View } from 'react-native';

import { useTheme } from '@/theme';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { AfterMap } from '@/components/atoms';

function DevScreen() {
  const { layout } = useTheme();

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.col,
          layout.itemsCenter,
          layout.justifyCenter,
        ]}
      >
        {/* <Text>Dev Screen</Text> */}
        <AfterMap />
        <MapBottomSheet snapPoints={['10%', '50%', '100%']}>
          <Text>Map Bottom Sheet</Text>
        </MapBottomSheet>
      </View>
    </SafeScreen>
  );
}

export default DevScreen;