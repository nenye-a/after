import { View } from 'react-native';
import React from 'react';
import { AfterText, Divider } from '@/components/atoms';
import { useTheme } from '@/theme';
import { RecommendationInfoProps } from '@/types/components/recommendations';
import RecommendationInfo from '@/components/molecules/Recommendations/RecommendationInfo';
import IconButton from '@/components/atoms/IconButton/IconButton';

type Props = RecommendationInfoProps & {
  images?: string[]; // TODO: Adjust when connecting to BE.
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
    </View>
  );
};

export default RecommendationDetailScreen;
