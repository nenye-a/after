import { MapStyle } from '@/constants/mapstyle';
import { useMapSheet } from '@/context/MapSheetContext';
import { useOuting } from '@/context/OutingContext';
import { calculateCoordinateRegion, kmToLatLngDeltas } from '@/helpers/map';
import { useTheme } from '@/theme';
import { PropsWithChildren, useMemo, useRef } from 'react';
import MapView, {
  Callout,
  MapViewProps,
  Marker,
  Polyline,
} from 'react-native-maps';
import randomColor from 'randomcolor';
import { View } from 'react-native';
import AfterText from '../AfterText/AfterText';
import SupportTextWithIcon from '../AfterText/SupportTextWithIcon';
import Icon from 'react-native-vector-icons/Feather';
import { generateDurationString, getLocalTime } from '@/helpers/dates';

type Props = MapViewProps & PropsWithChildren & {};

function AfterTooltip({ children }: PropsWithChildren) {
  const { backgrounds, borders, gutters } = useTheme();
  return (
    <View
      style={[
        { borderRadius: 12, maxWidth: 400 },
        backgrounds.blue700,
        borders.gray100,
        borders.w_1,
        gutters.paddingVertical_4,
        gutters.paddingHorizontal_8,
      ]}
    >
      {children}
    </View>
  );
}

function AfterPolyline({ coordinates }: { coordinates: any[] }) {
  return (
    <Polyline
      coordinates={coordinates}
      strokeColor="white"
      strokeWidth={1}
      lineDashPattern={[2, 5]}
    />
  );
}

function AfterMap({ children, ...props }: Props) {
  const { layout, colors, backgrounds, borders, gutters } = useTheme();
  const {
    setCurrentCoordinates,
    currentCoordinates,
    pastOutings,
    activeOutingLocations,
    activeOutingPath,
  } = useOuting();
  const { mapSheetPage, currentPastOuting } = useMapSheet();

  const mapRef = useRef<MapView>(null);

  const mapActiveOutingLocations = useMemo(() => {
    return activeOutingLocations
      .sort(
        (a, b) =>
          new Date(b.arrival_time).getTime() -
          new Date(a.arrival_time).getTime(),
      )
      .map((location, index) => {
        return (
          <Marker
            key={location._id}
            coordinate={location.coordinates}
            pinColor={index === 0 ? colors.blue500 : colors.gray100}
          >
            <Callout tooltip>
              <AfterTooltip>
                <AfterText fontType="regular">
                  {location.nickname ?? location.name}
                </AfterText>
                <SupportTextWithIcon
                  customIcon={
                    <Icon name="clock" size={10} color={colors.gray300} />
                  }
                  text={
                    location.departure_time
                      ? generateDurationString(
                          location.departure_time,
                          location.arrival_time,
                        )
                      : `Here since ${getLocalTime(location.arrival_time)}`
                  }
                />
              </AfterTooltip>
            </Callout>
          </Marker>
        );
      });
  }, [activeOutingLocations]);

  const mapActiveOutingPath = useMemo(() => {
    return (
      <AfterPolyline
        key={activeOutingPath.map((path) => path._id).join('')}
        coordinates={activeOutingPath
          .sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
          )
          .map((path) => path.coordinates)}
      />
    );
  }, [activeOutingPath]);

  const mapPastOutings = useMemo(
    () =>
      pastOutings
        .filter(
          (outing) =>
            !currentPastOuting || outing._id === currentPastOuting._id,
        )
        .map((outing) => {
          let outingColor = randomColor({
            luminosity: 'bright',
            format: 'rgba',
          });
          return [
            outing.locations.map((location, index) => {
              return (
                <Marker
                  key={location._id}
                  coordinate={location.coordinates}
                  pinColor={outingColor}
                >
                  <Callout tooltip>
                    <AfterTooltip>
                      <SupportTextWithIcon
                        customIcon={
                          <Icon name="clock" size={10} color={colors.gray300} />
                        }
                        text={generateDurationString(
                          location.departure_time,
                          location.arrival_time,
                        )}
                      />
                      <AfterText fontType="regular">
                        {location.nickname ?? location.name}
                      </AfterText>
                      <AfterText fontType="minor">
                        {outing.name} (Spot {index + 1})
                      </AfterText>
                    </AfterTooltip>
                  </Callout>
                </Marker>
              );
            }),
            <AfterPolyline
              key={outing._id}
              coordinates={outing.path
                .sort(
                  (a, b) =>
                    new Date(b.time).getTime() - new Date(a.time).getTime(),
                )
                .map((path) => path.coordinates)}
            />,
          ];
        }),
    [pastOutings, mapSheetPage, currentPastOuting],
  );

  let region = currentPastOuting?.locations.length
    ? (calculateCoordinateRegion(
        [
          ...currentPastOuting.locations.map((l) => l.coordinates),
          ...currentPastOuting.path.map((p) => p.coordinates),
        ].flat(),
      ) ?? undefined)
    : currentCoordinates
      ? {
          ...currentCoordinates,
          ...kmToLatLngDeltas(10, currentCoordinates),
        }
      : undefined;

  return (
    <MapView
      style={[layout.fullHeight, layout.fullWidth]}
      // initialRegion={region}
      region={region}
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
      {['Past Outings', 'Outing Detail'].includes(mapSheetPage)
        ? mapPastOutings.flat()
        : mapSheetPage === 'Active Outing'
          ? [...mapActiveOutingLocations, mapActiveOutingPath]
          : null}
      {children}
    </MapView>
  );
}

export default AfterMap;
