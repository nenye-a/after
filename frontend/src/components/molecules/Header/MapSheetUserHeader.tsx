import { AfterText, Avatar, PillButton } from '@/components/atoms';
import { useTheme } from '@/theme';
import { Pressable, View } from 'react-native';

type MapSheetUserHeaderProps = {};

function MapSheetUserHeader(props: MapSheetUserHeaderProps) {
  const { layout, gutters, fonts } = useTheme();
  const name = 'Michelle Villanueva'; // TODO: Make dynamic.
  const outingText = 'No active outing';

  return (
    <Pressable style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
      <View style={[layout.flex_1, layout.row, layout.itemsCenter]}>
        <Avatar />
        <View style={[layout.flex_1, gutters.marginHorizontal_11]}>
          <AfterText fontType="enhanced" style={[fonts.bold]}>
            {name}
          </AfterText>
          <AfterText fontType="minor">{outingText}</AfterText>
        </View>
      </View>
      <PillButton text="Add People" icon="plus" mode="secondary" size="small" />
    </Pressable>
  );
}

export default MapSheetUserHeader;
