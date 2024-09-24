import React, { Component, useMemo } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import GlobalStyle, { white } from '../style';
import HousesMap from '../components/map';
import LoadingScreen from '../screens/loading';
import { getCityList, calcCenterCoordinate } from '../helpers';
import { fetchParkhouses } from '../store/actions/parkhouses';
import ErrorScreen from '../screens/error';
import ConsentMissing from '../components/consentMissing';
import Geolocation from '@react-native-community/geolocation';

/**
 * Renders all parkhouses on a map filterable by city.
 *
 * @class HousesMapScreen
 * @extends {Component}
 */
class HousesMapScreen extends Component {
  constructor(props) {
    super(props);

    // Calculate the center of the map based on the city Aachen and all parkobjects as default start center for the map
    this.state = {
      ...calcCenterCoordinate(this.props.parkhouses.parkhouses, 'Aachen'),
      filteredParkObjectsOnOptions: [],
    };
  }

  componentDidMount() {
    /////// In case the flow needs to be debugged ////////
    // this.props.dispatch(setIsInLaunchFlow(true));
    // this.props.dispatch(hasSeenLaunchLoginScreen(false));
    ///////////////////////
    this.props.fetchParkhouses();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      StatusBar.setBarStyle('dark-content');
    });
    this._unsubscribeBlur = this.props.navigation.addListener('blur', () => {
      StatusBar.setBarStyle('light-content');
    });
    if (this.props.navigation.isFocused()) {
      StatusBar.setBarStyle('dark-content');
    }
  }

  componentWillUnmount() {
    this._unsubscribe();
    this._unsubscribeBlur();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { parkhouses } = this.props;
    const { isFetching } = parkhouses;

    // If isFetching is true and there are parkhouses in the props calculate the center for Aachen and check those coordinates are not equal to the coordinates inside state
    // @todo do we really need this => seems like redundant rendering
    if (isFetching && parkhouses.parkhouses.length) {
      const coordinates = calcCenterCoordinate(
        this.props.parkhouses.parkhouses,
        'Aachen',
      );

      if (
        this.state.LONGITUDE !== coordinates.LONGITUDE ||
        this.state.LATITUDE !== coordinates.LATITUDE ||
        this.state.LATITUDE_DELTA !== coordinates.LATITUDE_DELTA ||
        this.state.LONGITUDE_DELTA !== coordinates.LONGITUDE_DELTA
      ) {
        this.setState(() => coordinates);
      }
    }
    if (prevProps.selectedOption !== this.props.selectedOption) {
      this.updateFilteredParkObjects();
    }
    if (
      prevProps.nearByPark !== this.props.nearByPark &&
      parkhouses.parkhouses.length
    ) {
      this.filterNearbyStations();
    }
  }

  updateFilteredParkObjects = () => {
    const { parkhouses, selectedOption } = this.props;

    // Filter park objects based on selected options
    const filteredParkObjects = parkhouses.parkhouses.filter(parkobject => {
      // Check if the park object matches any of the selected options based on type
      const matchesSelectedOption = selectedOption?.selectedOption?.some(
        option =>
          option.key?.toLowerCase() === parkobject.type?.toLowerCase() ||
          (option.key?.toLowerCase() === 'laden' && parkobject.type === 'car'),
      );

      // If it matches, check for the additional "Charging-Stations" logic for car type
      if (matchesSelectedOption && parkobject.type === 'car') {
        const chargingStationsOptionSelected =
          selectedOption?.selectedOption?.some(
            option => option.key?.toLowerCase() === 'laden',
          );

        // If "Charging-Stations" is selected, only include cars with charging stations
        if (chargingStationsOptionSelected) {
          return (
            parkobject.charging_stations &&
            parkobject.charging_stations.length > 0
          );
        } else {
          return parkobject.charging_stations.length === 0;
        }
      }

      // For non-car types or when no "Charging-Stations" filter applies, include as per the original logic
      return matchesSelectedOption;
    });

    // Update state with the filtered park objects
    this.setState({ filteredParkObjectsOnOptions: filteredParkObjects });
  };
  // Method to convert degrees to radians
  deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  // Method to calculate the distance between two latitude and longitude points
  getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };
  filterNearbyStations = () => {
    const { parkhouses, nearByPark } = this.props;

    const radiusInKm = 5; // Set the desired radius in kilometers
    Geolocation.getCurrentPosition(pos => {
      const userLat = pos.coords?.latitude;
      const userLong = pos.coords?.longitude;

      const filteredStations = parkhouses?.parkhouses?.filter(station => {
        const distance = this.getDistanceFromLatLonInKm(
          userLat,
          userLong,
          station?.latitude ?? station?.location?.latitude,
          station?.longitude ?? station?.location?.longitude,
        );

        if (distance > radiusInKm) {
          return false; // Skip if the station is outside the radius
        }

        // Filter based on nearByPark
        if (nearByPark?.nearByPark === 'car') {
          // Return car type parkhouses
          return station?.type === 'car';
        } else if (nearByPark?.nearByPark === 'bike') {
          // Return bike type parkhouses
          return station?.type === 'bike';
        } else if (nearByPark?.nearByPark === 'station') {
          // Return only car type parkhouses that have charging stations
          return (
            station?.type === 'car' && station?.charging_stations?.length > 0
          );
        }

        return false; // Default fallback, exclude the station if no conditions are met
      });

      this.setState({ filteredParkObjectsOnOptions: filteredStations });
    });
  };
  render() {
    const { parkhouses, navigation, consent, nearByPark } = this.props;
    const { filteredParkObjectsOnOptions } = this.state;
    const parkobjects = parkhouses.parkhouses;
    const { isFetching } = parkhouses;

    // Extract coordinates from state
    const { LATITUDE, LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA } = this.state;

    // If consent is not given for Google/Apple Maps do not display maps
    if (!consent.consent.settings.maps) {
      return (
        <ConsentMissing
          icon="map-marked-alt"
          text="Sie haben kein Einverständnis zur Verwendung von Google bzw. Apple
      Maps gegeben und die damit verbundene Weiterleitung von
      datenschutzrelevanten Informationen."
          navigation={navigation}
        />
      );
    }

    // We can use the parkobjects from the redux store until the fetch is finished. No need for watching isFetching to render.
    const upperCaseCities = getCityList(parkobjects);
    // Show loading screen if isFetching is true and there are no parkobjects
    if (upperCaseCities.length === 0 && isFetching) {
      return <LoadingScreen />;
    }
    // Show error screen if isFetching is false and there are no parkobjects
    if (upperCaseCities.length === 0 && !isFetching) {
      return <ErrorScreen />;
    }

    // Screen split by SegmentedControlTab package into multiple fileted subscreens
    // The segments do not filter the parkhouses instead the map scrolls to the location of the center of the parkobjects of the city
    return (
      <View style={[GlobalStyle.container, { backgroundColor: white }]}>
        <View
          style={[
            GlobalStyle.container,
            {
              borderBottomEndRadius: 30,
              borderBottomStartRadius: 30,
              overflow: 'hidden',
            },
          ]}>
          <HousesMap
            parkobjects={filteredParkObjectsOnOptions}
            clustering={true}
            navigation={navigation}
            ref={ref => (this.housesMap = ref)}
            LATITUDE={LATITUDE}
            LONGITUDE={LONGITUDE}
            LATITUDE_DELTA={LATITUDE_DELTA}
            LONGITUDE_DELTA={LONGITUDE_DELTA}
            showCallouts={true}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    parkhouses: state.parkhouses,
    consent: state.consent,
    selectedOption: state.mapParkSelect,
    nearByPark: state.searchPark,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchParkhouses: params => dispatch(fetchParkhouses(params)),
    dispatch: dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HousesMapScreen);
