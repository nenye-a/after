import _ from 'lodash';
import { SupportTextWithIcon } from '@/components/atoms';
import { useTheme } from '@/theme';
import { View } from 'react-native';

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
      <View style={[layout.flex_1, layout.row, layout.itemsCenter]}>
        <SupportTextWithIcon
          style={[gutters.marginRight_11]}
          icon={<Burger />}
          text={type}
        />
        <SupportTextWithIcon
          style={[gutters.marginRight_11]}
          icon={<Star />}
          text={`${_.round(rating, 1)} (${numberWithCommas(numReviews)})`}
        />
        <DollarSigns level={costLevel} color={colors.gray400} />
      </View>
    </View>
  );
};

export default RecommendationInfo;
