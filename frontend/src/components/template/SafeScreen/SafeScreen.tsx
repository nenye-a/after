import { StatusBar, View, ViewProps } from 'react-native';
import type { PropsWithChildren } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type Props = PropsWithChildren & ViewProps;

function SafeScreen({ children, style, ...viewProps }: Props) {
  const { layout, gutters, backgrounds, variant, navigationTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        layout.flex_1,
        {
          // backgroundColor: navigationTheme.colors.background,
          ...backgrounds.transparent,
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          ...gutters.marginHorizontal_15,
        },
        layout.absolute,
        { left: 0, right: 0 },
        style,
      ]}
      {...viewProps}
    >
      <StatusBar
        barStyle={variant === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={navigationTheme.colors.background}
      />
      {children}
    </View>
  );
}

export default SafeScreen;
