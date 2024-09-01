import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const Heart = (props) => {
  const { fill = '#fff', size = 24, ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      {...otherProps}
    >
      <G clipPath="url(#a)">
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={fill} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default Heart;
