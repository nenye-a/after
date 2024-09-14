import {
  GetActiveOutingQueryVariables,
  MutationStartOutingArgs,
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
import { seconds } from '@/helpers/dates';
import { GET_LOCATION_PREVIEW } from '@/services/graphql/after/queries/location';
import { ActiveOutingSummary } from '@/types/service/outing';
import { Coordinates } from '@/types/components/location';
import { CREATE_PATH } from '@/services/graphql/after/queries/paths';

export type Place = {
  name: string;
  address: string;
};

export type OutingContextType = {
  activeOuting: ActiveOutingSummary | null;
  currentCoordinates: Coordinates | null;
  setCurrentCoordinates: (coordinates: Coordinates) => void;
  currentPlace: Place | null;
  setCurrentPlace: (place: Place) => void;
  setActiveOuting: (outing: ActiveOutingSummary) => void;
  startOuting: (locationName: string) => void;
  endOuting: () => void;
  locationDetailsStatus: string | null;
  refetchLocationDetails: () => void;
};

const OutingContext = createContext<OutingContextType>({
  activeOuting: null,
  currentCoordinates: null,
  setCurrentCoordinates: () => {},
  currentPlace: null,
  setCurrentPlace: () => {},
  setActiveOuting: () => {},
  startOuting: () => {},
  endOuting: () => {},
  locationDetailsStatus: null,
  refetchLocationDetails: () => {},
});

export const useOuting = () => useContext(OutingContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function OutingProvider({ children = null, storage }: Props) {
  const { apiInstance, isAuthorized } = useUser();

  const {
    startTrackingLocation,
    stopTrackingLocation,
    onMotionChange,
    onLocationChange,
    removeLocationListeners,
    getCurrentPositionRNCG,
  } = useLocation();

  const [activeOuting, setActiveOuting] = useState<ActiveOutingSummary | null>(
    null,
  );
  const [currentCoordinates, setCurrentCoordinates] =
    useState<Coordinates | null>(null);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);

  const { data: activeOutingData } = useQuery({
    queryKey: ['getActiveOuting'],
    queryFn: async () => {
      return apiInstance?.request(GET_ACTIVE_OUTING);
    },
    staleTime: 10 * seconds,
    enabled: isAuthorized && !!apiInstance && !activeOuting,
  });

  useEffect(() => {
    getCurrentPositionRNCG((position) => {
      position.coords && setCurrentCoordinates(position.coords);
    });
  }, [activeOuting, isAuthorized]);

  const {
    status: locationDetailsStatus,
    data: locationDetails,
    refetch: refetchLocationDetails,
  } = useQuery({
    queryKey: ['getGooglePreviewLocation'],
    queryFn: async () => {
      if (currentCoordinates) {
        let locationRequest = await apiInstance
          ?.request(GET_LOCATION_PREVIEW, {
            coordinates: {
              latitude: currentCoordinates.latitude,
              longitude: currentCoordinates.longitude,
            },
          })
          .catch((error) => {
            console.log(error);
            console.log(`Failed to get current location`);
          });

        let locationData = locationRequest?.getGooglePreviewLocation;
        return locationData;
      } else {
        return null;
      }
    },
    enabled: isAuthorized && !!currentCoordinates,
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

  const { mutate: createPathPoints, isPending: pathCreationPending } =
    useMutation({
      mutationFn: async (coordinatesList: Coordinates[]) => {
        return apiInstance?.request(CREATE_PATH, {
          points: coordinatesList.map((coordinates) => ({
            coordinates,
            time: new Date(),
          })),
        });
      },
    });

  const startOuting = async (locationName: string) => {
    if (!activeOuting) {
      startTrackingLocation();
      createOutingRequest({ locationName });
    } else
      console.log(
        'User already has an active outing, end first before starting a new one',
      );
  };

  const endOuting = () => {
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

  useEffect(() => {
    if (locationDetails) {
      setCurrentPlace({
        name: locationDetails.displayName,
        address: locationDetails.address,
      });
    }
  }, [locationDetails]);

  useEffect(() => {
    onMotionChange((changeEvent) => {
      // Update current coordinates.

      if (activeOuting) {
        // Add current point to the path.

        if (!pathCreationPending) {
          console.log('Attempting to create a path point.');
          createPathPoints([changeEvent.location.coords]);
        }
        setCurrentCoordinates(changeEvent.location.coords);
        // If on an active outing, trigger the creation of a new location if significant
        // if insigificant add a path point.
      }
    });

    onLocationChange((locaton) => {
      if (activeOuting) {
        if (!pathCreationPending) createPathPoints([locaton.coords]);
        setCurrentCoordinates(locaton.coords);
      }
    });

    return () => {
      removeLocationListeners();
    };
  }, []);

  return (
    <OutingContext.Provider
      value={{
        currentCoordinates,
        setCurrentCoordinates,
        currentPlace,
        setCurrentPlace,
        activeOuting,
        setActiveOuting,
        startOuting,
        endOuting,
        locationDetailsStatus,
        refetchLocationDetails,
      }}
    >
      {children}
    </OutingContext.Provider>
  );
}
