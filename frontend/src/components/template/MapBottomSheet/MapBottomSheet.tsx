import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useRef, type PropsWithChildren } from 'react';
import { useTheme } from '@/theme';

type Props = BottomSheetProps & PropsWithChildren;

function MapBottomSheet({ children, ...bottomSheetProps }: Props) {
  const { gutters, backgrounds } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { style } = bottomSheetProps;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['10%', '50%', '100%']}
      backgroundStyle={[backgrounds.blue800]}
      handleIndicatorStyle={[backgrounds.blue800]}
      {...bottomSheetProps}
      style={[gutters.paddingHorizontal_15, style]}
    >
      {children}
      {/* <BottomSheetView>{children}</BottomSheetView> */}
    </BottomSheet>
  );
}

export default MapBottomSheet;
