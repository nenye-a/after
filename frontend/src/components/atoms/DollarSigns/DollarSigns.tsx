import { View, Text } from 'react-native';
import DollarSign from '@/theme/assets/icons/DollarSign';
import { useTheme } from '@/theme';

type DollarSignProps = {
  level: number;
  color?: string;
};

const DollarSigns = ({ level, color }: DollarSignProps) => {
  const { layout } = useTheme();

  return (
    <View style={[layout.row, layout.itemsCenter]}>
      {Array(Math.max(0, level)).map(() => (
        <View>
          <DollarSign fill={color} />
        </View>
      ))}
    </View>
  );
};

export default DollarSigns;
