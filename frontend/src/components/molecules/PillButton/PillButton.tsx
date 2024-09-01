import { AfterText } from '@/components/atoms';
import { useTheme } from '@/theme';
import { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';

type ButtonModes = 'primary' | 'secondary' | 'tertiary';
type ButtonSizes = 'large' | 'small';

type ButtonProps = {
  showIcon?: boolean;
  icon?: 'plus' | '@' | 'refresh' | ReactNode;
  mode?: ButtonModes;
  size?: ButtonSizes;
  text?: string;
  textStyle?: StyleProp<ViewStyle>;
};

type Props = PressableProps & ButtonProps;

export default function PillButton(props: Props) {
  const { components } = useTheme();
  const { showIcon, icon, text, style, mode, size, textStyle } = props;

  // Get button base style.
  const buttonStyle = getButtonStyle(mode, size, style); // default style

  const newTextStyle = textStyle
    ? [components.buttonText, textStyle]
    : components.buttonText;

  return (
    <Pressable {...props} style={buttonStyle}>
      <AfterText fontType="regular" style={newTextStyle}>
        {text}
      </AfterText>
    </Pressable>
  );
}

const getButtonStyle = (
  mode: ButtonModes = 'primary',
  size: ButtonSizes = 'large',
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
