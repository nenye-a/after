import { AfterText, Avatar, PillButton } from '@/components/atoms';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/theme';
import { Pressable, View } from 'react-native';
import _ from 'lodash';
import { useOuting } from '@/context/OutingContext';

function MapSheetUserHeader() {
  const { layout, gutters, fonts } = useTheme();
  const { auth0User } = useUser();
  const { activeOuting } = useOuting();

  const name = _.capitalize(auth0User?.nickname ?? auth0User?.name ?? ''); // TODO: Make dynamic.

  return (
    // TODO: Determine if a pressable for the whole row makes sense. I belive this was originally
    // meant to only apply to the avatar.
    <Pressable style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
      <View style={[layout.flex_1, layout.row, layout.itemsCenter]}>
        <Avatar uri={auth0User?.picture} />
        <View style={[layout.flex_1, gutters.marginHorizontal_11]}>
          <View style={[gutters.marginBottom_4]}>
            <AfterText fontType="enhanced" style={[fonts.bold]}>
              {name}
            </AfterText>
          </View>
          <AfterText fontType="minor">
            {activeOuting?.name ?? 'No active outing'}
          </AfterText>
        </View>
      </View>
      <PillButton text="Add People" icon="plus" mode="secondary" size="small" />
    </Pressable>
  );
}

export default MapSheetUserHeader;
