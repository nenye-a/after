import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ComponentTheme } from '@/types/theme/theme';

interface AllStyle
  extends Record<string, AllStyle | ImageStyle | TextStyle | ViewStyle> {}

export default ({ layout, backgrounds, fonts }: ComponentTheme) => {
  const primaryButton: ViewStyle = {
    ...layout.row,
    ...layout.justifyCenter,
    ...layout.itemsCenter,
    ...backgrounds.blue400,
    borderRadius: 24,
    height: 50,
    width: 'auto',
  };

  const secondaryButton: ViewStyle = {
    ...primaryButton,
    ...backgrounds.gray400,
  };

  const smallPrimaryButton: ViewStyle = {
    ...primaryButton,
    height: 28,
    borderRadius: 99,
  };

  const smallSecondaryButton: ViewStyle = {
    ...secondaryButton,
    height: 28,
    borderRadius: 99,
  };

  const buttonText: TextStyle = {
    ...fonts.white,
    ...fonts.size_14,
    ...fonts.medium,
  };

  return {
    primaryButton,
    secondaryButton,
    smallPrimaryButton,
    smallSecondaryButton,
    buttonText,
    // Example components below.
    buttonCircle: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      ...backgrounds.purple100,
      ...fonts.gray400,
      height: 70,
      width: 70,
      borderRadius: 35,
    },
    circle250: {
      borderRadius: 140,
      height: 250,
      width: 250,
    },
  } as const satisfies AllStyle;
};
