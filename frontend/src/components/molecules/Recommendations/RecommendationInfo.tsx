import _ from 'lodash';
import { Pill, SupportTextWithIcon } from '@/components/atoms';
import { useTheme } from '@/theme';
import { FlatList, View } from 'react-native';

import Burger from '@/theme/assets/icons/Burger';
import Star from '@/theme/assets/icons/Star';
import { numberWithCommas } from '@/helpers/numbers';
import DollarSigns from '@/components/atoms/DollarSigns/DollarSigns';

type RecommendationInfoProps = {
  type: string;
  rating: number;
  numReviews: number;
  costLevel: number;
  tags: string[];
};

const RecommendationInfo = (props: RecommendationInfoProps) => {
  const { layout, fonts, gutters, colors } = useTheme();
  const { type, rating, numReviews, costLevel, tags } = props;

  return (
    <View>
      <View
        style={[
          layout.flex_1,
          layout.row,
          layout.itemsCenter,
          gutters.marginVertical_4,
        ]}
      >
        <SupportTextWithIcon
          style={[gutters.marginRight_11]}
          icon={<Burger fill={colors.gray300} />}
          text={type}
        />
        <SupportTextWithIcon
          style={[gutters.marginRight_11]}
          icon={<Star fill={colors.gray300} />}
          text={`${_.round(rating, 1)} (${numberWithCommas(numReviews)})`}
        />
        <DollarSigns level={costLevel} color={colors.gray300} />
      </View>
      <FlatList
        style={[gutters.marginTop_4]}
        ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
        horizontal
        data={tags}
        renderItem={({ item, index }) => (
          <Pill
            key={index}
            //   color={colors.gray300}
            text={item}
          />
        )}
      />
    </View>
  );
};

export default RecommendationInfo;
