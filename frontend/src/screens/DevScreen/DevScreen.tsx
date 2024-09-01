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
import { PillButton } from '@/components/molecules';

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
        <MapBottomSheet snapPoints={['10%', '50%', '100%']} index={1}>
          <Avatar />
          <AfterText fontType="header">Header</AfterText>
          <AfterText fontType="enhanced">Enhanced</AfterText>
          <AfterText fontType="regular">Regular</AfterText>
          <AfterText fontType="minor">Minor</AfterText>
          <PillButton text="Primary" mode="primary" size="large" />
          <PillButton
            text="Secondary"
            mode="secondary"
            size="large"
            icon={'plus'}
          />
          <PillButton
            text="Tertiary"
            mode="tertiary"
            size="large"
            icon={'refresh'}
          />
          <PillButton
            text="Secondary"
            mode="secondary"
            size="small"
            icon={'burst'}
            style={{ width: 150 }}
          />
        </MapBottomSheet>
      </View>
    </SafeScreen>
  );
}

export default DevScreen;
