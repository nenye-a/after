import { View, ViewProps } from 'react-native';
import React from 'react';
import { useTheme } from '@/theme';
import { AfterText, PillButton } from '@/components/atoms';
import IconButton from '@/components/atoms/IconButton/IconButton';
import Icon from 'react-native-vector-icons/Ionicons';

type LocationStatusBarProps = ViewProps & {
  currentLocation: string;
  activeOuting?: boolean;
  durationString?: string; // TODO: Replace with an actual string of arrival time
};

const LocationStatusBar = (props: LocationStatusBarProps) => {
  const { fonts, gutters, layout, borders, backgrounds } = useTheme();
  const { activeOuting, currentLocation, durationString, style, ...viewProps } =
    props;

  return (
    <View
      {...viewProps}
      style={[
        layout.row,
        layout.justifyBetween,
        layout.itemsCenter,
        backgrounds.blue800,
        { height: activeOuting ? 66 : 48, borderRadius: 99 },
        gutters.paddingHorizontal_15,
        layout.flex_1,
        activeOuting ? [borders.blue400, borders.w_2] : null,
        style,
      ]}
    >
      {activeOuting ? (
        <>
          <View style={[layout.row, layout.itemsCenter]}>
            <IconButton icon="big_share" iconColor="white" />
            <View style={[layout.row]}>
              <View style={[gutters.marginHorizontal_8]}>
                <AfterText fontType="enhanced" style={[fonts.bold]}>
                  {currentLocation}
                </AfterText>
                <AfterText fontType="minor">{durationString}</AfterText>
              </View>
            </View>
          </View>
          <IconButton customIcon={<Icon name="stop" color="red" size={20} />} />
        </>
      ) : (
        <>
          <View style={[layout.row]}>
            <AfterText fontType="minor">{'Currently at '}</AfterText>
            <AfterText fontType="minor" style={[fonts.white, fonts.bold]}>
              {currentLocation}
            </AfterText>
          </View>
          <PillButton
            text="Start Outing"
            size="small"
            textStyle={[fonts.bold]}
          />
        </>
      )}
    </View>
  );
};

export default LocationStatusBar;