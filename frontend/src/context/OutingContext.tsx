import {
  LocationType,
  MutationStartOutingArgs,
  PathType,
} from '@/services/graphql/after/generated/graphql';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createContext,
  PropsWithChildren,
  useCallback,
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
import { minuteDifference, seconds } from '@/helpers/dates';
import {
  CREATE_LOCATION_FROM_POINT,
  DEPART_LOCATION,
  GET_LOCATION_PREVIEW,
  GET_OUTING_LOCATIONS,
} from '@/services/graphql/after/queries/location';
import { ActiveOutingSummary } from '@/types/service/outing';
import {
  Coordinates,
  SameLocationDistanceCutoffMeters,
} from '@/types/components/location';
import {
  CREATE_PATH,
  GET_OUTING_PATHS,
} from '@/services/graphql/after/queries/paths';
import { AppState } from 'react-native';
import { calculateDistanceMeters } from '@/helpers/numbers';
import { SAME_OUTING_LOCATION_MINUTE_CUTOFF } from '@/constants/outing';

export type Place = {
  google_place_id?: string | null;
  name: string;
  address: string;
  arrival_time: Date;
  coordinates: Coordinates;
};

export type OutingContextType = {
  activeOuting: ActiveOutingSummary | null;
  activeOutingLocations: LocationType[];
  activeOutingPath: PathType[];
  mostRecentLocation: LocationType | null;
  inTransit: boolean;
  isAtMostRecentLocation: boolean;
  currentCoordinates: Coordinates | null;
  setCurrentCoordinates: (coordinates: Coordinates) => void;
  currentPlace: Place | null;
  setCurrentPlace: (place: Place) => void;
  setActiveOuting: (outing: ActiveOutingSummary) => void;
  startOuting: () => void;
  endOuting: () => void;
  locationDetailsStatus: string | null;
  refetchLocationDetails: () => void;
  addToOutingPath: (coordinatesList: Coordinates[]) => void;
  outingDataLoading: boolean;
  isMoving: boolean;
};

