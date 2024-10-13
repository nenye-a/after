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
  GET_OUTINGS,
  START_OUTING,
} from '@/services/graphql/after/queries/outing';
import { useLocation } from './LocationContext';
import { minuteDifference, seconds } from '@/helpers/dates';
import {
  CREATE_LOCATION_FROM_POINT,
  DEPART_LOCATION,
  GET_LOCATION_PREVIEW,
  GET_MANY_OUTING_LOCATIONS,
  GET_OUTING_LOCATIONS,
} from '@/services/graphql/after/queries/location';
import { ActiveOutingSummary, OutingWithDetails } from '@/types/service/outing';
import {
  Coordinates,
  SameLocationDistanceCutoffMeters,
} from '@/types/components/location';
import {
  CREATE_PATH,
  GET_OUTING_PATHS,
} from '@/services/graphql/after/queries/paths';
import { AppState } from 'react-native';
import { calculateDistanceMeters } from '@/helpers/map';
import {
  METER_DISTANCE_FOR_OUTING_PATH,
  SAME_OUTING_LOCATION_MINUTE_CUTOFFS,
} from '@/constants/outing';

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
  pastOutings: OutingWithDetails[];
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
  handleCreateEndLocation: (coordinates: Coordinates) => void;
};

const OutingContext = createContext<OutingContextType>({
  activeOuting: null,
  activeOutingLocations: [],
  activeOutingPath: [],
  mostRecentLocation: null,
  inTransit: false,
  isAtMostRecentLocation: false,
  pastOutings: [],
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
  handleCreateEndLocation: () => {},
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
  const [pastOutings, setPastOutings] = useState<OutingWithDetails[]>([]);

  const achorKey = 'anchorPoint';
  const [setAnchorPoint, getAnchorPoint, deleteAnchorPoint] = [
    (anchorPoint: { time: Date; coordinates: Coordinates }) =>
      storage.set(achorKey, JSON.stringify(anchorPoint)),
    (): { time: Date; coordinates: Coordinates } => {
      let anchorPointString = storage.getString(achorKey);
      return anchorPointString ? JSON.parse(anchorPointString) : null;
    },
    () => storage.delete(achorKey),
  ];

  const mostRecentLocation = activeOutingLocations[0] ?? null;
  const mostRecentCoordinates =
    activeOutingPath.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    )[0] ?? null;

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
    enabled: !!activeOuting,
  });

  const { data: pastOutingsData, refetch: refetchPastOutings } = useQuery({
    queryKey: ['getUserPastOutings'],
    queryFn: async () => {
      let response = await apiInstance
        ?.request(GET_OUTINGS, {
          status: ['ended'],
          includeAdditionalInfo: true,
        })
        .catch((err) => {
          console.log(err);
          console.log('Failed to get user past outings');
        });

      return response?.getOutings ?? [];
    },
    enabled: isAuthorized,
  });

  const { data: pastOutingPathsData, refetch: refetchPastOutingPath } =
    useQuery({
      queryKey: ['getUserPastOutingPaths'],
      queryFn: async (): Promise<Map<string, PathType[]>> => {
        let pastOutingPathList = pastOutingsData
          ? await apiInstance
              ?.request(GET_OUTING_PATHS, {
                outingIds: pastOutingsData?.map((outing) => outing._id),
              })
              .then((response) => response?.getOutingPaths)
              .catch((err) => {
                console.log(err);
                console.log('Failed to get user past outing paths');
              })
          : null;

        if (pastOutingPathList) {
          return pastOutingPathList.reduce((acc, path) => {
            acc.set(path.outing_id, path.points);
            return acc;
          }, new Map<string, PathType[]>());
        } else {
          return new Map<string, PathType[]>();
        }
      },
      enabled: !!pastOutingsData?.length,
    });

  const { data: pastOutingLocationsData, refetch: refetchPastOutingLocations } =
    useQuery({
      queryKey: ['getUserPastLocations'],
      queryFn: async (): Promise<Map<string, LocationType[]>> => {
        let pastOutingLocationList = pastOutingsData
          ? await apiInstance
              ?.request(GET_MANY_OUTING_LOCATIONS, {
                outingIds: pastOutingsData?.map((outing) => outing._id),
              })
              .then((response) => response?.getManyOutingLocations)
              .catch((err) => {
                console.log(err);
                console.log('Failed to get user past outing locations');
              })
          : null;

        if (pastOutingLocationList) {
          return pastOutingLocationList.reduce((acc, locationList) => {
            acc.set(locationList.outing_id, locationList.locations);
            return acc;
          }, new Map<string, LocationType[]>());
        } else {
          return new Map<string, LocationType[]>();
        }
      },
      enabled: !!pastOutingsData?.length,
    });

  const {
    status: locationDetailsStatus,
    data: locationDetails,
    refetch: refetchLocationDetails,
  } = useQuery({
    queryKey: ['getGooglePreviewLocation'],
    queryFn: async () => {
      let coordinates = await getCurrentPositionRNCG();
      let locationResponse = await apiInstance
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

      let locationData = locationResponse?.getGooglePreviewLocation ?? null;
      return locationData;
    },
    // Have current place be the shield that prevents us spamming this endpoint
    // and wracking up bills.
    enabled: !!apiInstance && !!currentCoordinates && !currentPlace,
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
    onSuccess: async () => {
      await refetchPastOutings();
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
    onSuccess: () => {
      // This might not be necessary, but it's here for now.
      // TODO: Evaluate and remove this comment if this isf ine.
      refetchOutingPath();
    },
  });

  const {
    mutate: createLocationFromPoint,
    // isPending: locationCreationPending,
  } = useMutation({
    mutationFn: async ({
      coordinates,
      arrivalTime,
    }: {
      coordinates: Coordinates;
      arrivalTime?: Date;
    }) => {
      return apiInstance
        ?.request(CREATE_LOCATION_FROM_POINT, {
          coordinates: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
          arrivalTime,
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

  const getPreviewLocation = async (coordinates: Coordinates) => {
    return apiInstance
      ?.request(GET_LOCATION_PREVIEW, {
        coordinates,
      })
      .then((response) => response?.getGooglePreviewLocation ?? null)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  const handleCreateEndLocation = async (coordinates: Coordinates) => {
    // Check if we can consider this the same location as prior. If so, check
    // if we've been here for enough time to consider it a location. If so,
    // add the location to the outing.
    let currentTime = new Date();

    if (!inTransit) {
      // If currently not "in transit", we whould check how close we are to the last
      // location in the outing.
      let distanceFromLastLocation = calculateDistanceMeters(
        mostRecentLocation.coordinates,
        coordinates,
      );

      if (
        distanceFromLastLocation >
        SameLocationDistanceCutoffMeters.LOW_CONFIDENCE
      ) {
        // We only depart location if we're confident we're not at the same location, but we'll
        // go ahead and do a quick check first.
        let previewLocation = await getPreviewLocation(coordinates);

        if (
          previewLocation?.google_place_id !==
          mostRecentLocation?.external_ids.google_place_id
        ) {
          departLocation(mostRecentLocation._id);
          if (previewLocation)
            setCurrentPlace({
              google_place_id: previewLocation.google_place_id,
              name: previewLocation.displayName,
              address: previewLocation.address,
              arrival_time: new Date(),
              coordinates: previewLocation.coordinates,
            });
          deleteAnchorPoint();
        }
      }
    } else if (!isMoving) {
      // Now! Should we consider this a new location? Let's compare against our anchor point.
      let anchorPoint = getAnchorPoint();

      if (!anchorPoint) {
        console.log('Setting anchor point.');
        setAnchorPoint({
          time: currentTime,
          coordinates,
        });
        return;
      }

      let distanceFromAnchor = calculateDistanceMeters(
        anchorPoint.coordinates,
        coordinates,
      );

      let minutesAtAnchor = minuteDifference(anchorPoint.time, new Date(), {
        digits: 2,
      });

      console.log('Anchor Point', anchorPoint);
      console.log('Distance from Anchor', distanceFromAnchor);
      console.log('Minutes at Anchor', minutesAtAnchor);

      if (
        distanceFromAnchor >
        SameLocationDistanceCutoffMeters.VERY_LOW_CONFIDENCE
      ) {
        // We're far from the anchor, let's create a new anchor point and wait.
        setAnchorPoint({
          time: currentTime,
          coordinates,
        });
        return;
      } else if (
        // Moderate to high confidence this is the same location.
        (minutesAtAnchor >= SAME_OUTING_LOCATION_MINUTE_CUTOFFS.MEDIUM &&
          distanceFromAnchor <=
            SameLocationDistanceCutoffMeters.MEDIUM_CONFIDENCE) ||
        // Low confidence this is the same location, but waiting a bit longer.
        (minutesAtAnchor >= SAME_OUTING_LOCATION_MINUTE_CUTOFFS.LOW &&
          distanceFromAnchor <=
            SameLocationDistanceCutoffMeters.LOW_CONFIDENCE) ||
        // Very low confidence this is the same location, but waiting even longer. Doing this
        // to account for the fact that we might be in a large building or area.
        (minutesAtAnchor >= SAME_OUTING_LOCATION_MINUTE_CUTOFFS.VERY_LOW &&
          distanceFromAnchor <=
            SameLocationDistanceCutoffMeters.VERY_LOW_CONFIDENCE)
      ) {
        // We've been near the anchor for long enough to consider this a new location, scaled
        // from our confidence level.
        createLocationFromPoint({ coordinates, arrivalTime: anchorPoint.time });

        deleteAnchorPoint();
      }
    }
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
    // On initial render, get the current location.
    getCurrentPositionRNCG((position) => {
      position.coords && setCurrentCoordinates(position.coords);
    });
  }, []);

  useEffect(() => {
    // On resumption of app from background state, refetch the latest
    // location information.
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
    // Set the current locations form the active outing.
    // Maybe don't need this state and can just use the return from the endpoint directly?
    if (activeOutingLocationsData)
      setActiveOutingLocations(activeOutingLocationsData);
  }, [activeOutingLocationsData]);

  useEffect(() => {
    if (activeOutingPathdata) {
      setActiveOutingPath(activeOutingPathdata);
    }
  }, [activeOutingPathdata]);

  useEffect(() => {
    if (activeOutingData?.getActiveOuting) {
      setActiveOuting(activeOutingData.getActiveOuting);
    }
  }, [activeOutingData]);

  useEffect(() => {
    // Set location details to the current place.
    if (locationDetails) {
      setCurrentPlace({
        google_place_id: locationDetails.google_place_id,
        name: locationDetails.displayName,
        address: locationDetails.address,
        // Don't want to override the arrival time if we're at the same location.
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
    } else {
      console.log('Attempting to refresh');
      refetchLocationDetails();
    }
  }, [locationDetails]);

  useEffect(() => {
    refetchPastOutingPath();
    refetchPastOutingLocations();
  }, [pastOutingsData]);

  useEffect(() => {
    if (pastOutingsData) {
      let pastOutingsWithPaths = pastOutingsData.map((outing) => {
        return {
          ...outing,
          path: pastOutingPathsData?.get(outing._id) ?? [],
          locations: pastOutingLocationsData?.get(outing._id) ?? [],
        };
      });

      setPastOutings(pastOutingsWithPaths);
    }
  }, [pastOutingPathsData, pastOutingsData, pastOutingLocationsData]);

  useEffect(() => {
    // Handle arrival and departure of locations when movement is detected from the user.
    onMotionChange((changeEvent) => {
      handleCreateEndLocation(changeEvent.location.coords);
      setCurrentCoordinates(changeEvent.location.coords);
    });

    onLocationChange((locaton) => {
      handleCreateEndLocation(locaton.coords);
      setCurrentCoordinates(locaton.coords);
    });

    onActivityChange(({ activity, confidence }) => {
      if (confidence > 70)
        switch (activity) {
          case 'running':
          case 'on_bicycle':
          case 'in_vehicle':
            if (!isMoving) setIsMoving(true);
          case 'still':
          case 'walking':
          case 'on_foot':
          case 'unknown':
          default:
            if (isMoving) setIsMoving(false);
        }
    });

    return () => {
      removeLocationListeners();
    };
  }, []);

  useEffect(() => {
    if (!isMoving) {
      refetchLocationDetails();
    }
  }, [isMoving]);

  useEffect(() => {
    // Add coordinates to the outing path if users have moved a meaningful distance.
    if (activeOuting && currentCoordinates) {
      if (mostRecentCoordinates) {
        let distanceFromLastPoint = calculateDistanceMeters(
          mostRecentCoordinates.coordinates,
          currentCoordinates,
        );

        if (distanceFromLastPoint > METER_DISTANCE_FOR_OUTING_PATH)
          addToOutingPath([currentCoordinates]);
      } else {
        addToOutingPath([currentCoordinates]);
      }
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
        pastOutings,
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
        handleCreateEndLocation,
      }}
    >
      {children}
    </OutingContext.Provider>
  );
}
