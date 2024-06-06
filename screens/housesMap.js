import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import GlobalStyle, { white } from '../style';
import HousesMap from '../components/map';
import LoadingScreen from '../screens/loading';
import { getCityList, calcCenterCoordinate } from '../helpers';
import { fetchParkhouses } from '../store/actions/parkhouses';
import ErrorScreen from '../screens/error';
import ConsentMissing from '../components/consentMissing';

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
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(() => coordinates);
      }
    }
  }

  render() {
    const { parkhouses, navigation, consent } = this.props;
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
            parkobjects={parkobjects}
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchParkhouses: params => dispatch(fetchParkhouses(params)),
    dispatch: dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HousesMapScreen);
