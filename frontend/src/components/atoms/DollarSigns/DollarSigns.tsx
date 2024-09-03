import { View } from 'react-native';
import DollarSign from '@/theme/assets/icons/DollarSign';
import DollarSign2 from '@/theme/assets/icons/DollarSign_2';
import DollarSign3 from '@/theme/assets/icons/DollarSign_3';
import DollarSign4 from '@/theme/assets/icons/DollarSign_4';
import { useTheme } from '@/theme';

type DollarSignProps = {
  level: number;
  color?: string;
};

const DollarSigns = ({ level, color }: DollarSignProps) => {
  const { layout } = useTheme();

  const dollarSigns = [
    <DollarSign fill={color} />,
    <DollarSign2 fill={color} />,
    <DollarSign3 fill={color} />,
    <DollarSign4 fill={color} />,
  ];

  return dollarSigns[level - 1] || null;
};

export default DollarSigns;
