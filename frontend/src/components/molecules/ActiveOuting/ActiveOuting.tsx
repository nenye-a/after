import {
  FlatList,
  FlatListProps,
  Image,
  ImageSourcePropType,
  View,
} from 'react-native';
import React from 'react';
import { LocationInfoProps } from '@/types/components/location';
import { useTheme } from '@/theme';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';
import LocationInfo from '../Location/LocationInfo';
import { Divider, SupportTextWithIcon } from '@/components/atoms';

import Icon from 'react-native-vector-icons/Feather';

type ListItemProps = {
  image?: ImageSourcePropType;
  durationString: string; // TODO: Adjust this with real dates and time and calculate
} & LocationInfoProps;

export type ActiveOutingProps = Omit<
  FlatListProps<ListItemProps>,
  'renderItem'
>;

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
  } = props;

  return (
    <View>
      <View style={[layout.flex_1, layout.row, gutters.marginVertical_15]}>
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
      renderItem={({ item, index }) => <LocationItem {...item} key={index} />}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
};

export default ActiveOutingList;
