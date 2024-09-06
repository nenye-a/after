import { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { AllIcons } from './icons';

export type BaseTabProps = {
  text: string;
  icon?: AllIcons;
  active?: boolean;
  style?: StyleProp<ViewStyle>; // Override default pressable style.
  border?: boolean;
};

export type TabProps = PressableProps & BaseTabProps;

export type TabSelectProps = {
  tabOptions: TabProps[];
  style?: StyleProp<ViewStyle>;
  activeTab?: string;
};
