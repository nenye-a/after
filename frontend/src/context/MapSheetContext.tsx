import { MapSheetPage } from '@/types/components/mapsheet';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MMKV } from 'react-native-mmkv';
import { useOuting } from './OutingContext';

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
  const { activeOuting } = useOuting();

  const [mapSheetPage, setMapSheetPage] = useState<MapSheetPage>(
    activeOuting ? 'Active Outing' : 'Past Outings',
  );

  useEffect(() => {
    if (activeOuting) {
      setMapSheetPage('Active Outing');
    } else {
      setMapSheetPage('Past Outings');
    }
  }, [activeOuting]);

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
