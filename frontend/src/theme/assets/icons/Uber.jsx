import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Uber = (props) => {
  const { fill = '#fff', ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={24}
      fill="none"
      {...otherProps}
    >
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3.75 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3.75 12Z"
      />
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4ZM3.75 12h6"
      />
    </Svg>
  );
};
export default Uber;
