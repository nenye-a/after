import { View, ViewProps } from 'react-native';
import React from 'react';
import AfterText, { AfterTextProps } from './AfterText';
import { useTheme } from '@/theme';
import { AllIcons, VectorIcon } from '@/types/components/icons';
import { getIcon } from '@/helpers/icon';

type Props = ViewProps & {
  icon?: AllIcons;
  customIcon?: JSX.Element;
  iconColor?: string;
  text: string;
  textProps?: AfterTextProps;
};

const SupportTextWithIcon = (props: Props) => {
  const { layout, gutters } = useTheme();
  const { icon, iconColor, text, textProps, style, customIcon, ...otherProps } =
    props;

  return (
    <View {...otherProps} style={[layout.row, layout.itemsCenter, style]}>
      <View style={[gutters.marginRight_8]}>
        {customIcon ? customIcon : icon ? getIcon(icon, iconColor) : null}
      </View>
      <AfterText fontType="minor" {...textProps}>
        {text}
      </AfterText>
    </View>
  );
};

export default SupportTextWithIcon;
