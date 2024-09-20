///@TODO2- few issue here

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Dimensions,
  Image,
  Platform,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps-super-cluster';
import GlobalStyle, {
  black,
  creamColor,
  lightGrey,
  lightGrey200,
  placeholderColor,
  primaryBlue,
  white,
} from '../style';
import CustomMarker from './custommarker';
import IconFontawesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MapButton } from './mapButton';
import Geolocation from '@react-native-community/geolocation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Divider } from 'react-native-paper';
import { placeholder } from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

const window = Dimensions.get('window');
// Define some global settings for the map
const edgePadding = {
  top: 30,
  left: 20,
  right: 20,
  bottom: Platform.OS !== 'android' ? 10 : 0,
};
const parkingOptions = [
  { id: 1, title: 'Parken', iconName: 'local-parking' },
  { id: 2, title: 'Laden', iconName: 'charging-station' },
  { id: 3, title: 'Bike-Stations', iconName: 'pedal-bike' },
];
const mapOptions = [
  { id: 1, title: 'Reduziert', value: 'reduced' },
  { id: 2, title: 'Normal', value: 'standard' },
  { id: 3, title: 'Satelit', value: 'hybrid' },
];
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
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
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  // Only update the parkhouses and map center if the initial rendering is done on Android)
  const [isReady, setIsReady] = useState(true);
  const { selectedOption } = useSelector(state => state.mapParkSelect);

  const parkObjectsSheetRef = useRef(null);
  const [isParkObjectSheetVisible, setIsParkObjectSheetVisible] =
    useState(false);

  const snapPoints = useMemo(() => ['25%', '44%'], []);
  const rotateSv = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-Dimensions.get('window').height * 0.5);
  let isModalOpening = false;
  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      isModalOpening = false;
      const timeOut = setTimeout(() => {
        setIsParkObjectSheetVisible(false);
      }, 500);
      clearTimeout(timeOut);
      isModalOpening = false;
      opacity.value = withTiming(0, {
        duration: 1000,
        easing: Easing.in(Easing.exp),
      });
      translateY.value = withTiming(-Dimensions.get('window').height * 0.5, {
        duration: 1000,
        easing: Easing.in(Easing.exp),
      });
    } else {
      setIsParkObjectSheetVisible(true);
    }
  }, []);
  const handleOpenBottomSheet = useCallback(() => {
    isModalOpening = true;
    parkObjectsSheetRef.current?.present();
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    translateY.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, []);
  const handleCloseBottomSheet = useCallback(() => {
    isModalOpening = false;
    opacity.value = withTiming(0, {
      duration: 1000,
      easing: Easing.in(Easing.exp),
    });
    translateY.value = withTiming(-Dimensions.get('window').height * 0.5, {
      duration: 1000,
      easing: Easing.in(Easing.exp),
    });

    parkObjectsSheetRef.current?.close();
    // setTimeout(() => {
    //   setIsParkObjectSheetVisible(false);
    // }, 1000);
  }, []);

  const animatedRotationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${
          isModalOpening ? -rotateSv.value * 180 : rotateSv.value * 180
        }deg`,
      },
    ],
  }));

  // Animated style for the opacity and position
  const animatedStyleCrossFadeIn = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  const [selectedParkingOption, setSelectedParkingOptions] = useState([
    { key: 'car', value: 'Parken' },
    { key: 'laden', value: 'Laden' },
    { key: 'bike', value: 'Bike-Stations' },
  ]);

  const [selectedMapOption, setSelectedMapOption] = useState('reduced');

  const handleParkingOption = optionKey => {
    const optionExists = selectedParkingOption.some(
      selectedOption => selectedOption.value === optionKey,
    );

    if (optionExists) {
      const updatedOptions = selectedParkingOption.filter(
        selectedOption => selectedOption.value !== optionKey,
      );
      setSelectedParkingOptions(updatedOptions);
    } else {
      const updatedOptions = [
        ...selectedParkingOption,
        {
          key:
            optionKey === 'Parken'
              ? 'car'
              : optionKey === 'Bike-Stations'
              ? 'bike'
              : 'laden',
          value: optionKey,
        },
      ];
      setSelectedParkingOptions(updatedOptions);
    }
  };
  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_OPTION', payload: selectedParkingOption });
  }, [selectedParkingOption]);

  const requestLocationPermission = async () => {
    Geolocation.getCurrentPosition(
      pos => {
        mapRef?.current?.mapview?.animateToRegion(
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
  var mapStyleNormal = [
    {
      featureType: 'administrative',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#bdbdbd',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#878c8c',
        },
      ],
    },
  ];
  var mapStyleReduced = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#eff3fb',
        },
      ],
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f5f5',
        },
      ],
    },
    {
      featureType: 'administrative',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#bdbdbd',
        },
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
  ];
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
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <MapView
          radius={window.height * 0.04}
          style={GlobalStyle.container}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          showsUserLocation
          showsBuildings={selectedMapOption !== 'reduced'}
          showsMyLocationButton={false}
          customMapStyle={
            selectedMapOption === 'reduced' ? mapStyleReduced : mapStyleNormal
          }
          userLocationAnnotationTitle={'Aktueller Standort'}
          clusteringEnabled={clustering}
          renderMarker={renderMarker}
          edgePadding={edgePadding}
          renderCluster={renderCluster}
          mapType={
            selectedMapOption === 'reduced' ? 'standard' : selectedMapOption
          }
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
      </View>
      <View style={{ top: 50, right: 15, position: 'absolute' }}>
        <MapButton onPress={requestLocationPermission}>
          <IconFontawesome5 name="crosshairs" size={22} color={primaryBlue} />
        </MapButton>
        <MapButton onPress={() => handleOpenBottomSheet()}>
          <IconFontawesome5 name="eye" size={22} color={primaryBlue} />
        </MapButton>
      </View>
      {isParkObjectSheetVisible ? (
        <Animated.View
          style={[animatedStyleCrossFadeIn, styles.closeIconContainer]}>
          <AnimatedTouchableOpacity
            style={[{ flex: 1 }]}
            entering={FadeIn.duration(400)}
            onPress={() => handleCloseBottomSheet()}>
            <AnimatedIonicons
              style={animatedRotationStyle}
              name="close"
              size={24}
              color={primaryBlue}
            />
          </AnimatedTouchableOpacity>
        </Animated.View>
      ) : null}
      <BottomSheetModalProvider>
        <View>
          <BottomSheetModal
            ref={parkObjectsSheetRef}
            index={1}
            snapPoints={snapPoints}
            enableOverDrag={false}
            handleComponent={() => null}
            enableDismissOnClose={true}
            animationConfigs={{
              duration: 1200,
              easing: Easing.out(Easing.exp),
            }}
            style={{ zIndex: 1 }}
            onDismiss={() => handleCloseBottomSheet()}
            onChange={handleSheetChanges}>
            <BottomSheetView
              style={{
                flex: 1,
                paddingTop: 28,
              }}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 16,
                    gap: 12,
                    marginHorizontal: 18,
                  }}>
                  {parkingOptions.map(item => (
                    <View
                      key={item.id}
                      style={[
                        selectedParkingOption.some(
                          selectedOption => selectedOption.value === item.title,
                        )
                          ? styles.selectedParkingStyle
                          : styles.parkingStyleContainer,
                        selectedParkingOption.some(
                          selectedOption => selectedOption.value === item.title,
                        )
                          ? styles.shadowStyle
                          : {},
                        { height: 120, flex: 1 },
                      ]}>
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        {item?.iconName === 'charging-station' ? (
                          <FontAwesome5
                            name="charging-station"
                            size={28}
                            color={
                              selectedParkingOption.some(
                                selectedOption =>
                                  selectedOption.value === item.title,
                              )
                                ? white
                                : placeholderColor
                            }
                          />
                        ) : (
                          <MaterialIcon
                            name={item.iconName}
                            size={item.iconName === 'pedal-bike' ? 34 : 24}
                            color={
                              selectedParkingOption.some(
                                selectedOption =>
                                  selectedOption.value === item.title,
                              )
                                ? white
                                : placeholderColor
                            }
                            style={
                              item.iconName === 'local-parking'
                                ? {
                                    borderWidth: 4,

                                    borderColor: selectedParkingOption.some(
                                      selectedOption =>
                                        selectedOption.value === item.title,
                                    )
                                      ? white
                                      : placeholderColor,
                                    borderRadius: 4,
                                  }
                                : {}
                            }
                          />
                        )}
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: selectedParkingOption.some(
                              selectedOption =>
                                selectedOption.value === item.title,
                            )
                              ? white
                              : lightGrey,
                            marginTop: 12,
                            paddingHorizontal: 16,
                            fontSize: 10,
                          }}>
                          {item.title}{' '}
                        </Text>
                        <ToggleSwitch
                          initialValue={selectedParkingOption.some(
                            selectedOption =>
                              selectedOption.value === item.title,
                          )}
                          disabled={true}
                          onToggle={() => {
                            handleParkingOption(item?.title);
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <View style={{}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: 18,
                      marginVertical: 12,
                      paddingRight: 8,
                    }}>
                    <View style={styles.borderStyle} />
                    <Text
                      style={{
                        paddingHorizontal: 6,
                        fontFamily: 'Roboto-Bold',
                        fontWeight: 'bold',
                        color: placeholderColor,
                      }}>
                      KARTE
                    </Text>
                    <View style={styles.borderStyle} />
                  </View>
                  <View
                    style={[
                      styles.shadowStyle,
                      {
                        backgroundColor: creamColor,
                        paddingVertical: 8,
                        marginHorizontal: 18,
                        borderRadius: 12,
                        shadowOpacity: 0.2,
                      },
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      {mapOptions.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          activeOpacity={0.9}
                          onPress={() => setSelectedMapOption(item.value)}>
                          <View
                            style={[
                              selectedMapOption === item.value
                                ? {
                                    backgroundColor: primaryBlue,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                    shadowColor: primaryBlue,
                                  }
                                : {},
                              selectedMapOption === item.value
                                ? [styles.shadowStyle]
                                : {},
                              {
                                paddingVertical: 12,
                                paddingHorizontal: 24,
                                minWidth: '28%',
                              },
                            ]}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: 'Roboto-Bold',
                                fontWeight: 'bold',
                                color:
                                  selectedMapOption === item.value
                                    ? white
                                    : primaryBlue,
                              }}>
                              {item.title}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </View>
  );
};
export const ToggleSwitch = ({ onToggle, initialValue = false, disabled }) => {
  const [isOn, setIsOn] = useState(initialValue);

  useEffect(() => {
    setIsOn(initialValue);
  }, [initialValue]);
  return (
    <TouchableOpacity
      style={[styles.switch, isOn ? styles.on : styles.off]}
      onPress={onToggle}>
      <View
        style={[
          styles.circle,
          isOn ? styles.circleOn : styles.circleOff,
        ]}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 36,
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 4,
    marginVertical: 8,
  },
  on: {
    backgroundColor: white,
  },
  off: {
    backgroundColor: placeholderColor,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 14,
    backgroundColor: primaryBlue,
  },
  circleOn: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOff: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
  },
  shadowStyle: {
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  borderStyle: {
    flex: 1,
    height: 1,
    backgroundColor: placeholderColor,
  },
  selectedParkingStyle: {
    backgroundColor: primaryBlue,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 3,
    borderColor: primaryBlue,
    alignItems: 'center',
  },
  parkingStyleContainer: {
    backgroundColor: white,
    borderRadius: 12,
    paddingVertical: 12,
    borderColor: '#E0E6EE',
    borderWidth: 3,
    alignItems: 'center',
  },
  closeIconContainer: {
    position: 'absolute',
    top: '53%',
    alignSelf: 'center',
    zIndex: 1000,
    backgroundColor: white,
    justifyContent: 'center',
    borderRadius: 24,
    padding: 10,
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
export default HousesMap;
