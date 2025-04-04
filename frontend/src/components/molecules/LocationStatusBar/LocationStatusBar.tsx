import { View, ViewProps } from 'react-native';
import React from 'react';
import { useTheme } from '@/theme';
import { AfterText, PillButton } from '@/components/atoms';
import IconButton from '@/components/atoms/IconButton/IconButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useOuting } from '@/context/OutingContext';
import {
  calculateDuration,
  formattedDateDifference,
  getLocalTime,
} from '@/helpers/dates';

type LocationStatusBarProps = ViewProps & {};

const LocationStatusBar = (props: LocationStatusBarProps) => {
  const { fonts, gutters, layout, borders, backgrounds } = useTheme();
  const {
    activeOuting,
    startOuting,
    endOuting,
    currentPlace,
    isMoving,
    mostRecentLocation,
  } = useOuting();

  const { style, ...viewProps } = props;

  let placeOfInterest = currentPlace ?? mostRecentLocation;

  const titleText = isMoving
    ? 'On the move...'
    : (placeOfInterest?.name ?? placeOfInterest?.address ?? 'Unknown Location');
  const duration = placeOfInterest?.arrival_time
    ? calculateDuration(placeOfInterest?.arrival_time, new Date())
    : null;
  const timeText =
    isMoving && mostRecentLocation?.departure_time
      ? `Since ${getLocalTime(mostRecentLocation.departure_time)}`
      : currentPlace?.arrival_time
        ? `Arrived at ${getLocalTime(currentPlace?.arrival_time)}${duration ? ` (${duration})` : ''}`
        : null;

  return (
    <View
      {...viewProps}
      style={[
        layout.row,
        layout.justifyBetween,
        layout.itemsCenter,
        backgrounds.blue800,
        { borderRadius: 99 },
        gutters.paddingHorizontal_15,
        // layout.flex_1,
        activeOuting
          ? { minHeight: 66, maxHeight: 80 }
          : { minHeight: 48, maxHeight: 60 },
        activeOuting ? [borders.blue400, borders.w_2] : null,
        style,
      ]}
    >
      {activeOuting ? (
        <>
          <View style={[layout.row, layout.itemsCenter, layout.flex_1]}>
            {/* TODO: Implement share button */}
            {/* <IconButton icon="big_share" iconColor="white" /> */}
            <View style={[layout.row, layout.flex_1]}>
              <View style={[gutters.marginHorizontal_8]}>
                <AfterText fontType="enhanced" style={[fonts.bold]}>
                  {titleText}
                </AfterText>
                <AfterText fontType="minor">{timeText}</AfterText>
              </View>
            </View>
          </View>
          <IconButton
            customIcon={<Icon name="stop" color="red" size={20} />}
            onPress={endOuting}
          />
        </>
      ) : (
        <>
          <View style={[layout.row, layout.wrap, layout.flex_1]}>
            <AfterText fontType="minor">{'Currently at '}</AfterText>
            <AfterText fontType="minor" style={[fonts.white, fonts.bold]}>
              {currentPlace?.name ??
                currentPlace?.address ??
                'Unknown Location'}
            </AfterText>
          </View>
          <PillButton
            text="Start Outing"
            size="small"
            textStyle={[fonts.bold]}
            onPress={() => startOuting()}
          />
        </>
      )}
    </View>
  );
};

export default LocationStatusBar;
