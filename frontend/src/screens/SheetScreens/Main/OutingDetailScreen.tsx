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

import { useMapSheet } from '@/context/MapSheetContext';
import LocationInfo from '@/components/molecules/Location/LocationInfo';
import {
  convertDateToStringPretty,
  generateDurationString,
} from '@/helpers/dates';

import Icon from 'react-native-vector-icons/Feather';
import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { convertLocationPriceLevel } from '@/helpers/location';

const OutingDetailScreen = () => {
  const { layout, gutters, fonts, colors } = useTheme();
  const { setMapSheetPage, currentPastOuting, setCurrentPastOuting } =
    useMapSheet();

  return (
    <>
      <BottomSheetView
        focusHook={useFocusEffect}
        style={[layout.row, layout.justifyBetween]}
      >
        <View style={[layout.flex_1]}>
          <AfterText fontType="minor">
            {convertDateToStringPretty(currentPastOuting?.start_date)}
          </AfterText>
          <AfterText fontType="header">{currentPastOuting?.name}</AfterText>
          <View style={[layout.row, gutters.marginTop_4]}>
            <SupportTextWithIcon
              style={[gutters.marginRight_11]}
              text={generateDurationString(
                currentPastOuting?.end_date,
                currentPastOuting?.start_date,
              )}
              customIcon={
                <Icon name="clock" size={14} color={colors.gray300} />
              }
            />
            <SupportTextWithIcon
              style={[gutters.marginRight_11]}
              text={currentPastOuting?.num_locations + ' spots'}
              customIcon={
                <Icon name="map-pin" size={14} color={colors.gray300} />
              }
            />
            {currentPastOuting?.num_participants ? (
              <SupportTextWithIcon
                text={currentPastOuting.num_participants.toString()}
                customIcon={
                  currentPastOuting.num_participants > 1 ? (
                    <Icon name="users" size={14} color={colors.gray300} />
                  ) : (
                    <Icon name="user" size={14} color={colors.gray300} />
                  )
                }
              />
            ) : null}
          </View>
        </View>
        <IconButton
          icon="x"
          onPress={() => {
            setCurrentPastOuting(null);
            setMapSheetPage('Past Outings');
          }}
        />
      </BottomSheetView>
      <BottomSheetView
        focusHook={useFocusEffect}
        style={[layout.row, gutters.marginVertical_15]}
      >
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
      </BottomSheetView>
      <BottomSheetView focusHook={useFocusEffect}>
        <Divider />
      </BottomSheetView>
      <BottomSheetFlatList
        focusHook={useFocusEffect}
        style={[gutters.marginVertical_15]}
        data={currentPastOuting?.locations ?? []}
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
              {location.info?.image_urls?.[0] ? (
                <Image
                  source={{ uri: location.info?.image_urls?.[0] }}
                  style={[
                    { height: 186, borderRadius: 8, width: 'auto' },
                    layout.flex_1,
                    gutters.marginBottom_8,
                  ]}
                />
              ) : null}
              <SupportTextWithIcon
                text={generateDurationString(
                  location.departure_time,
                  location.arrival_time,
                )}
                style={[gutters.marginBottom_8]}
                customIcon={
                  <Icon name="clock" size={14} color={colors.gray300} />
                }
              />
              <LocationInfo
                name={location.name}
                type={location.info.type ?? 'place'}
                rating={location.info.rating}
                numReviews={location.info.num_ratings}
                costLevel={
                  location.info.price_level
                    ? convertLocationPriceLevel(location.info.price_level)
                    : null
                }
                tags={location.info.tags ?? []}
              />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
};

export default OutingDetailScreen;
