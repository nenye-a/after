import { PressableProps, StyleProp, ViewStyle, Pressable } from 'react-native';
import React from 'react';
import { useTheme } from '@/theme';
import { AllIcons } from '@/types/components/icons';
import { getIcon } from '@/helpers/icon';

type Props = PressableProps & {
  icon: AllIcons;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  large?: boolean;
};

const IconButton = (props: Props) => {
  const { components } = useTheme();
  const { style, icon, iconColor, large } = props;

  return (
    <Pressable
      {...props}
      style={[
        large ? components.iconButtonLarge : components.iconButton,
        style,
      ]}
    >
      {getIcon(icon, iconColor)}
    </Pressable>
  );
};

export default IconButton;
