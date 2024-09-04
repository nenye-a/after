import { AfterText } from '@/components/atoms';
import { getIcon } from '@/helpers/icon';
import { useTheme } from '@/theme';
import {
  ButtonMode,
  ButtonSize,
  PillButtonProps,
} from '@/types/components/pillbutton';
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

export default function PillButton(props: PillButtonProps) {
  const { components, gutters, layout } = useTheme();
  const { text, style, mode, size, textStyle, icon, customIcon } = props;

  const buttonStyle = getButtonStyle(mode, size, style); // default style
  const iconComponent = customIcon ?? (icon ? getIcon(icon) : null);

  const newTextStyle = textStyle
    ? [components.buttonText, textStyle]
    : components.buttonText;

  return (
    <Pressable {...props} style={buttonStyle}>
      {!!iconComponent && (
        <View style={[gutters.marginRight_4, layout.itemsCenter, layout.row]}>
          {iconComponent}
        </View>
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
