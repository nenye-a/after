import { useTheme } from '@/theme';
import { StyleSheet, View } from 'react-native';

type Props = {
  color?: string;
};

function Divider(props: Props): JSX.Element {
  const { colors } = useTheme();
  return (
    <View
      style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: props.color ?? colors.gray400,
      }}
    />
  );
}

export default Divider;
