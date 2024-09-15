import {
  LocationType,
  MutationStartOutingArgs,
  PathType,
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
import {
  CREATE_LOCATION_FROM_POINT,
  GET_LOCATION_PREVIEW,
  GET_OUTING_LOCATIONS,
} from '@/services/graphql/after/queries/location';
import { ActiveOutingSummary } from '@/types/service/outing';
import { Coordinates } from '@/types/components/location';
import {
  CREATE_PATH,
  GET_OUTING_PATHS,
} from '@/services/graphql/after/queries/paths';
import { AppState } from 'react-native';

export type Place = {
  name: string;
  address: string;
};

export type OutingContextType = {
  activeOuting: ActiveOutingSummary | null;
  activeOutingLocations: LocationType[];
  activeOutingPath: PathType[];
  mostRecentLocation: LocationType | null;
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
  outingDataLoading: boolean;
};

const OutingContext = createContext<OutingContextType>({
  activeOuting: null,
  activeOutingLocations: [],
  activeOutingPath: [],
  mostRecentLocation: null,
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
  outingDataLoading: false,
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
  const [activeOutingLocations, setActiveOutingLocations] = useState<
    LocationType[]
  >([]);
  const [activeOutingPath, setActiveOutingPath] = useState<PathType[]>([]);
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

  const { data: activeOutingData, isLoading: isActiveOutingLoading } = useQuery(
    {
      queryKey: ['getActiveOuting'],
      queryFn: async () => {
        return apiInstance?.request(GET_ACTIVE_OUTING).catch((err) => {
          console.log(err);
          console.log('Failed to get active outing');
        });
      },
      staleTime: 10 * seconds,
      enabled: isAuthorized && !!apiInstance && !activeOuting,
    },
  );

  const {
    data: activeOutingLocationsData,
    isLoading: isOutingLocationsLoading,
  } = useQuery({
    queryKey: ['getActiveOutingLocations', activeOuting?._id],
    queryFn: async () => {
      let activeLocationsResponse = activeOuting
        ? await apiInstance
            ?.request(GET_OUTING_LOCATIONS, {
              outingId: activeOuting?._id,
            })
            .catch((err) => {
              console.log(err);
              console.log('Failed to get active outing locations');
            })
        : null;

      if (activeLocationsResponse) {
        return activeLocationsResponse.getOutingLocations;
      } else {
        return [];
      }
    },
    staleTime: 10 * seconds,
    enabled: !!activeOuting,
  });

  const { data: activeOutingPathdata, isLoading: isActivePathLoading } =
    useQuery({
      queryKey: ['getActiveOutingPath', activeOuting?._id],
      queryFn: async () => {
        let activePathResponse = activeOuting
          ? await apiInstance
              ?.request(GET_OUTING_PATHS, {
                outingIds: [activeOuting._id],
              })
              .catch((err) => {
                console.log(err);
                console.log('Failed to get active outing path');
              })
          : null;

        if (activePathResponse) {
          return (
            activePathResponse.getOutingPaths.find(
              ({ outing_id }) => outing_id === activeOuting?._id,
            )?.points ?? []
          );
        } else {
          return [];
        }
      },
    });

  useEffect(() => {
    if (activeOutingLocationsData)
      setActiveOutingLocations(activeOutingLocationsData);
  }, [activeOutingLocationsData]);

  useEffect(() => {
    if (activeOutingPathdata) {
      setActiveOutingPath(activeOutingPathdata);
    }
  }, [activeOutingPathdata]);

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
      setActiveOutingLocations([]);
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

  const {} = useMutation({
    mutationFn: async (coordinates: Coordinates) => {
      return apiInstance
        ?.request(CREATE_LOCATION_FROM_POINT, { coordinates })
        .catch((err) => {
          console.log(err);
          console.log('Failed to create location from point: ', coordinates);
        });
    },
    onSuccess: () => {
      // Refetch the outing locations.
    },
  });

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
        activeOutingLocations,
        activeOutingPath,
        currentCoordinates,
        setCurrentCoordinates,
        mostRecentLocation: activeOutingLocations[0] ?? null,
        currentPlace,
        setCurrentPlace,
        activeOuting,
        setActiveOuting,
        startOuting,
        endOuting,
        locationDetailsStatus,
        refetchLocationDetails,
        addToOutingPath,
        outingDataLoading:
          isOutingLocationsLoading ||
          isActiveOutingLoading ||
          isActivePathLoading,
      }}
    >
      {children}
    </OutingContext.Provider>
  );
}
