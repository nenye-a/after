import { AfterText } from '@/components/atoms';
import { useTheme } from '@/theme';
import { Burst, PlusSign, Refresh } from '@/theme/assets/icons';
import { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

type ButtonMode = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'large' | 'small';
type ButtonIcon = 'plus' | 'refresh' | 'burst';

type ButtonProps = {
  icon?: ButtonIcon;
  customIcon?: ReactNode;
  mode?: ButtonMode;
  size?: ButtonSize;
  text?: string;
  textStyle?: StyleProp<ViewStyle>;
};

type Props = PressableProps & ButtonProps;

export default function PillButton(props: Props) {
  const { components, gutters } = useTheme();
  const { text, style, mode, size, textStyle, icon, customIcon } = props;

  const buttonStyle = getButtonStyle(mode, size, style); // default style
  const iconComponent = customIcon ?? getIcon(icon);

  const newTextStyle = textStyle
    ? [components.buttonText, textStyle]
    : components.buttonText;

  return (
    <Pressable {...props} style={buttonStyle}>
      {!!iconComponent && (
        <View style={[gutters.paddingHorizontal_8]}>{iconComponent}</View>
      )}
      <AfterText fontType="regular" style={newTextStyle}>
        {text}
      </AfterText>
    </Pressable>
  );
}

const getButtonStyle = (
  mode: ButtonMode = 'primary',
  size: ButtonSize = 'large',
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>),
) => {
  const { components } = useTheme();

  let componentStyle =
    mode === 'primary'
      ? size === 'large'
        ? components.primaryButton
        : components.smallPrimaryButton
      : mode === 'secondary'
        ? size === 'large'
          ? components.secondaryButton
          : components.smallSecondaryButton
        : size === 'large'
          ? { ...components.primaryButton, backgroundColor: 'transparent' }
          : {
              ...components.smallSecondaryButton,
              backgroundColor: 'transparent',
            };

  return (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
    const { pressed } = state;
    const compositeStyle = [
      {
        ...componentStyle,
        opacity: pressed ? 0.5 : 1,
      },
    ];

    if (style) {
      if (typeof style === 'function') return [compositeStyle, style(state)];
      else return [compositeStyle, style];
    }
    return compositeStyle;
  };
};

const getIcon = (icon?: ButtonIcon) => {
  if (icon === 'plus') return <PlusSign />;
  else if (icon === 'refresh') return <Refresh />;
  else if (icon === 'burst') return <Burst />;
  else return null;
};
