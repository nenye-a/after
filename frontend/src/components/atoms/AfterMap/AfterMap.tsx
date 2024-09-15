// import { useMemo } from 'react';
import { MapStyle } from '@/constants/mapstyle';
import { useOuting } from '@/context/OutingContext';
import { kmToLatLngDeltas } from '@/helpers/numbers';
import { useTheme } from '@/theme';
import { PropsWithChildren, useRef } from 'react';
import MapView, { MapViewProps } from 'react-native-maps';

type Props = MapViewProps & PropsWithChildren & {};

function AfterMap({ children, ...props }: Props) {
  const { layout } = useTheme();
  const { setCurrentCoordinates, currentCoordinates } = useOuting();

  const mapRef = useRef<MapView>(null);

  return (
    <MapView
      style={[layout.fullHeight, layout.fullWidth]}
      region={
        currentCoordinates
          ? {
              ...currentCoordinates,
              ...kmToLatLngDeltas(0.8, currentCoordinates),
            }
          : undefined
      }
      customMapStyle={MapStyle}
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
