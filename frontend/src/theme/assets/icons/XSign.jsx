import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const XSign = (props) => {
  const { fill = '#fff', ...otherProps } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
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
        <Path d="M18 6 6 18M6 6l12 12" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={fill} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default XSign;
