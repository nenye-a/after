import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const DirectionsMap = (props) => {
  const { fill = '#fff', ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
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
        <Path d="m3.75 7 6-3 6 3 6-3v13l-6 3-6-3-6 3V7ZM9.75 4v13M15.75 7v13" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={fill} d="M.75 0h24v24h-24z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default DirectionsMap;
