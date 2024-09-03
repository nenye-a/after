import { View } from 'react-native';
import AfterText from '../AfterText/AfterText';
import { useTheme } from '@/theme';

type Props = {
  text: string;
  color?: string;
};

const Pill = (props: Props) => {
  const { text, color } = props;
  const { components } = useTheme();
  return (
    <View
      style={[
        components.basePillStyle,
        color ? { backgroundColor: color } : null,
      ]}
    >
      <AfterText>{text}</AfterText>
    </View>
  );
};

export default Pill;
