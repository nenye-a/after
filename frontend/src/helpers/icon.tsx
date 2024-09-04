import { AllIcons, IconType } from '@/types/components/icons';
import {
  BigBurger,
  BigGlass,
  BigHandStop,
  BigShare,
  BigTripleStars,
  Burger,
  Burst,
  DollarSign,
  DollarSign2,
  DollarSign3,
  DollarSign4,
  Heart,
  Info,
  PlusSign,
  Refresh,
  Star,
  XSign,
} from '@/theme/assets/icons';

export const getIcon = (icon: AllIcons, fill?: string): IconType | null => {
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

    default:
      return null;
  }
};
