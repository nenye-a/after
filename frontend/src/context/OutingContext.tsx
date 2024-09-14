import { MutationStartOutingArgs } from '@/services/graphql/after/generated/graphql';
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
import { AppState } from 'react-native';

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
  addToOutingPath: (coordinatesList: Coordinates[]) => void;
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
  addToOutingPath: () => {},
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
  const [currentCoordinates, setCoordinates] = useState<Coordinates | null>(
    null,
  );
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);

  const setCurrentCoordinates = (coordinates: Coordinates | null) => {
    // A lot of the services that are used to obtain coordinates also incldue
    // metadata that will break the API if sent. This function is used to strip
    // that metadata.
    setCoordinates(
      coordinates
        ? {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }
        : null,
    );
  };

  const { data: activeOutingData } = useQuery({
    queryKey: ['getActiveOuting'],
    queryFn: async () => {
      return apiInstance?.request(GET_ACTIVE_OUTING).catch((err) => {
        console.log(err);
        console.log('Failed to get active outing');
      });
    },
    staleTime: 10 * seconds,
    enabled: isAuthorized && !!apiInstance && !activeOuting,
  });

  useEffect(() => {
    getCurrentPositionRNCG((position) => {
      position.coords && setCurrentCoordinates(position.coords);
    });
  }, []);

  const {
    status: locationDetailsStatus,
    data: locationDetails,
    refetch: refetchLocationDetails,
  } = useQuery({
    queryKey: ['getGooglePreviewLocation'],
    queryFn: async () => {
      let coordinates = await getCurrentPositionRNCG();
      let locationRequest = await apiInstance
        ?.request(GET_LOCATION_PREVIEW, {
          coordinates: {
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
          },
        })
        .catch((error) => {
          console.log(error);
          console.log(`Failed to get current location`);
        });

      let locationData = locationRequest?.getGooglePreviewLocation;
      setCurrentCoordinates(coordinates.coords);
      return locationData;
    },
    // Have current place be the shield that prevents us spamming this endpoint
    // and wracking up bills.
    enabled: isAuthorized && !!currentCoordinates && !currentPlace,
  });

  const { mutate: createOutingRequest } = useMutation({
    mutationFn: async ({ coordinates }: MutationStartOutingArgs) =>
      apiInstance?.request(START_OUTING, { coordinates }).catch((err) => {
        console.log(err);
        console.log('Failed to start active outing');
      }),
    onSuccess: (startOutingResponse) => {
      let newOuting = startOutingResponse?.startOuting.outing;
      let newLocation = startOutingResponse?.startOuting.location;

      newOuting && setActiveOuting(newOuting);
      if (newLocation) {
        setCurrentPlace({
          name: newLocation.name,
          address: newLocation.address,
        });
        setCurrentCoordinates(newLocation.coordinates);
      }
    },
  });

  const { mutate: endOutingRequest } = useMutation({
    mutationFn: async () =>
      apiInstance?.request(END_OUTING).catch((err) => {
        console.log(err);
        console.log('Failed to end active outing');
      }),
    onSuccess: () => {
      setActiveOuting(null);
    },
  });

  const { mutate: createPathPoints, isPending: pathCreationPending } =
    useMutation({
      mutationFn: async (coordinatesList: Coordinates[]) => {
        return apiInstance
          ?.request(CREATE_PATH, {
            points: coordinatesList.map((coordinates) => ({
              coordinates: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              },
              time: new Date(),
            })),
          })
          .catch((err) => {
            console.log(err);
            console.log('Failed to create outing path points.');
          });
      },
    });

  const addToOutingPath = async (coordinatesList: Coordinates[]) => {
    if (activeOuting) {
      createPathPoints(coordinatesList);
    } else console.log('No active outing to add path points to.');
  };

  const startOuting = async () => {
    if (!activeOuting) {
      let coordinates = await getCurrentPositionRNCG().then(
        (position): Coordinates => ({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      );
      createOutingRequest({ coordinates });
      startTrackingLocation();
      addToOutingPath([coordinates]);
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
    if (locationDetails) {
      setCurrentPlace({
        name: locationDetails.displayName,
        address: locationDetails.address,
      });
    }
  }, [locationDetails]);

  useEffect(() => {
    onMotionChange((changeEvent) => {
      setCurrentCoordinates(changeEvent.location.coords);
    });

    onLocationChange((locaton) => {
      setCurrentCoordinates(locaton.coords);
    });

    return () => {
      removeLocationListeners();
    };
  }, []);

  useEffect(() => {
    let subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (nextAppState === 'active') {
          refetchLocationDetails();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Every time the user moves, add the new coordinates to the outing path.
    // TODO: Add filters to somewhat limit this to a certain distance from the last point.
    if (activeOuting) {
      currentCoordinates && addToOutingPath([currentCoordinates]);
    }
  }, [currentCoordinates]);

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
        addToOutingPath,
      }}
    >
      {children}
    </OutingContext.Provider>
  );
}
