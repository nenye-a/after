import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import type { ThemeConfiguration } from '@/types/theme/config';

// Actual app colors. Dark mode will be the default and only mode in the beginning.
const colorsDark = {
  white: '#FFFFFF', // note all the other text colors are done via opacities
  blue800: '#1B1E28', // card dark color
  blue700: '#1D2C4D', // map base colo
  blue500: '#314A7D', // map minor road color
  blue400: '#0963E5', // button color
  green600: '#2B6675', // Major road color
  gray300: '#A4A5A9', // Supporting text color
} as const;

// Example colors from boiler plate, will be replaced with actual app colors
// as the boiler plate screens that depend on this are phased out.
const exampleColorsLight = {
  red500: '#C13333',
  gray800: '#303030',
  gray400: '#4D4D4D',
  gray200: '#A1A1A1',
  gray100: '#DFDFDF',
  gray50: '#EFEFEF',
  purple500: '#44427D',
  purple100: '#E1E1EF',
  purple50: '#1B1A23',
  ...colorsDark,
} as const;

const exampleColorsDark = {
  red500: '#C13333',
  gray800: '#E0E0E0',
  gray400: '#969696',
  gray200: '#BABABA',
  gray100: '#000000',
  gray50: '#EFEFEF',
  purple500: '#A6A4F0',
  purple100: '#252732',
  purple50: '#1B1A23',
  ...colorsDark,
} as const;

// const sizes = [12, 16, 24, 32, 40, 80] as const;
const fontSizes = [18, 20, 24, 32] as const; // Actual Sizes
const gutterSizes = [15] as const; // Actual Sizes

export const config = {
  colors: exampleColorsLight,
  fonts: {
    sizes: fontSizes,
    colors: exampleColorsLight,
  },
  gutters: gutterSizes,
  backgrounds: exampleColorsLight,
  borders: {
    widths: [1, 2],
    radius: [4, 16],
    colors: exampleColorsLight,
  },
  navigationColors: {
    ...DefaultTheme.colors,
    background: exampleColorsLight.gray50,
    card: exampleColorsLight.gray50,
  },
  variants: {
    dark: {
      colors: exampleColorsDark,
      fonts: {
        colors: exampleColorsDark,
      },
      backgrounds: exampleColorsDark,
      navigationColors: {
        ...DarkTheme.colors,
        background: exampleColorsDark.purple50,
        card: exampleColorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration;
