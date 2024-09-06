import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import type { ThemeConfiguration } from '@/types/theme/config';

// Actual app colors. Dark mode will be the default and only mode in the beginning.
const colorsDark = {
  // Collors Inherited from the boilder plate
  red500: '#C13333',
  gray800: '#303030',
  // gray400: '#4D4D4D',
  gray200: '#A1A1A1',
  gray100: '#DFDFDF',
  gray50: '#EFEFEF',
  purple500: '#44427D',
  purple100: '#E1E1EF',
  purple50: '#1B1A23',
  // Colors added
  white: '#FFFFFF', // note all the other text colors are done via opacities
  blue800: '#1B1E28', // card dark color
  blue700: '#1D2C4D', // map base colo
  blue500: '#314A7D', // map minor road color
  blue400: '#0963E5', // button color
  green600: '#2B6675', // Major road color
  grayblue400: '#4D5A6B', // Supporting text color
  gray400: '#32353E', // Secondary button color
  gray300: '#A4A5A9', // Supporting text color
} as const;

// const sizes = [12, 16, 24, 32, 40, 80] as const;
const fontSizes = [12, 14, 16, 24] as const; // Actual Sizes
const gutterSizes = [4, 8, 11, 15] as const; // Actual Sizes

export const config = {
  colors: colorsDark,
  fonts: {
    sizes: fontSizes,
    colors: colorsDark,
  },
  gutters: gutterSizes,
  backgrounds: { ...colorsDark, transparent: 'transparent' },
  borders: {
    widths: [1, 2],
    radius: [4, 16],
    colors: { ...colorsDark, transparent: 'transparent' },
  },
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsDark.gray50,
    card: colorsDark.gray50,
  },
  variants: {
    dark: {
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      backgrounds: colorsDark,
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration;
