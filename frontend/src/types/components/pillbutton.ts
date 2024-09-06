import type { PressableProps, StyleProp, TextStyle } from 'react-native';
import type { AllIcons } from './icons';

export type ButtonMode = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'large' | 'small';

export type ButtonProps = {
  icon?: AllIcons;
  customIcon?: JSX.Element;
  mode?: ButtonMode;
  size?: ButtonSize;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
};

export type PillButtonProps = PressableProps & ButtonProps;
