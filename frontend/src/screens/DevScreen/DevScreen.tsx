/**
 * @fileoverview DevScreen
 *
 * A screen purely for development purposes. Will use to test out new components,
 * features, etc.
 */

import { Text, View } from 'react-native';

import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/template';

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
        <Text>Dev Screen</Text>
      </View>
    </SafeScreen>
  );
}

export default DevScreen;
