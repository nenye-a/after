// import { useMemo } from 'react';
import MapView, { MapViewProps, Region } from 'react-native-maps';

type Props = MapViewProps & {
  // TODO: Add custom after map props.
};

function AfterMap({ ...props }: Props) {
  let testRegion: Region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapView
      style={{
        height: 1000,
        width: 400,
      }}
      initialRegion={testRegion}
      {...props}
    ></MapView>
  );
}

export default AfterMap;
