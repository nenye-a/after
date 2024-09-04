import { FlatList, Image, View } from 'react-native';
import React from 'react';
import { AfterText, Divider } from '@/components/atoms';
import { useTheme } from '@/theme';
import { RecommendationInfoProps } from '@/types/components/recommendations';
import RecommendationInfo from '@/components/molecules/Recommendations/RecommendationInfo';
import IconButton from '@/components/atoms/IconButton/IconButton';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';

type Props = RecommendationInfoProps & {
  images?: (string | undefined | null)[]; // TODO: Adjust when connecting to BE.
  description: string;
};

const RecommendationDetailScreen = (props: Props) => {
  const { layout, gutters } = useTheme();

  return (
    <View>
      <View style={[layout.row, layout.justifyBetween]}>
        <RecommendationInfo {...props} nameStyle="header" />
        <IconButton icon="x" />
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
        style={[gutters.marginTop_15]}
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
    </View>
  );
};

export default RecommendationDetailScreen;
