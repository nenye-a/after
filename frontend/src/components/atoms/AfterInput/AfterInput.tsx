import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { AllIcons, VectorIcon } from '@/types/components/icons';
import { useTheme } from '@/theme';
import { getIcon } from '@/helpers/icon';

type Props = TextInputProps & {
  icon?: AllIcons | VectorIcon;
  iconColor?: string;
  viewStyle?: StyleProp<ViewStyle>;
};

const AfterInput = (props: Props) => {
  const { layout, components, gutters, colors, fonts } = useTheme();
  const { icon, iconColor, viewStyle, style, ...textInputProps } = props;

  return (
    <View style={[components.textInputView, viewStyle]}>
      {icon ? (
        <View style={[gutters.marginRight_8]}>{getIcon(icon, iconColor)}</View>
      ) : null}
      <TextInput
        placeholderTextColor={colors.gray300}
        cursorColor={colors.blue400}
        style={[fonts.white, layout.flex_1]}
        {...textInputProps}
      />
    </View>
  );
};

export default AfterInput;
