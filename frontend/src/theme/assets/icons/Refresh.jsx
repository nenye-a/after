import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const Refresh = (props) => {
  const { fill = '#fff', size = 24, ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...otherProps}
    >
      <G
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#a)"
      >
        <Path d="M13.334 7.333A5.4 5.4 0 0 0 3 6m-.333-2.667V6h2.667M2.667 8.667A5.4 5.4 0 0 0 13 10m.334 2.667V10h-2.667" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={fill} d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default Refresh;
