import {
  GetActiveOutingQueryVariables,
  MutationStartOutingArgs,
  OutingType,
} from '@/services/graphql/after/generated/graphql';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MMKV } from 'react-native-mmkv';
import { useUser } from './UserContext';
import {
  END_OUTING,
  GET_ACTIVE_OUTING,
  START_OUTING,
} from '@/services/graphql/after/queries/outing';
import { useLocation } from './LocationContext';

export type OutingContextType = {
  activeOuting: OutingType | null;
  setActiveOuting: (outing: OutingType) => void;
  startOuting: (locationName: string) => void;
  endOuting: () => void;
};

const OutingContext = createContext<OutingContextType>({
  activeOuting: null,
  setActiveOuting: () => {},
  startOuting: () => {},
  endOuting: () => {},
});

export const useOuting = () => useContext(OutingContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function OutingProvider({ children = null, storage }: Props) {
  const { apiInstance, isAuthorized } = useUser();
  const {
    locationTracking,
    getCurrentPosition,
    startTrackingLocation,
    stopTrackingLocation,
  } = useLocation();

  const [activeOuting, setActiveOuting] = useState<OutingType | null>(null);

  const { data: activeOutingData } = useQuery({
    queryKey: ['getActiveOuting'],
    queryFn: async () => apiInstance?.request(GET_ACTIVE_OUTING),
    enabled: isAuthorized && !!apiInstance,
  });

  const { mutate: createOutingRequest } = useMutation({
    mutationFn: async ({ locationName }: MutationStartOutingArgs) =>
      apiInstance?.request(START_OUTING, { locationName }),
    onSuccess: (outing) => {
      let newOuting = outing?.startOuting;
      newOuting && setActiveOuting(newOuting);
    },
  });

  const { mutate: endOutingRequest } = useMutation({
    mutationFn: async () => apiInstance?.request(END_OUTING),
    onSuccess: () => {
      setActiveOuting(null);
    },
  });

  const startOuting = async (locationName: string) => {
    console.log(locationTracking);
    if (!activeOuting) {
      let currentPosition = await getCurrentPosition({});
      startTrackingLocation();
      createOutingRequest({ locationName });
    } else
      console.log(
        'User already has an active outing, end first before starting a new one',
      );
  };

  const endOuting = () => {
    console.log(locationTracking);
    if (activeOuting) {
      stopTrackingLocation();
      endOutingRequest();
    } else console.log('No active outing to end');
  };

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
        startOuting,
        endOuting,
      }}
    >
      {children}
    </OutingContext.Provider>
  );
}
