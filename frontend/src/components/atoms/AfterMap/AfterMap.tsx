// import { useMemo } from 'react';
import { PropsWithChildren } from 'react';
import MapView, { MapViewProps, Region } from 'react-native-maps';

// San francisco coordinates is the default region.
const defaultRegion: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

type Props = MapViewProps &
  PropsWithChildren & {
    // TODO: Add custom after map props.
  };

function AfterMap({
  children,
  initialRegion = defaultRegion,
  ...props
}: Props) {
  return (
    <MapView
      style={{
        height: 1000,
        width: 400,
      }}
      initialRegion={initialRegion}
      {...props}
    >
      {children}
    </MapView>
  );
}

export default AfterMap;
