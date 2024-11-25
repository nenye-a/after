import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const BigGlass = (props) => {
  const { fill = '#fff', ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      fill="none"
      {...otherProps}
    >
      <Path
        fill={fill}
        d="M13.333 26.667v-8.334L.75 4.167a2.757 2.757 0 0 1-.542-.771A2.062 2.062 0 0 1 0 2.5C0 1.778.25 1.18.75.708S1.861 0 2.583 0h24.834c.722 0 1.333.236 1.833.708.5.473.75 1.07.75 1.792 0 .306-.07.604-.208.896-.14.292-.32.548-.542.77L16.667 18.334v8.334h6.666c.473 0 .868.16 1.188.479.32.32.479.715.479 1.187 0 .473-.16.868-.48 1.188-.319.32-.714.479-1.187.479H6.667c-.473 0-.868-.16-1.188-.48-.32-.319-.479-.714-.479-1.187 0-.472.16-.868.48-1.187.319-.32.714-.48 1.187-.48h6.666Zm-5.916-20h15.166l3-3.334H4.417l3 3.334Z"
      />
    </Svg>
  );
};
export default BigGlass;
