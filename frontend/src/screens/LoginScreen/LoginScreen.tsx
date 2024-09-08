import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useTheme } from '@/theme';
import { PillButton } from '@/components/atoms';

import { useAuth0 } from 'react-native-auth0';
import type { RootScreenProps } from '@/types/navigation';
import { SafeScreen } from '@/components/template';

type Props = {};

const LoginScreen = ({ navigation }: RootScreenProps<'LoginScreen'>) => {
  const { layout, fonts, gutters } = useTheme();
  const { authorize, clearSession, user } = useAuth0();

  const onPress = async () => {
    try {
      console.log(user);

      let results = await authorize().catch((err) => console.log(err));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user) {
      navigation.navigate('HomeScreen');
    }
  });

  return (
    <SafeScreen
      style={[layout.itemsCenter, layout.justifyCenter, { top: 0, bottom: 0 }]}
    >
      <PillButton textStyle={[fonts.bold]} onPress={onPress} text="Login" />
    </SafeScreen>
  );
};

export default LoginScreen;
