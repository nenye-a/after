import { AfterText, Divider, PillButton } from '@/components/atoms';
import {
  View,
  FlatList,
  Image,
  Pressable,
  PressableStateCallbackType,
} from 'react-native';
import { useTheme } from '@/theme';

import ExampleRestaurantImage from '@/theme/assets/images/example_restaurant_image.png';
import RecommendationInfo from './RecommendationInfo';
import {
  RecommendationListItemProps,
  RecommendationsHeaderProps,
  RecommendationsListProps,
  RecommendationsWithHeaderProps,
} from '@/types/components/recommendations';
import { useMapSheet } from '@/context/MapSheetContext';

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
        <View style={[gutters.marginHorizontal_11, gutters.paddingTop_4]}>
          <RecommendationInfo
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
      <PillButton
        text="Regenerate"
        mode="primary"
        size="small"
        icon="refresh"
      />
    </View>
  );
};

const RecommendationsList = (props: RecommendationsListProps) => {
  const { data } = props;
  const { setMapSheetPage } = useMapSheet();
  return (
    <FlatList
      ItemSeparatorComponent={() => <Divider />}
      data={data}
      renderItem={({ item, index }) => (
        <Pressable
          style={({ pressed }: PressableStateCallbackType) => {
            if (pressed) {
              return {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              };
            }
          }}
          onPress={() => setMapSheetPage('Recommendation Detail')}
        >
          {/* TODO: Implement function to show details. */}
          <RecommendationListItem key={index} {...item} />
        </Pressable>
      )}
    />
  );
};

const RecommendationsWithHeader = ({
  recommendations,
  headerStyle,
  ...viewProps
}: RecommendationsWithHeaderProps) => {
  let numRecommendations = recommendations?.length ?? 0;
  // TODO: Implement a 0 recommendations view.

  return (
    <View {...viewProps}>
      <RecommendationsHeader
        numRecommendations={numRecommendations}
        style={headerStyle}
      />
      {numRecommendations ? (
        <RecommendationsList data={recommendations} />
      ) : null}
    </View>
  );
};

export default RecommendationsWithHeader;