import {
  FlatList,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {
  AfterInput,
  AfterText,
  Divider,
  SupportTextWithIcon,
} from '@/components/atoms';
import { useTheme } from '@/theme';
import { useMapSheet } from '@/context/MapSheetContext';
import { Dropdown } from 'react-native-element-dropdown';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';
import { convertDateToStringPretty } from '@/helpers/dates';

import Icon from 'react-native-vector-icons/Feather';

const exampleCityList = [
  {
    label: 'All Cities',
    value: 'all-cities',
  },
  {
    label: 'New York',
    value: 'new-york',
  },
  {
    label: 'Los Angeles',
    value: 'los-angeles',
  },
  {
    label: 'Chicago',
    value: 'chicago',
  },
  {
    label: 'Houston',
    value: 'houston',
  },
  {
    label: 'Phoenix',
    value: 'phoenix',
  },
  {
    label: 'Philadelphia',
    value: 'philadelphia',
  },
  {
    label: 'San Antonio',
    value: 'san-antonio',
  },
  {
    label: 'San Diego',
    value: 'san-diego',
  },
  {
    label: 'Dallas',
    value: 'dallas',
  },
  {
    label: 'San Jose',
    value: 'san-jose',
  },
];

const examplePastOutings = [
  {
    images: [ExampleRestaurantImage, ExampleRestaurantImage],
    date: new Date(),
    city: 'New York, NY',
    name: 'New York By Night',
    numSpots: 4,
    durationString: '7:50PM (2 hours)',
    numParticipants: 3,
    favorite: true,
  },
  {
    images: [ExampleRestaurantImage, ExampleRestaurantImage],
    date: new Date(),
    city: 'San Francisco, CA',
    name: 'Night city Exploration',
    numSpots: 8,
    durationString: '10:45PM (4h 32m)',
    numParticipants: 2,
    favorite: true,
  },
  {
    images: [ExampleRestaurantImage, ExampleRestaurantImage],
    date: new Date(),
    city: 'Los Angeles, CA',
    name: 'Dine & Unwind at Queens',
    numSpots: 2,
    durationString: '8:30PM (1 hour)',
    numParticipants: 1,
    favorite: true,
  },
];

type OutingListItemProps = {
  images: ImageSourcePropType[];
  date: Date;
  city: string;
  name: string;
  numSpots: number;
  durationString: string;
  numParticipants: number;
  favorite?: boolean;
};

const OutingListItem = (props: OutingListItemProps) => {
  const { layout, fonts, gutters, colors, borders } = useTheme();
  const {
    images,
    date,
    city,
    name,
    numSpots,
    durationString,
    numParticipants,
    favorite,
  } = props;

  const baseImageStyle: StyleProp<ImageStyle> = {
    width: 52,
    height: 52,
    position: 'absolute',
    borderRadius: 8,
    ...borders.blue800,
    borderWidth: 4,
  };

  let [image1, image2] = images.slice(0, 2);
  return (
    <View
      style={[layout.row, layout.justifyBetween, gutters.marginVertical_15]}
    >
      <View style={[layout.row, layout.flex_1]}>
        <View style={[layout.row, { width: 60, height: 40 }, layout.relative]}>
          <Image
            source={image1}
            style={[
              baseImageStyle,
              {
                top: 0,
                left: 0,
                zIndex: 2,
              },
            ]}
          />
          {image2 ? (
            <Image
              source={image2}
              style={[baseImageStyle, { left: 10, zIndex: 1 }]}
            />
          ) : null}
        </View>

        <View style={[layout.flex_1, gutters.marginHorizontal_11]}>
          <View
            style={[
              layout.row,
              layout.justifyBetween,
              layout.itemsCenter,
              gutters.marginBottom_4,
            ]}
          >
            <AfterText fontType="minor">
              {convertDateToStringPretty(date)}{' '}
            </AfterText>
            <View style={[layout.row, layout.itemsCenter]}>
              <AfterText fontType="minor">{city}</AfterText>
              <View style={[{ width: 15 }]}>
                <Icon name="more-vertical" size={20} color={colors.gray300} />
              </View>
            </View>
          </View>
          <AfterText style={[fonts.bold]}>{name}</AfterText>
          <View style={[layout.row, gutters.marginTop_4]}>
            <SupportTextWithIcon
              style={[gutters.marginRight_11]}
              text={durationString}
              customIcon={
                <Icon name="clock" size={14} color={colors.gray300} />
              }
            />
            <SupportTextWithIcon
              style={[gutters.marginRight_11]}
              text={numSpots + ' spots'}
              customIcon={
                <Icon name="map-pin" size={14} color={colors.gray300} />
              }
            />
            <SupportTextWithIcon
              text={numParticipants.toString()}
              customIcon={
                numParticipants > 1 ? (
                  <Icon name="users" size={14} color={colors.gray300} />
                ) : (
                  <Icon name="user" size={14} color={colors.gray300} />
                )
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

type PastOutingProps = {};

const PastOutings = (props: PastOutingProps) => {
  const { layout, gutters, components, colors, fonts } = useTheme();
  const { setMapSheetPage } = useMapSheet();

  return (
    <View>
      <View style={[layout.row, layout.justifyBetween, gutters.marginBottom_8]}>
        <AfterInput
          viewStyle={[{ flex: 2 }, gutters.marginRight_8]}
          icon="search"
          iconColor="white"
          placeholder="Search"
        />
        <Dropdown
          placeholder="Select City"
          value={exampleCityList[0]}
          selectedTextStyle={[{ color: colors.white }, fonts.size_14]}
          itemTextStyle={[{ color: colors.white }, fonts.size_14]}
          style={[{ flex: 1 }, components.dropDownSelectedStyle]}
          containerStyle={[components.dropDownListStyle]}
          itemContainerStyle={[
            { borderRadius: components.dropDownListStyle.borderRadius },
          ]}
          data={exampleCityList}
          labelField="label"
          valueField="value"
          onChange={() => {}}
          activeColor={colors.gray300}
          fontFamily="Inter"
        />
      </View>
      <FlatList
        data={examplePastOutings}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }: PressableStateCallbackType) => {
              if (pressed) {
                return {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                };
              }
            }}
            onPress={() => setMapSheetPage('Outing Detail')}
          >
            <OutingListItem key={index} {...item} />
          </Pressable>
        )}
        ListEmptyComponent={() => <View />}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
};

export default PastOutings;
