/**
 * @fileoverview DevScreen
 *
 * A screen purely for development purposes. Will use to test out new components,
 * features, etc.
 */

import { View } from 'react-native';

import { useTheme } from '@/theme';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import { AfterMap, AfterText, Avatar } from '@/components/atoms';

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
        <AfterMap />
        <MapBottomSheet snapPoints={['10%', '50%', '100%']}>
          <Avatar />
          <AfterText fontType="header">Header</AfterText>
          <AfterText fontType="enhanced">Enhanced</AfterText>
          <AfterText fontType="regular">Regular</AfterText>
          <AfterText fontType="minor">Minor</AfterText>
        </MapBottomSheet>
      </View>
    </SafeScreen>
  );
}

export default DevScreen;
