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

  const name = _.capitalize(auth0User?.nickname ?? auth0User?.name ?? '');

  return (
    <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
      <View style={[layout.flex_1, layout.row, layout.itemsCenter]}>
        <Pressable>
          <Avatar uri={auth0User?.picture} />
        </Pressable>
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
      {/* TODO: Add the add button when sharing a trip features has been implemented.  */}
      {/* <PillButton text="Add People" icon="plus" mode="secondary" size="small" /> */}
    </View>
  );
}

export default MapSheetUserHeader;
