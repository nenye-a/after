import { View } from 'react-native';
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useRef, type PropsWithChildren } from 'react';

// import { useTheme } from '@/theme';

type Props = BottomSheetProps & PropsWithChildren;

function MapBottomSheet({ children, ...bottomSheetProps }: Props) {
  // TODO: Adjust theme of the Map bottom sheet.
  // const { layout, variant, navigationTheme } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  // TODO: Handle the behaviour of having a header or not.

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['10%', '50%', '100%']}
      {...bottomSheetProps}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
}

export default MapBottomSheet;