import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const BurstIcon = (props) => {
  let { fill = '#fff', size = 24, ...otherProps } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      {...otherProps}
    >
      <G
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        clipPath="url(#a)"
      >
        <Path d="M12 8.04V3M15.5 10 20 7.5M15.5 14l4.5 2.5M12 15.96V21M8.5 14 4 16.5M8.5 10 4 7.495" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={fill} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default BurstIcon;
