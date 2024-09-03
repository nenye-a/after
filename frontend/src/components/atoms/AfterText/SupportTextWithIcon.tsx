import { View, ViewProps } from 'react-native';
import React from 'react';
import AfterText, { AfterTextProps } from './AfterText';
import { useTheme } from '@/theme';

type Props = ViewProps & {
  icon: JSX.Element;
  text: string;
  textProps?: AfterTextProps;
};

const SupportTextWithIcon = (props: Props) => {
  const { layout, gutters } = useTheme();
  const { icon, text, textProps, style, ...otherProps } = props;

  return (
    <View {...otherProps} style={[layout.row, layout.itemsCenter, style]}>
      <View style={[gutters.marginRight_8]}>{icon}</View>
      <AfterText fontType="minor" {...textProps}>
        {text}
      </AfterText>
    </View>
  );
};

export default SupportTextWithIcon;
