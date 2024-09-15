import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MMKV } from 'react-native-mmkv';
import BackgroundGeolocation, {
  Config,
  CurrentPositionRequest,
  Location,
  LocationError,
  MotionActivityEvent,
  MotionChangeEvent,
  Subscription,
} from 'react-native-background-geolocation';
import Geolocation, {
  GeolocationError,
  GeolocationOptions,
  GeolocationResponse,
} from '@react-native-community/geolocation';

const GeolocationConfig: Config = {
  stopOnTerminate: false,
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  stopTimeout: 8, // 8 minutes before considering device stationary.
  // TODO: Remove before production
  debug: true,
  logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  reset: true,
};

const stub = () => {};

export type LocationContextType = {
  locationFeatureReady: boolean;
  locationTracking: boolean;
  onLocationChange: (
    success: (location: Location) => void,
    failure?: (errorCode: LocationError) => void,
  ) => Subscription;
  onMotionChange: (
    callback: (event: MotionChangeEvent) => void,
  ) => Subscription;
  onActivityChange: (
    callback: (event: MotionActivityEvent) => void,
  ) => Subscription;
  removeLocationListeners: () => void;
  // NOTE: React native community geolocation obtains positioning much faster
  // than the background geolocation service.
  getCurrentPositionBG: (
    options: CurrentPositionRequest,
  ) => Promise<Location | null>;
  getCurrentPositionRNCG: (
    success?: (position: GeolocationResponse) => void,
    error?: ((error: GeolocationError) => void) | undefined,
    options?: GeolocationOptions,
  ) => Promise<GeolocationResponse>;
  startTrackingLocation: () => Promise<boolean>;
  stopTrackingLocation: () => Promise<boolean>;
};

const LocationContext = createContext<LocationContextType>({
  locationFeatureReady: false,
  locationTracking: false,
  onLocationChange: (stub) => ({ remove: () => {} }),
  onMotionChange: (stub) => ({ remove: () => {} }),
  onActivityChange: (stub) => ({ remove: () => {} }),
  removeLocationListeners: stub,
  getCurrentPositionBG: async () => ({}) as Location,
  getCurrentPositionRNCG: async () =>
    Promise.resolve({} as GeolocationResponse),
  startTrackingLocation: () => Promise.resolve(false),
  stopTrackingLocation: () => Promise.resolve(false),
});

export const useLocation = () => useContext(LocationContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function LocationProvider({ children = null, storage }: Props) {
  const [locationTracking, setTrackingStatus] = useState<boolean>(false);
  const [locationFeatureReady, setFeatureReady] = useState<boolean>(false);

  const startTracking = async () => {
    if (!locationTracking) {
      let trackingState = await BackgroundGeolocation.start();
      setTrackingStatus(trackingState.enabled);
      return trackingState.enabled;
    } else return true;
  };

  const stopTracking = async () => {
    if (locationTracking) {
      let trackingState = await BackgroundGeolocation.stop();
      setTrackingStatus(trackingState.enabled);
      return !trackingState.enabled;
    } else return true;
  };

  useEffect(() => {
    // Initialize BackgroundGeolocation,
    BackgroundGeolocation.ready(GeolocationConfig).then(
      async (state) => {
        console.log(
          'BackgroundGeolocation is ready. Current tracking state:',
          state.enabled,
        );
        setFeatureReady(true);
      },
      async (error) => {
        console.log('BackgroundGeolocation ready error', error);
      },
    );

    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, []);

  // Convert getCurrentPosition from BackgroundGeolocation to a promise.
  const getCurrentPositionRNCG = async (
    success?: (position: GeolocationResponse) => void,
    errorHandler?: ((error: GeolocationError) => void) | undefined,
    options?: GeolocationOptions,
  ) =>
    new Promise<GeolocationResponse>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          success && success(position);
          resolve(position);
        },
        (error) => {
          errorHandler && errorHandler(error);
          reject(error);
        },
        options,
      );
    });

  return (
    <LocationContext.Provider
      value={{
        locationFeatureReady,
        locationTracking,
        onLocationChange: (...args) =>
          BackgroundGeolocation.onLocation(...args),
        onMotionChange: (...args) =>
          BackgroundGeolocation.onMotionChange(...args),
        onActivityChange: (...args) =>
          BackgroundGeolocation.onActivityChange(...args),
        removeLocationListeners: (...args) =>
          BackgroundGeolocation.removeAllListeners(...args),
        getCurrentPositionBG: BackgroundGeolocation.getCurrentPosition,
        getCurrentPositionRNCG,
        startTrackingLocation: startTracking,
        stopTrackingLocation: stopTracking,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
