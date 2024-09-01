import { useTheme } from '@/theme';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

type FontType = 'minor' | 'regular' | 'enhanced' | 'header';

type Props = TextProps & {
  fontType: FontType;
};

function getFont(fontType: FontType): StyleProp<TextStyle> {
  const {
    fonts: { size_12, size_14, size_16, size_24 },
    colors: { gray300 },
  } = useTheme();
  switch (fontType) {
    case 'minor':
      return { ...size_12, color: gray300 };
    case 'regular':
      return size_14;
    case 'enhanced':
      return size_16;
    case 'header':
      return { ...size_24, fontWeight: 'bold' };
  }
}

function AfterText({ style, fontType, ...textProps }: Props) {
  let textStyle: StyleProp<TextStyle> = [
    { color: 'white' }, // TODO: Change default based on theme.
    { fontFamily: 'Inter' },
    getFont(fontType),
    style,
  ];

  return <Text style={textStyle} {...textProps} />;
}

export default AfterText;
