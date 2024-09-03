import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Star = (props) => {
  const { fill = '#fff', size = 24, ...otherProps } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      {...otherProps}
    >
      <Path
        fill={fill}
        d="m4.807 4.29-3.647.53-.064.013a.572.572 0 0 0-.252.962l2.642 2.572-.623 3.632-.007.063a.572.572 0 0 0 .837.54l3.261-1.715 3.254 1.715.057.026a.57.57 0 0 0 .773-.629l-.623-3.632 2.643-2.572.044-.049a.572.572 0 0 0-.361-.926l-3.647-.53L7.464.988a.572.572 0 0 0-1.026 0L4.808 4.29Z"
      />
    </Svg>
  );
};
export default Star;
