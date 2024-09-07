/**
 * @fileoverview DevScreen
 *
 * A screen purely for development purposes. Will use to test out new components,
 * features, etc.
 */

import { View } from 'react-native';

import { useTheme } from '@/theme';
import { MapBottomSheet, SafeScreen } from '@/components/template';
import {
  AfterInput,
  AfterMap,
  AfterText,
  Avatar,
  PillButton,
} from '@/components/atoms';
import { TabSelect } from '@/components/molecules';
import Icon from 'react-native-vector-icons/Feather';
import LocationStatusBar from '@/components/molecules/LocationStatusBar/LocationStatusBar';

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
          <LocationStatusBar currentLocation={'HELLO'} activeOuting />
          <Icon name="clock" size={24} color={'white'} />
          <AfterInput icon="plus" placeholder="Search" />
          <Avatar />
          <AfterText fontType="header">Header</AfterText>
          <AfterText fontType="enhanced">Enhanced</AfterText>
          <AfterText fontType="regular">Regular</AfterText>
          <AfterText fontType="minor">Minor</AfterText>
          <TabSelect
            tabOptions={[
              'Recommendations',
              'Popular',
              'New',
              'Random',
              'Etc.',
            ].map((text) => ({ text }))}
          />
          <PillButton
            text="Primary"
            mode="primary"
            size="large"
            customIcon={<Icon name="clock" size={12} color={'white'} />}
          />
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
