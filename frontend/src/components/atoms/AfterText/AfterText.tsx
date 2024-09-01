import { useTheme } from '@/theme';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

type FontType = 'minor' | 'regular' | 'enhanced' | 'header';

type Props = TextProps & {
  fontType: FontType;
};

function getFont(fontType: FontType) {
  const {
    fonts: { size_18, size_20, size_24, size_32 },
    colors: { gray300 },
  } = useTheme();
  switch (fontType) {
    case 'minor':
      return { ...size_18, color: gray300 };
    case 'regular':
      return size_20;
    case 'enhanced':
      return size_24;
    case 'header':
      return size_32;
  }
}

function AfterText({ style, fontType, ...textProps }: Props) {
  let newStyle: StyleProp<TextStyle> = [
    { color: 'white' }, // TODO: Change default based on theme.
    { fontFamily: 'Inter' },
    getFont(fontType),
  ];

  return <Text style={[newStyle, style]} {...textProps} />;
}

export default AfterText;
