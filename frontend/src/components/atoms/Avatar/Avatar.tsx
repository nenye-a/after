import { useTheme } from '@/theme';
import { Image, ImageProps, View } from 'react-native';

import DefaultProfileAvatar from '@/theme/assets/images/default_avatar.png';

type Props = ImageProps & {
  uri?: string; // Image URI
  size?: number;
};

function After(props: Props) {
  const { size = 48, uri } = props;
  const { layout } = useTheme();
  return (
    <View>
      <Image
        height={size}
        width={size}
        style={[{ height: size, width: size }, { borderRadius: size / 2 }]}
        source={uri ?? DefaultProfileAvatar}
        resizeMode="contain"
        {...props}
      />
    </View>
  );
}

export default After;