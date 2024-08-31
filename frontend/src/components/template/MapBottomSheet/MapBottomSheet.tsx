import { View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef, type PropsWithChildren } from 'react';

// import { useTheme } from '@/theme';

function MapBottomSheet({ children }: PropsWithChildren) {
  // TODO: Adjust theme of the Map bottom sheet.
  // const { layout, variant, navigationTheme } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['10%', '50%', '100%']}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
}

export default MapBottomSheet;
