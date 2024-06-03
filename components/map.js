import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  Image,
  Platform,
  Text,
  ImageBackground,
} from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps-super-cluster';
import GlobalStyle, { primaryBlue } from '../style';
import CustomMarker from './custommarker';
import IconFontawesome5 from 'react-native-vector-icons/FontAwesome5';
import { MapButton } from './mapButton';
import Geolocation from '@react-native-community/geolocation';

const window = Dimensions.get('window');
// Define some global settings for the map
const edgePadding = {
  top: 30,
  left: 20,
  right: 20,
  bottom: Platform.OS !== 'android' ? 10 : 0,
};
/**
 * Renders a react-native-map with a marker for every parkhouse
 * Uses react-native-maps-super-cluster in order to group near by parkhouses together when zooming out
 *
 * @class HousesMap
 * @extends {Component}
 */

// static propTypes = {
//   clustering: PropTypes.bool.isRequired,
//   parkobjects: PropTypes.array,
//   showCallouts: PropTypes.bool,
//   target: PropTypes.object,
//   include: PropTypes.array,
//   height: PropTypes.number,
//   LATITUDE: PropTypes.number,
//   LONGITUDE: PropTypes.number,
//   LATITUDE_DELTA: PropTypes.number,
//   LONGITUDE_DELTA: PropTypes.number,
//   city: PropTypes.object,
// };

// Preload all images here otherwise there are rendering issues
// The images need to be prerendered as display none here because react-native-maps as problems loading the images correctly on first load
const image1 = require('../assets/img/pin.png');
const image2 = require('../assets/img/pin_pp.png');
const image3 = require('../assets/img/cluster.png');
const image4 = require('../assets/img/pin_blanko.png');

const HousesMap = ({
  LATITUDE,
  LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  parkobjects,
  clustering,
  height,
  target,
  showCallouts,
  navigation,
  include,
  hasLocation,
  numbered,
}) => {
  const mapRef = useRef(null);
  // Only update the parkhouses and map center if the initial rendering is done on Android)
  const [isReady, setIsReady] = useState(true);

  const requestLocationPermission = async () => {
    Geolocation.getCurrentPosition(
      pos => {
        mapRef?.current.mapview.animateToRegion(
          {
            ...pos.coords,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          2000,
        );
      },
      error => {},
    );
  };

  useEffect(() => {
    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapRef?.current?.mapview.animateToRegion(
      {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      2000,
    );
  }, [LATITUDE, LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA]);

  const renderMarker = item => (
    <CustomMarker
      key={'cmarker' + item.id}
      showCallouts={showCallouts}
      navigation={navigation}
      include={include}
      hasLocation={hasLocation}
      numbered={numbered}
      item={item}
    />
  );

  const renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;
    return Platform.OS === 'android' ? (
      <Marker
        coordinate={coordinate}
        onPress={onPress}
        key={clusterId}
        anchor={Platform.OS === 'android' ? { x: 0.5, y: 1 } : null}
        tracksViewChanges={isReady}>
        <View style={[GlobalStyle.centerContent, { height: 50 }]}>
          <Image
            imageStyle={{ resizeMode: 'contain' }}
            source={require('../assets/img/cluster.png')}
            style={[GlobalStyle.pin, { position: 'absolute', top: 0, left: 0 }]}
          />
          <Text
            allowFontScaling={false}
            style={[
              GlobalStyle.parkhouseTitle,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                paddingLeft: pointCount > 9 ? 18 : 21,
                position: 'absolute',
                top: 0,
                left: 0,
                paddingTop: Platform.OS == 'android' ? 25 : 27,
                fontSize: pointCount > 9 ? 12 : 14,
              },
            ]}>
            {pointCount}
          </Text>
        </View>
      </Marker>
    ) : (
      <Marker
        coordinate={coordinate}
        onPress={onPress}
        key={clusterId}
        anchor={Platform.OS === 'android' ? { x: 0.5, y: 1 } : null}
        tracksViewChanges={isReady}>
        <View style={[GlobalStyle.centerContent]}>
          <ImageBackground
            imageStyle={{ resizeMode: 'contain' }}
            source={require('../assets/img/cluster.png')}
            style={GlobalStyle.pin}>
            <Text
              allowFontScaling={false}
              style={[
                GlobalStyle.parkhouseTitle,
                {
                  paddingLeft: pointCount > 9 ? 18 : 21,
                  paddingTop: Platform.OS == 'android' ? 25 : 27,
                  fontSize: pointCount > 9 ? 12 : 14,
                },
              ]}>
              {pointCount}
            </Text>
          </ImageBackground>
        </View>
      </Marker>
    );
  };

  /**
   * Before passing all parkobjects to the map transform some data like adding a property location passed on the coordinates
   *
   * @param {Array} parkobjects
   * @memberof HousesMap
   */
  const preprocessData = parkobjects => {
    for (var i = 0; i < parkobjects.length; i++) {
      parkobjects[i].location = {
        latitude: parseFloat(parkobjects[i].latitude),
        longitude: parseFloat(parkobjects[i].longitude),
      };
    }
    return parkobjects;
  };

  /**
   * Is called when the map is rendered completely
   *
   * @memberof HousesMap
   */
  const ready = () => {
    setIsReady(false);
  };

  // Completely relies on the MapView
  // Renders target marker if passed (only used by LadenScreen)
  return (
    <View
      style={
        typeof height !== typeof undefined ? { height } : GlobalStyle.container
      }>
      <View style={GlobalStyle.displayNone}>
        <Image source={image1} />
        <Image source={image2} />
        <Image source={image3} />
        <Image source={image4} />
      </View>
      <MapView
        radius={window.height * 0.04}
        style={GlobalStyle.container}
        ref={mapRef}
        showsUserLocation
        showsMyLocationButton
        userLocationAnnotationTitle={'Aktueller Standort'}
        clusteringEnabled={clustering}
        renderMarker={renderMarker}
        edgePadding={edgePadding}
        renderCluster={renderCluster}
        data={preprocessData(parkobjects)}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onMapReady={ready}>
        {target != null && typeof target !== typeof undefined ? (
          <Marker
            identifier={target.place_id}
            key={target.place_id}
            coordinate={{
              latitude: parseFloat(target.geometry.location.lat),
              longitude: parseFloat(target.geometry.location.lng),
            }}
          />
        ) : (
          <View />
        )}
      </MapView>
      <View style={{ top: 50, right: 15, position: 'absolute' }}>
        <MapButton onPress={requestLocationPermission}>
          <IconFontawesome5 name="crosshairs" size={22} color={primaryBlue} />
        </MapButton>
        {/* <MapButton>
          <IconFontawesome5 name="eye" size={22} color={primaryBlue} />
        </MapButton> */}
      </View>
    </View>
  );
};

export default HousesMap;
