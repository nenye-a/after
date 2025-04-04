import { FlatListProps, Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@/theme';

import LocationInfo from '../Location/LocationInfo';
import { Divider, SupportTextWithIcon } from '@/components/atoms';

import Icon from 'react-native-vector-icons/Feather';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { useOuting } from '@/context/OutingContext';
import { LocationType } from '@/services/graphql/after/generated/graphql';
import {
  formattedDateDifference,
  generateDurationString,
  getLocalTime,
} from '@/helpers/dates';
import { convertLocationPriceLevel } from '@/helpers/location';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';

type ListItemProps = { active?: boolean } & LocationType;

export type ActiveOutingProps = Omit<
  FlatListProps<LocationType>,
  'renderItem' | 'data'
>;

const ActiveOutingIcon = (props: ViewProps & { active?: boolean }) => {
  const { layout, colors, backgrounds } = useTheme();

  return (
    <View {...props}>
      <View
        style={[
          {
            width: 16,
            height: 16,
            borderRadius: 8,
          },
          props.active ? backgrounds.blue500 : backgrounds.gray400,
          layout.justifyCenter,
          layout.itemsCenter,
        ]}
      >
        <View
          style={[
            {
              width: 8,
              height: 8,
              borderRadius: 4,
            },
            props.active ? backgrounds.blue400 : backgrounds.gray400,
          ]}
        />
      </View>
      <View style={[layout.row, layout.flex_1]}>
        <View
          style={[
            {
              borderRightWidth: StyleSheet.hairlineWidth,
              borderRightColor: colors.gray400,
            },
            layout.flex_1,
          ]}
        />

        <View
          style={[
            {
              borderLeftWidth: StyleSheet.hairlineWidth,
              borderLeftColor: colors.gray400,
            },
            layout.flex_1,
          ]}
        />
      </View>
    </View>
  );
};

const LocationItem = (props: ListItemProps) => {
  const { layout, gutters, colors } = useTheme();

  let duration = formattedDateDifference(new Date(), props.arrival_time, [
    'day',
    'hour',
    'minute',
  ]);
  const durationString = props.active
    ? `Here since ${getLocalTime(props.arrival_time)}${duration ? ` (${duration})` : ''}`
    : generateDurationString(props.departure_time, props.arrival_time);

  let imageUri = props.info.image_urls?.[0];

  return (
    <View>
      <View style={[layout.flex_1, layout.row, gutters.marginVertical_15]}>
        <ActiveOutingIcon
          active={props.active}
          style={[gutters.marginRight_11]}
        />
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 60, height: 60, borderRadius: 8 }}
          />
        ) : null}
        <View style={[gutters.marginHorizontal_11]}>
          <SupportTextWithIcon
            style={[gutters.marginBottom_4]}
            customIcon={<Icon name="clock" size={13} color={colors.gray300} />}
            text={durationString}
          />
          <LocationInfo
            name={props.name}
            type={props.info.type ?? 'place'}
            rating={props.info.rating}
            numReviews={props.info.num_ratings}
            costLevel={
              props.info.price_level
                ? convertLocationPriceLevel(props.info.price_level)
                : null
            }
            tags={props.info.tags ?? []}
          />
        </View>
      </View>
    </View>
  );
};

const ActiveOutingList = (props: ActiveOutingProps) => {
  const { activeOutingLocations } = useOuting();
  return (
    <BottomSheetFlatList
      focusHook={useFocusEffect}
      style={[{ marginTop: -15 }]}
      {...props}
      data={activeOutingLocations}
      renderItem={({ item, index }) => (
        <LocationItem {...item} active={!item.departure_time} key={index} />
      )}
      // ItemSeparatorComponent={() => <Divider />}
    />
  );
};

export default ActiveOutingList;
