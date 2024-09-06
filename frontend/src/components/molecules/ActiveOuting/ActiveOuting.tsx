import {
  FlatList,
  FlatListProps,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { LocationInfoProps } from '@/types/components/location';
import { useTheme } from '@/theme';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';
import LocationInfo from '../Location/LocationInfo';
import { Divider, SupportTextWithIcon } from '@/components/atoms';

import Icon from 'react-native-vector-icons/Feather';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

type ListItemProps = {
  image?: ImageSourcePropType;
  active?: boolean;
  durationString: string; // TODO: Adjust this with real dates and time and calculate
} & LocationInfoProps;

export type ActiveOutingProps = Omit<
  FlatListProps<ListItemProps>,
  'renderItem'
>;

const ActiveOutingIcon = (props: ViewProps & { active?: boolean }) => {
  const { layout, fonts, gutters, colors, backgrounds } = useTheme();
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
  const { layout, fonts, gutters, colors } = useTheme();
  const {
    image = ExampleRestaurantImage,
    name,
    type,
    rating,
    numReviews,
    costLevel,
    tags,
    durationString,
    active,
  } = props;

  return (
    <View>
      <View style={[layout.flex_1, layout.row, gutters.marginVertical_15]}>
        <ActiveOutingIcon active={active} style={[gutters.marginRight_11]} />
        <Image
          source={image}
          style={{ width: 60, height: 60, borderRadius: 8 }}
        />
        <View style={[gutters.marginHorizontal_11]}>
          <SupportTextWithIcon
            style={[gutters.marginBottom_4]}
            customIcon={<Icon name="clock" size={13} color={colors.gray300} />}
            text={durationString}
          />
          <LocationInfo
            name={name}
            type={type}
            rating={rating}
            numReviews={numReviews}
            costLevel={costLevel}
            tags={tags}
          />
        </View>
      </View>
    </View>
  );
};

const ActiveOutingList = (props: ActiveOutingProps) => {
  return (
    <FlatList
      style={[{ marginTop: -15 }]}
      {...props}
      renderItem={({ item, index }) => (
        <LocationItem {...item} active={index === 0} key={index} />
      )}
      // ItemSeparatorComponent={() => <Divider />}
    />
  );
};

export default ActiveOutingList;
