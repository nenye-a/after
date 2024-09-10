import { MapSheetPage } from '@/types/components/mapsheet';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { MMKV } from 'react-native-mmkv';

export type MapSheetContextType = {
  mapSheetPage: MapSheetPage;
  setMapSheetPage: (page: MapSheetPage) => void;
};

const MapSheetContext = createContext<MapSheetContextType>({
  mapSheetPage: 'Past Outings',
  setMapSheetPage: () => {},
});

export const useMapSheet = () => useContext(MapSheetContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function MapSheetProvider({ children = null, storage }: Props) {
  // TODO: Use storage to get initial states for the context.

  const [mapSheetPage, setMapSheetPage] =
    useState<MapSheetPage>('Past Outings');

  return (
    <MapSheetContext.Provider
      value={{
        mapSheetPage,
        setMapSheetPage,
      }}
    >
      {children}
    </MapSheetContext.Provider>
  );
}
