import { createContext, PropsWithChildren, useContext } from 'react';
import { MMKV } from 'react-native-mmkv';

export type LocationContextType = {};

const LocationContext = createContext<LocationContextType>({});

export const useLocation = () => useContext(LocationContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function LocationProvider({ children = null, storage }: Props) {
  return (
    <LocationContext.Provider value={{}}>{children}</LocationContext.Provider>
  );
}
