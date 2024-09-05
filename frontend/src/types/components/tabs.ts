import { PressableProps, StyleProp, ViewStyle } from 'react-native';

export type BaseTabProps = {
  icon?: JSX.Element;
  active?: boolean;
  text: string;
  style?: StyleProp<ViewStyle>; // Override default pressable style.
  border?: boolean;
};

export type TabProps = PressableProps & BaseTabProps;

export type TabSelectProps = {
  tabOptions: TabProps[];
  style?: StyleProp<ViewStyle>;
};
