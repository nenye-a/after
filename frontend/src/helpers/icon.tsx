import { AllIcons, IconType, VectorIcon } from '@/types/components/icons';
import {
  BigBurger,
  BigGlass,
  BigHandStop,
  BigShare,
  BigTripleStars,
  Book,
  Burger,
  Burst,
  DollarSign,
  DollarSign2,
  DollarSign3,
  DollarSign4,
  Heart,
  Info,
  Menu,
  PlusSign,
  Refresh,
  Star,
  XSign,
  DirectionsMap,
  Uber,
} from '@/theme/assets/icons';

import Icon from 'react-native-vector-icons/FontAwesome';

export const getIcon = (
  icon: AllIcons | VectorIcon,
  fill?: string,
): IconType | VectorIcon => {
  switch (icon) {
    case 'burger':
      return <Burger fill={fill} />;
    case 'burst':
      return <Burst fill={fill} />;
    case 'dollarsign':
      return <DollarSign fill={fill} />;
    case 'dollarsign2':
      return <DollarSign2 fill={fill} />;
    case 'dollarsign3':
      return <DollarSign3 fill={fill} />;
    case 'dollarsign4':
      return <DollarSign4 fill={fill} />;
    case 'heart':
      return <Heart fill={fill} />;
    case 'info':
      return <Info fill={fill} />;
    case 'plus':
      return <PlusSign fill={fill} />;
    case 'refresh':
      return <Refresh fill={fill} />;
    case 'star':
      return <Star fill={fill} />;
    case 'big_burger':
      return <BigBurger fill={fill} />;
    case 'big_glass':
      return <BigGlass fill={fill} />;
    case 'big_share':
      return <BigShare fill={fill} />;
    case 'big_stars':
      return <BigTripleStars fill={fill} />;
    case 'big_handstop':
      return <BigHandStop fill={fill} />;
    case 'x':
      return <XSign fill={fill} />;
    case 'menu':
      return <Menu fill={fill} />;
    case 'book':
      return <Book fill={fill} />;
    case 'directionsmap':
      return <DirectionsMap fill={fill} />;
    case 'uber':
      return <Uber fill={fill} />;
    case 'search':
      return <Icon name="search" size={18} color={fill} />;
    default:
      return icon;
  }
};
