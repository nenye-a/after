import { View } from 'react-native';
import React from 'react';
import { AfterText, Divider } from '@/components/atoms';
import { useTheme } from '@/theme';
import { RecommendationInfoProps } from '@/types/components/recommendations';
import RecommendationInfo from '@/components/molecules/Recommendations/RecommendationInfo';

type Props = RecommendationInfoProps & {
  images?: string[]; // TODO: Adjust when connecting to BE.
  description: string;
};

const RecommendationDetailScreen = (props: Props) => {
  const { layout, gutters } = useTheme();

  return (
    <View>
      <RecommendationInfo {...props} nameStyle="header" />
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
