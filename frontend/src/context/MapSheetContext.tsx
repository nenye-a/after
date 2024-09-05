import { MapSheetPage } from '@/types/components/mapsheet';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { MMKV } from 'react-native-mmkv';

export type MapSheetContextType = {
  mapSheetPage: MapSheetPage;
  setMapSheetPage: (page: MapSheetPage) => void;

  activeOuting: boolean;
  setActiveOuting: (activeOuting: boolean) => void;
};

const MapSheetContext = createContext<MapSheetContextType>({
  mapSheetPage: 'Past Outings',
  setMapSheetPage: () => {},
  //   TODO: Set actual active outing details.
  activeOuting: false,
  setActiveOuting: () => {},
});

export const useMapSheet = () => useContext(MapSheetContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function MapSheetProvider({ children = null, storage }: Props) {
  // TODO: Use storage to get initial states for the context.

  const [mapSheetPage, setMapSheetPage] =
    useState<MapSheetPage>('Past Outings');
  const [activeOuting, setActiveOuting] = useState<boolean>(false);

  return (
    <MapSheetContext.Provider
      value={{
        mapSheetPage,
        setMapSheetPage,
        activeOuting,
        setActiveOuting,
      }}
    >
      {children}
    </MapSheetContext.Provider>
  );
}
