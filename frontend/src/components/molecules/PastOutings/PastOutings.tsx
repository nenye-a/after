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
import {
  convertDateToStringPretty,
  generateDurationString,
} from '@/helpers/dates';

import Icon from 'react-native-vector-icons/Feather';
import { useOuting } from '@/context/OutingContext';
import { OutingType } from '@/services/graphql/after/generated/graphql';

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

const OutingListItem = (outing: OutingType) => {
  const { layout, fonts, gutters, colors, borders } = useTheme();
  const baseImageStyle: StyleProp<ImageStyle> = {
    width: 52,
    height: 52,
    position: 'absolute',
    borderRadius: 8,
    ...borders.blue800,
    borderWidth: 4,
  };

  let [imageUri1, imageUri2] = outing.images?.slice(0, 2) ?? [];
  return (
    <View
      style={[layout.row, layout.justifyBetween, gutters.marginVertical_15]}
    >
      <View style={[layout.row, layout.flex_1]}>
        <View style={[layout.row, { width: 60, height: 40 }, layout.relative]}>
          <Image
            source={{ uri: imageUri1 }}
            style={[
              baseImageStyle,
              {
                top: 0,
                left: 0,
                zIndex: 2,
              },
            ]}
          />
          {imageUri2 ? (
            <Image
              source={{ uri: imageUri2 }}
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
              {convertDateToStringPretty(outing.start_date)}{' '}
            </AfterText>
            <View style={[layout.row, layout.itemsCenter]}>
              <AfterText fontType="minor">{outing.city}</AfterText>
              <View style={[{ width: 15 }]}>
                <Icon name="more-vertical" size={20} color={colors.gray300} />
              </View>
            </View>
          </View>
          <AfterText style={[fonts.bold]}>{outing.name}</AfterText>
          <View style={[layout.row, gutters.marginTop_4]}>
            <SupportTextWithIcon
              style={[gutters.marginRight_11]}
              text={generateDurationString(outing.end_date, outing.start_date)}
              customIcon={
                <Icon name="clock" size={14} color={colors.gray300} />
              }
            />
            <SupportTextWithIcon
              style={[gutters.marginRight_11]}
              text={outing.num_locations + ' spots'}
              customIcon={
                <Icon name="map-pin" size={14} color={colors.gray300} />
              }
            />
            {outing.num_participants ? (
              <SupportTextWithIcon
                text={outing.num_participants.toString()}
                customIcon={
                  outing.num_participants > 1 ? (
                    <Icon name="users" size={14} color={colors.gray300} />
                  ) : (
                    <Icon name="user" size={14} color={colors.gray300} />
                  )
                }
              />
            ) : null}
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

  const { pastOutings } = useOuting();

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
        data={pastOutings.sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
        )}
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
