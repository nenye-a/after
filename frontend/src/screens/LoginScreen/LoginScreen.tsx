import React, { useEffect } from 'react';
import { useTheme } from '@/theme';
import { PillButton } from '@/components/atoms';

import type { RootScreenProps } from '@/types/navigation';
import { SafeScreen } from '@/components/template';
import { useUser } from '@/context/UserContext';

type Props = {};

const LoginScreen = ({ navigation }: RootScreenProps<'LoginScreen'>) => {
  const { layout, fonts, gutters } = useTheme();
  const { isAuthorized, login, logout } = useUser();

  const onPress = async () => {
    try {
      login();
      // logout();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      navigation.navigate('HomeScreen');
    }
  }, [isAuthorized]);

  return (
    <SafeScreen
      style={[layout.itemsCenter, layout.justifyCenter, { top: 0, bottom: 0 }]}
    >
      <PillButton textStyle={[fonts.bold]} onPress={onPress} text="Login" />
    </SafeScreen>
  );
};

export default LoginScreen;
