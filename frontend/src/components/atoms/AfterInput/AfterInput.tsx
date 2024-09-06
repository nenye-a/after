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
  viewStyle?: StyleProp<ViewStyle>;
};

const AfterInput = (props: Props) => {
  const { layout, components, gutters, colors, fonts } = useTheme();
  const { icon, viewStyle, style, ...textInputProps } = props;

  return (
    <View style={[components.textInputView, viewStyle]}>
      {icon ? (
        <View style={[gutters.marginRight_8]}>{getIcon(icon)}</View>
      ) : null}
      <TextInput
        placeholderTextColor={colors.gray300}
        cursorColor={colors.blue400}
        style={[fonts.white]}
        {...textInputProps}
      />
    </View>
  );
};

export default AfterInput;
