// import { useMemo } from 'react';
import { MapStyle } from '@/constants/mapstyle';
import { useOuting } from '@/context/OutingContext';
import { useTheme } from '@/theme';
import { PropsWithChildren, useRef } from 'react';
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
  const { layout, colors } = useTheme();
  const { setCurrentCoordinates, addToOutingPath } = useOuting();

  const mapRef = useRef<MapView>(null);

  return (
    <MapView
      style={[layout.fullHeight, layout.fullWidth]}
      initialRegion={initialRegion}
      customMapStyle={MapStyle}
      // tintColor={colors.blue800}
      // provider="google"
      mapType="mutedStandard"
      showsUserLocation={true}
      followsUserLocation={true} // TODO: Make this togglable!
      userInterfaceStyle="dark"
      pitchEnabled={false}
      onUserLocationChange={(location) => {
        if (location.nativeEvent.coordinate) {
          setCurrentCoordinates(location.nativeEvent.coordinate);
        }
      }}
      {...props}
      ref={mapRef}
    >
      {children}
    </MapView>
  );
}

export default AfterMap;
