import { FlatList, Image, View } from 'react-native';
import React from 'react';
import { AfterText, Divider, PillButton } from '@/components/atoms';
import { useTheme } from '@/theme';
import { RecommendationInfoProps } from '@/types/components/recommendations';
import RecommendationInfo from '@/components/molecules/Recommendations/RecommendationInfo';
import IconButton from '@/components/atoms/IconButton/IconButton';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';
import { ComponentTheme } from '@/types/theme/theme';
import { PillButtonProps } from '@/types/components/pillbutton';
import { getIcon } from '@/helpers/icon';
import { useMapSheet } from '@/context/MapSheetContext';

type Props = RecommendationInfoProps & {
  images?: (string | undefined | null)[]; // TODO: Adjust when connecting to BE.
  description: string;
};

const RecommendationDetailScreen = (props: Props) => {
  const { layout, gutters, fonts } = useTheme();
  const { setMapSheetPage } = useMapSheet();
  const menuButtonStyle = getMenuButtonStyleProps(useTheme());

  return (
    <View>
      <View style={[layout.row, layout.justifyBetween]}>
        <RecommendationInfo {...props} nameStyle="header" />
        <IconButton
          icon="x"
          onPress={() => setMapSheetPage('Recommendations')}
        />
      </View>
      <View
        style={[
          layout.row,
          layout.wrap,
          { flexShrink: 1 },
          gutters.marginVertical_15,
        ]}
      >
        <AfterText
          fontType="minor"
          style={[
            {
              lineHeight: 18,
            },
          ]}
        >
          {props.description}
        </AfterText>
      </View>
      <Divider />
      <FlatList
        style={[gutters.marginVertical_15]}
        data={props.images ?? []}
        renderItem={({ item, index }) => (
          <View key={index} style={[layout.flex_1]}>
            <Image
              source={item ?? ExampleRestaurantImage}
              style={[
                { aspectRatio: 3 / 2 },
                { height: 160 },
                { borderRadius: 12 },
              ]}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      />
      <PillButton {...menuButtonStyle} text="View menu" icon="menu" />
      <Divider />
      <PillButton {...menuButtonStyle} text="Book a reservation" icon="book" />
      <Divider />
      <View style={[layout.row, gutters.marginVertical_15]}>
        <PillButton
          style={[layout.flex_1, gutters.marginRight_8]}
          textStyle={[fonts.bold]}
          text="Get a ride"
          icon="uber"
        />
        <PillButton
          style={[layout.flex_1, gutters.marginLeft_8]}
          textStyle={[fonts.bold]}
          text="Get directions"
          mode="secondary"
          icon="directionsmap"
        />
      </View>
      <View
        style={[
          layout.row,
          layout.wrap,
          { flexShrink: 1 },
          layout.justifyCenter,
        ]}
      >
        <AfterText fontType="minor">
          Selecting a ride or getting directions will begin a new outing!
        </AfterText>
      </View>
    </View>
  );
};

const getMenuButtonStyleProps = ({
  layout,
  fonts,
}: ComponentTheme): PillButtonProps => {
  return {
    mode: 'tertiary',
    textStyle: [fonts.medium],
    style: [layout.justifyStart],
  };
};

export default RecommendationDetailScreen;