import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const BigTripleStars = (props) => {
  const { fill = '#fff', ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={34}
      height={36}
      fill="none"
      {...otherProps}
    >
      <Path
        fill={fill}
        d="m28.434 11.333 1.316-2.916L32.667 7.1a.834.834 0 0 0 0-1.517L29.75 4.267l-1.316-2.934a.834.834 0 0 0-1.517 0L25.6 4.25l-2.933 1.317a.834.834 0 0 0 0 1.516L25.584 8.4l1.316 2.933c.3.65 1.234.65 1.534 0Zm-13.267 2.5L12.517 8c-.583-1.3-2.45-1.3-3.033 0l-2.65 5.833L1 16.483c-1.3.6-1.3 2.45 0 3.034l5.834 2.65L9.484 28c.6 1.3 2.45 1.3 3.033 0l2.65-5.833L21 19.517c1.3-.6 1.3-2.45 0-3.034l-5.833-2.65ZM26.9 24.667l-1.316 2.916-2.917 1.317a.834.834 0 0 0 0 1.517l2.917 1.316 1.316 2.934c.3.65 1.217.65 1.517 0l1.317-2.917 2.933-1.317a.834.834 0 0 0 0-1.516L29.75 27.6l-1.316-2.933c-.3-.65-1.234-.65-1.534 0Z"
      />
    </Svg>
  );
};
export default BigTripleStars;
