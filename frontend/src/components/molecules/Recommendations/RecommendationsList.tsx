import { AfterText, Divider } from '@/components/atoms';
import {
  View,
  Text,
  FlatList,
  ViewProps,
  Image,
  FlatListProps,
  Pressable,
} from 'react-native';
import PillButton from '../PillButton/PillButton';
import { useTheme } from '@/theme';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';
import RecommendationInfo from './RecommendationInfo';

type RecommendationListItemProps = {
  image?: string | JSX.Element;
  name: string;
  type: string;
  rating: number;
  numReviews: number;
  costLevel: number;
  tags: string[];
};
type RecommendationsHeaderProps = ViewProps & {
  numRecommendations?: number;
};
type RecommendationsListProps = Omit<
  FlatListProps<RecommendationListItemProps>,
  'renderItem'
>;
type RecommendationsModuleProps = {
  recommendations: RecommendationListItemProps[];
};

const RecommendationListItem = (props: RecommendationListItemProps) => {
  const { layout, fonts, gutters, colors } = useTheme();
  const {
    image = ExampleRestaurantImage,
    name,
    type,
    rating,
    numReviews,
    costLevel,
    tags,
  } = props;

  return (
    <View
      style={[
        layout.row,
        layout.itemsCenter,
        layout.justifyBetween,
        gutters.marginVertical_15,
      ]}
    >
      <View style={[layout.flex_1, layout.row]}>
        <Image
          source={image}
          style={{ width: 60, height: 60, borderRadius: 8 }}
        />
        <View
          style={[
            layout.flex_1,
            gutters.marginHorizontal_11,
            gutters.paddingTop_4,
          ]}
        >
          <AfterText fontType="regular" style={[fonts.bold]}>
            {name}
          </AfterText>
          <RecommendationInfo
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

const RecommendationsHeader = (props: RecommendationsHeaderProps) => {
  const { numRecommendations = 0, style, ...viewProps } = props;
  const {
    layout,
    fonts,
    gutters,
    components,
    // colors
  } = useTheme();

  return (
    <View
      {...viewProps}
      style={[layout.row, layout.itemsCenter, layout.justifyBetween]}
    >
      <View
        style={[
          layout.flex_1,
          layout.row,
          layout.itemsCenter,
          { height: components.smallPrimaryButton.height },
        ]}
      >
        <AfterText style={[fonts.gray300]}>
          {numRecommendations} recommendations
        </AfterText>
        {/* TODO: Add Info Modal to explain recommendations (if necesssary.) */}
      </View>
      <PillButton text="Regenerate" mode="primary" size="small" />
    </View>
  );
};

const RecommendationsList = (props: RecommendationsListProps) => {
  const { data } = props;
  return (
    <FlatList
      ItemSeparatorComponent={() => <Divider />}
      data={data}
      renderItem={({ item, index }) => (
        <Pressable>
          {/* TODO: Implement function to show details. */}
          <RecommendationListItem {...item} />
        </Pressable>
      )}
    />
  );
};

const RecommendationsWithHeader = ({
  recommendations,
}: RecommendationsModuleProps) => {
  let numRecommendations = recommendations?.length ?? 0;
  // TODO: Implement a 0 recommendations view.

  return (
    <View>
      <RecommendationsHeader numRecommendations={numRecommendations} />
      {numRecommendations ? (
        <RecommendationsList data={recommendations} />
      ) : null}
    </View>
  );
};

export default RecommendationsWithHeader;
