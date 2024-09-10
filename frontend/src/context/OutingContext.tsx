import {
  GetActiveOutingQueryVariables,
  OutingType,
} from '@/services/graphql/after/generated/graphql';
import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MMKV } from 'react-native-mmkv';
import { useUser } from './UserContext';
import { GET_ACTIVE_OUTING } from '@/services/graphql/after/queries/outing';

export type OutingContextType = {
  activeOuting: OutingType | null;
  setActiveOuting: (outing: OutingType) => void;
};

const OutingContext = createContext<OutingContextType>({
  activeOuting: null,
  setActiveOuting: () => {},
});

export const useOuting = () => useContext(OutingContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function OutingProvider({ children = null, storage }: Props) {
  const { apiInstance, isAuthorized } = useUser();
  const [activeOuting, setActiveOuting] = useState<OutingType | null>(null);

  const { data: activeOutingData } = useQuery({
    queryKey: ['getActiveOuting'],
    queryFn: () => apiInstance?.request(GET_ACTIVE_OUTING),
    enabled: isAuthorized && !!apiInstance,
  });

  useEffect(() => {
    if (activeOutingData?.getActiveOuting) {
      setActiveOuting(activeOutingData.getActiveOuting);
    }
  }, [activeOutingData]);

  useEffect(() => {
    if (!isAuthorized && activeOuting) {
      setActiveOuting(null);
    }
  }, [isAuthorized]);

  return (
    <OutingContext.Provider
      value={{
        activeOuting,
        setActiveOuting,
      }}
    >
      {children}
    </OutingContext.Provider>
  );
}
