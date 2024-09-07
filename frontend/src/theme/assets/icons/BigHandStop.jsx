import useTheme from '@/theme/hooks/useTheme';
import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const HandStop = (props) => {
  const { colors } = useTheme();
  const { fill = '#DB4437', innerFill = '#fff', ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill={fill}
      {...otherProps}
    >
      <G
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        clipPath="url(#a)"
      >
        <Path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 5.5v-2a1.5 1.5 0 1 1 3 0V12M14 5.5a1.5 1.5 0 1 1 3 0V12" />
        <Path d="M17 7.5a1.5 1.5 0 1 1 3 0V16a6 6 0 0 1-6 6h-2 .208a6 6 0 0 1-5.012-2.7L7 19c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022 1.867 1.867 0 0 1 2.28.28L8 13" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={colors.blue800} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default HandStop;