const OutingContext = createContext<OutingContextType>({
  activeOuting: null,
  activeOutingLocations: [],
  activeOutingPath: [],
  mostRecentLocation: null,
  inTransit: false,
  isAtMostRecentLocation: false,
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
  isMoving: false,
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
    onActivityChange,
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
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const mostRecentLocation = activeOutingLocations[0] ?? null;
  const inTransit = !mostRecentLocation || !!mostRecentLocation.departure_time;

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
    refetch: refetchOutingLocations,
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

  const {
    data: activeOutingPathdata,
    isLoading: isActivePathLoading,
    refetch: refetchOutingPath,
  } = useQuery({
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
          google_place_id: newLocation.external_ids.google_place_id ?? null,
          name: newLocation.name,
          address: newLocation.address,
          arrival_time: newLocation.arrival_time,
          coordinates: newLocation.coordinates,
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

  const {
    mutate: createPathPoints,
    // isPending: pathCreationPending
  } = useMutation({
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

  const {
    mutate: createLocationFromPoint,
    // isPending: locationCreationPending,
  } = useMutation({
    mutationFn: async (coordinates: Coordinates) => {
      return apiInstance
        ?.request(CREATE_LOCATION_FROM_POINT, {
          coordinates: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        })
        .catch((err) => {
          console.log(err);
          console.log('Failed to create location from point: ', coordinates);
        });
    },
    onSuccess: () => {
      refetchOutingLocations();
      refetchOutingPath();
    },
  });

  const { mutate: departLocation } = useMutation({
    mutationFn: async (locationId: string) => {
      return apiInstance
        ?.request(DEPART_LOCATION, { locationId })
        .catch((err) => {
          console.log(err);
          console.log('Failed to end location stay.');
        });
    },
    onSuccess: () => {
      refetchOutingLocations();
      refetchOutingPath();
    },
  });

  const addToOutingPath = async (coordinatesList: Coordinates[]) => {
    if (activeOuting) {
      createPathPoints(coordinatesList);
    } else console.log('No active outing to add path points to.');
  };

  const handleCreateEndLocation = useCallback(
    async (coordinates: Coordinates) => {
      // Check if we can consider this the same location as prior. If so, check
      // if we've been here for enough time to consider it a location. If so,
      // add the location to the outing.

      // Determine if we're considering if our most recent location is departed, and if we're at a new location.
      let locationEvaluationState: 'ending' | 'new' =
        mostRecentLocation &&
        currentPlace?.google_place_id ===
          mostRecentLocation?.external_ids.google_place_id
          ? 'ending'
          : 'new';

      let shouldCheckLocation = false; // If we should check the location.

      const getPreviewLocation = useCallback(
        async (coordinates: Coordinates) => {
          return apiInstance
            ?.request(GET_LOCATION_PREVIEW, {
              coordinates,
            })
            .then((response) => response?.getGooglePreviewLocation)
            .catch((err) => {
              console.log(err);
              return null;
            });
        },
        [apiInstance],
      );

      if (locationEvaluationState === 'ending') {
        let distanceFromLastLocation = calculateDistanceMeters(
          mostRecentLocation.coordinates,
          coordinates,
        );

        if (
          distanceFromLastLocation >
          SameLocationDistanceCutoffMeters.LOW_CONFIDENCE
        ) {
          let previewLocation = await getPreviewLocation(coordinates);
          if (
            previewLocation?.google_place_id !==
            mostRecentLocation?.external_ids.google_place_id
          ) {
            departLocation(mostRecentLocation._id);
            // Mark that we've arrived at a new place.
            if (previewLocation)
              setCurrentPlace({
                google_place_id: previewLocation.google_place_id,
                name: previewLocation.displayName,
                address: previewLocation.address,
                arrival_time: new Date(),
                coordinates: previewLocation.coordinates,
              });
          }
        }
      } else if (currentPlace && locationEvaluationState === 'new') {
        let shouldCreateNewLocation = false; // If we should arrive at a new location.

        let minutesSinceArrival = minuteDifference(
          currentPlace.arrival_time,
          new Date(),
          { digits: 0 },
        );

        let distanceFromCurrentPlace = calculateDistanceMeters(
          currentPlace.coordinates,
          coordinates,
        );

        if (minutesSinceArrival >= SAME_OUTING_LOCATION_MINUTE_CUTOFF) {
          // We've been here long enough, that if we're at the same location, we should
          // consider this a new location.

          if (
            distanceFromCurrentPlace <=
            SameLocationDistanceCutoffMeters.HIGH_CONFIDENCE
          ) {
            // We're at the same location, consider this a new location.
            shouldCreateNewLocation = true;
          } else if (
            distanceFromCurrentPlace <=
            SameLocationDistanceCutoffMeters.LOW_CONFIDENCE
          ) {
            shouldCheckLocation = true;
          }

          if (shouldCheckLocation) {
            let previewLocation = await getPreviewLocation(coordinates);
            if (
              previewLocation?.google_place_id === currentPlace.google_place_id
            ) {
              shouldCreateNewLocation = true;
            }
          }

          if (shouldCreateNewLocation) {
            if (!inTransit) {
              // If we're not in transit, we should depart the current location.
              departLocation(mostRecentLocation._id);
            }
            createLocationFromPoint(coordinates);
          }
        }
      }
    },
    [
      currentPlace,
      mostRecentLocation,
      inTransit,
      departLocation,
      createLocationFromPoint,
      apiInstance,
    ],
  );

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

  useEffect(() => {
    if (activeOutingData?.getActiveOuting) {
      setActiveOuting(activeOutingData.getActiveOuting);
    }
  }, [activeOutingData]);

  useEffect(() => {
    if (locationDetails) {
      setCurrentPlace({
        google_place_id: locationDetails.google_place_id,
        name: locationDetails.displayName,
        address: locationDetails.address,
        arrival_time:
          locationDetails.google_place_id ===
          mostRecentLocation?.external_ids.google_place_id
            ? mostRecentLocation?.arrival_time
            : locationDetails.google_place_id !==
                  currentPlace?.google_place_id || !currentPlace?.arrival_time
              ? new Date()
              : currentPlace?.arrival_time,
        coordinates: locationDetails.coordinates,
      });
    }
  }, [locationDetails]);

  useEffect(() => {
    onMotionChange((changeEvent) => {
      setCurrentCoordinates(changeEvent.location.coords);
      handleCreateEndLocation(changeEvent.location.coords);
    });

    onLocationChange((locaton) => {
      setCurrentCoordinates(locaton.coords);
      handleCreateEndLocation(locaton.coords);
    });

    onActivityChange(({ activity, confidence }) => {
      if (confidence > 70)
        switch (activity) {
          case 'running':
          case 'on_bicycle':
          case 'unknown':
          case 'in_vehicle':
            if (!isMoving) setIsMoving(true);
          case 'still':
          case 'walking':
          case 'on_foot':
          default:
            if (isMoving) setIsMoving(false);
        }
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
          // Update the displayed locations and path when the user returns to the app.
          refetchLocationDetails();
          refetchOutingPath();
          refetchOutingLocations();
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
        mostRecentLocation,
        inTransit,
        isMoving,
        isAtMostRecentLocation:
          currentPlace?.google_place_id ===
          mostRecentLocation?.external_ids.google_place_id,
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
