import { Pressable } from 'react-native';
import React from 'react';
import { AfterText, Avatar, PillButton } from '@/components/atoms';
import { useTheme } from '@/theme';

import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '@/context/UserContext';
import _ from 'lodash';
import { useOuting } from '@/context/OutingContext';

const NoOutingsScreen = () => {
  const { layout, gutters, fonts, colors } = useTheme();
  const { auth0User } = useUser();
  const { startOuting } = useOuting();

  const name = _.capitalize(auth0User?.nickname ?? auth0User?.name ?? '');

  return (
    <BottomSheetView focusHook={useFocusEffect} style={[layout.itemsCenter]}>
      <Pressable>
        <Avatar uri={auth0User?.picture} size={72} />
      </Pressable>
      <AfterText
        fontType="enhanced"
        style={[fonts.bold, gutters.marginVertical_8]}
      >
        {name}
      </AfterText>
      <AfterText
        fontType="regular"
        style={[
          fonts.alignCenter,
          gutters.marginBottom_8,
          fonts.gray200,
          gutters.marginHorizontal_15,
        ]}
      >
        Start your first outing to track visits and fine new places to explore!
      </AfterText>
      <PillButton
        text="Start Outing"
        textStyle={[fonts.bold]}
        icon="burst"
        size="large"
        style={[gutters.marginBottom_15, layout.fullWidth]}
        onPress={() => startOuting()}
      />
    </BottomSheetView>
  );
};

export default NoOutingsScreen;
