import React, { PropsWithChildren, useEffect } from 'react';
import { useTheme } from '@/theme';
import { AfterText, PillButton } from '@/components/atoms';

import type { RootScreenProps } from '@/types/navigation';
import { SafeScreen } from '@/components/template';
import { useUser } from '@/context/UserContext';
import { Image, ImageBackground, Linking, View } from 'react-native';
import { AftrBrandMark, AuthBackgroundScreen } from '@/theme/assets/brand';

const LoginScreen = ({ navigation }: RootScreenProps<'LoginScreen'>) => {
  const { layout, fonts, gutters, backgrounds } = useTheme();
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
    <ImageBackground
      style={[
        layout.itemsCenter,
        layout.absolute,
        { height: '101%', width: '101%', top: -1, left: -1 },
      ]}
      source={AuthBackgroundScreen}
      imageStyle={{ resizeMode: 'contain' }}
    >
      <SafeScreen
        style={[
          layout.itemsCenter,
          layout.justifyBetween,
          { bottom: 0, top: 0 },
        ]}
      >
        <Image
          source={AftrBrandMark}
          style={[{ marginTop: 80, width: 145, height: 44 }]}
          resizeMode="contain"
        />
        <View>
          <AfterText
            fontType="header"
            style={[
              gutters.marginBottom_4,
              {
                fontSize: 60,
                fontWeight: '800',
              },
            ]}
          >
            Out and About, Anytime.
          </AfterText>
          <PillButton
            textStyle={[fonts.bold]}
            onPress={onPress}
            text="Get Started"
            style={[
              {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              gutters.marginVertical_24,
            ]}
          />
          <AfterText
            fontType="minor"
            style={[fonts.alignCenter, gutters.marginBottom_32]}
          >
            By using this app, you agree to our{' '}
            <DocText link="">Terms & Conditions</DocText> and{' '}
            <DocText link="">Privacy Policy</DocText>.
          </AfterText>
          <AfterText
            fontType="minor"
            style={[fonts.alignCenter, gutters.marginBottom_32]}
          >
            {[
              process.env.APP_ENV,
              process.env.AFTER_GRAPHQL_API,
              process.env.GOOGLE_MAPS_API_KEY,
            ].join(', ')}
          </AfterText>
        </View>
      </SafeScreen>
    </ImageBackground>
  );
};

type DocTextProps = PropsWithChildren & { link: string };

const DocText = ({ link, children }: DocTextProps) => (
  <AfterText
    fontType="minor"
    style={{ fontWeight: 'bold' }}
    onPress={() => Linking.openURL(link)}
  >
    {children}
  </AfterText>
);

export default LoginScreen;
