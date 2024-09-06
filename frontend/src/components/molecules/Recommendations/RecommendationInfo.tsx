import _ from 'lodash';
import { AfterText, Pill, SupportTextWithIcon } from '@/components/atoms';
import { useTheme } from '@/theme';
import { FlatList, View } from 'react-native';

import Burger from '@/theme/assets/icons/Burger';
import Star from '@/theme/assets/icons/Star';
import { numberWithCommas } from '@/helpers/numbers';
import DollarSigns from '@/components/atoms/DollarSigns/DollarSigns';
import { RecommendationInfoProps } from '@/types/components/recommendations';

type Props = RecommendationInfoProps & {
  nameStyle?: 'regular' | 'header';
};

const RecommendationInfo = (props: Props) => {
  const { layout, fonts, gutters, colors } = useTheme();
  const { name, type, rating, numReviews, costLevel, tags } = props;

  return (
    <View
    // style={[layout.flex_1]}
    >
      <AfterText fontType={props.nameStyle ?? 'regular'} style={[fonts.bold]}>
        {name}
      </AfterText>
      <View
        style={[
          layout.row,
          layout.itemsCenter,
          props.nameStyle === 'header'
            ? [gutters.marginTop_8, gutters.marginBottom_4]
            : gutters.marginVertical_4,
        ]}
      >
        <SupportTextWithIcon
          style={[gutters.marginRight_11]}
          icon="burger"
          iconColor={colors.gray300}
          text={type}
        />
        <SupportTextWithIcon
          style={[gutters.marginRight_11]}
          icon="star"
          iconColor={colors.gray300}
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
            //   color={colors.gray300} // TODO: Support Color Text
            text={item}
          />
        )}
      />
    </View>
  );
};

export default RecommendationInfo;
