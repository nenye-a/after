import { FlatList, Image, View } from 'react-native';
import React from 'react';
import {
  AfterText,
  Divider,
  PillButton,
  SupportTextWithIcon,
} from '@/components/atoms';
import { useTheme } from '@/theme';
import IconButton from '@/components/atoms/IconButton/IconButton';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';
import { useMapSheet } from '@/context/MapSheetContext';
import LocationInfo from '@/components/molecules/Location/LocationInfo';
import { LocationInfoProps } from '@/types/components/location';
import { convertDateToStringPretty } from '@/helpers/dates';

import Icon from 'react-native-vector-icons/Feather';

const outingDetailExample = {
  date: new Date(),
  city: 'New York, NY',
  name: 'New York By Night',
  locations: [
    {
      image: ExampleRestaurantImage,
      name: 'Bareburger',
      type: 'Restaurant',
      rating: 4.5,
      numReviews: 1856,
      costLevel: 3,
      tags: ['Chill', 'Trending'],
      durationString: '9:30PM - 12:15AM (2h 45m)',
    },
    {
      image: ExampleRestaurantImage,
      name: "Max & Mina's Ice Cream",
      type: 'Restaurant',
      rating: 4.8,
      numReviews: 387,
      costLevel: 3,
      tags: ['Trending', 'Gen Z Approved'],
      durationString: '7:50PM - 8:55PM (1h 5m)',
    },
    {
      image: ExampleRestaurantImage,
      name: 'Doha Bar & Lounge',
      type: 'Bar & Lounge',
      rating: 4.4,
      numReviews: 856,
      costLevel: 2,
      tags: ['Best In Class', 'Hip Hop'],
      durationString: '6:35PM - 7:30PM (55m)',
    },
  ],
  durationString: '6:35 - 12:15AM (5h 40m)',
  numParticipants: 3,
  favorite: true,
};

type Props = {};

const OutingDetailScreen = (props: Props) => {
  const { name, city, date, locations, durationString, numParticipants } =
    outingDetailExample;

  const { layout, gutters, fonts, colors } = useTheme();
  const { setMapSheetPage } = useMapSheet();

  return (
    <View>
      <View style={[layout.row, layout.justifyBetween]}>
        <View>
          <AfterText fontType="minor">
            {convertDateToStringPretty(date)}
          </AfterText>
          <AfterText fontType="header">New York By Night</AfterText>
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
              text={locations.length + ' spots'}
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
        <IconButton icon="x" onPress={() => setMapSheetPage('Past Outings')} />
      </View>
      <View style={[layout.row, gutters.marginVertical_15]}>
        <PillButton
          style={[layout.flex_1, gutters.marginRight_4]}
          text="Share"
          mode="secondary"
          customIcon={<Icon name="share" size={20} color={colors.white} />}
        />
        <PillButton
          style={[layout.flex_1, gutters.marginLeft_4]}
          text="Favorite"
          mode="secondary"
          customIcon={<Icon name="heart" size={20} color={colors.white} />}
        />
      </View>
      <Divider />
      <FlatList
        style={[gutters.marginVertical_15]}
        data={locations ?? []}
        renderItem={({ item: location, index }) => (
          <View
            key={index}
            style={[layout.flex_1, layout.row, gutters.marginVertical_11]}
          >
            <View
              style={[
                {
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.gray400,
                },
                gutters.marginRight_8,
                layout.justifyCenter,
                layout.itemsCenter,
              ]}
            >
              <AfterText fontType="minor" style={[fonts.white, fonts.size_10]}>
                {index + 1}
              </AfterText>
            </View>
            <View style={[layout.flex_1]}>
              <Image
                source={location.image}
                style={[
                  { height: 186, borderRadius: 8, width: 'auto' },
                  layout.flex_1,
                ]}
              />
              <SupportTextWithIcon
                text={location.durationString}
                style={[gutters.marginVertical_8]}
                customIcon={
                  <Icon name="clock" size={14} color={colors.gray300} />
                }
              />
              <LocationInfo {...location} />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default OutingDetailScreen;
