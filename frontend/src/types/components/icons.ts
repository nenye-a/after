import type { SvgProps } from 'react-native-svg';
import { IconProps } from 'react-native-vector-icons/Icon';

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
  | 'menu'
  | 'book'
  | 'directionsmap'
  | 'uber'
  | 'x'
  | 'search';

export type AllIcons = Icons | LargeIcons;

export type IconType = JSX.Element &
  SvgProps & {
    fill?: string;
  };
export type VectorIcon = JSX.Element & React.ComponentType<IconProps>;
