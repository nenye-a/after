import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const PlusSign = (props) => {
  const { fill = '#fff', size = 24, ...otherProps } = props;

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
        <Path d="M12 5v14M5 12h14" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={fill} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default PlusSign;
