import { useTheme } from '@/theme';
import { StyleSheet, View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

type Props = ViewProps & {
  color?: string;
};

function Divider(props: Props): JSX.Element {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: props.color ?? colors.gray400,
        },
        props.style,
      ]}
    />
  );
}

export default Divider;
