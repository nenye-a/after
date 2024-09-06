import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ComponentTheme } from '@/types/theme/theme';

interface AllStyle
  extends Record<string, AllStyle | ImageStyle | TextStyle | ViewStyle> {}

export default ({
  layout,
  backgrounds,
  fonts,
  gutters,
  borders,
}: ComponentTheme) => {
  const primaryButton: ViewStyle = {
    ...layout.row,
    ...layout.justifyCenter,
    ...layout.itemsCenter,
    ...backgrounds.blue400,
    ...gutters.paddingHorizontal_8,
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

  const activeTab: ViewStyle = {
    ...layout.row,
    ...layout.itemsCenter,
    ...layout.justifyCenter,
    ...backgrounds.gray400,
    ...gutters.paddingHorizontal_11,
    borderRadius: 12,
    height: 36,
  };

  const inactiveTab: ViewStyle = {
    ...activeTab,
    opacity: 1,
    ...backgrounds.transparent,
  };

  const specialTabBorder: ViewStyle = {
    ...borders.blue400,
    ...borders.w_1,
  };

  const basePillStyle: ViewStyle = {
    ...layout.row,
    ...layout.justifyCenter,
    ...layout.itemsCenter,
    ...backgrounds.blue400,
    ...gutters.paddingHorizontal_8,
    borderRadius: 99,
    height: 22,
  };

  const iconButton: ViewStyle = {
    ...layout.row,
    ...layout.itemsCenter,
    ...layout.justifyCenter,
    ...backgrounds.gray400,
    borderRadius: 99,
    height: 40,
    width: 40,
  };

  const iconButtonLarge: ViewStyle = {
    ...iconButton,
    height: 108,
    width: 108,
  };

  const textInputView: ViewStyle = {
    ...layout.row,
    ...layout.itemsCenter,
    ...backgrounds.gray400,
    ...gutters.paddingHorizontal_11,
    borderRadius: 12,
    height: 36,
  };

  const dropDownSelectedStyle: ViewStyle = {
    ...layout.row,
    ...layout.itemsCenter,
    ...backgrounds.gray400,
    ...gutters.paddingHorizontal_11,
    borderRadius: 12,
    height: 36,
  };

  const dropDownListStyle: ViewStyle = {
    ...backgrounds.gray400,
    ...gutters.marginVertical_8,
    ...gutters.marginBottom_15,
    ...borders.transparent,
    borderRadius: 4,
  };

  return {
    primaryButton,
    secondaryButton,
    smallPrimaryButton,
    smallSecondaryButton,
    buttonText,
    activeTab,
    inactiveTab,
    specialTabBorder,
    basePillStyle,
    iconButton,
    iconButtonLarge,
    textInputView,
    dropDownSelectedStyle,
    dropDownListStyle,
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
