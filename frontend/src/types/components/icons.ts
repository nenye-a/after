import type { SvgProps } from 'react-native-svg';

export type LargeIcons =
  | 'big_burger'
  | 'big_glass'
  | 'big_share'
  | 'big_stars'
  | 'big_handstop';
export type Icons =
  | 'burger'
  | 'burst'
  | 'dollarsign'
  | 'dollarsign2'
  | 'dollarsign3'
  | 'dollarsign4'
  | 'heart'
  | 'info'
  | 'plus'
  | 'refresh'
  | 'star'
  | 'x';

export type AllIcons = Icons | LargeIcons;

export type IconType = JSX.Element &
  SvgProps & {
    fill?: string;
  };
