import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import GlobalStyle from '../style';
import LoadingScreen from '../screens/loading';
import ErrorScreen from '../screens/error';
import { fetchParkhouses } from '../store/actions/parkhouses';
import ListItem from '../components/listItem';
import { sortParkhouses, groupParkhousesByCity } from '../helpers';
import NetInfo from '@react-native-community/netinfo';

/**
 * This is the first screen when launching the app.
 * It will shows all parkhouses sorted by name and filterable by city.
 *
 * @class HomeScreen
 * @extends {Component}
 */
class HomeScreen extends Component {
  unsubscribe = null;

  state = {
    selectedIndex: 0,
    // save all parkhouses indexed by city and sorted by name inside an object and save in state
    parkobjects: groupParkhousesByCity(
      sortParkhouses(this.props.parkhouses.parkhouses),
    ),
    mounted: false,
  };
  intervalId = null;

  constructor(props) {
    super(props);
    const that = this;
    // Start event listener to check for the current internet connection
    this.unsubscribe = NetInfo.addEventListener(state => {
      // If the state changes and isConnected is true try to update the parkhouses
      if (state.isConnected) {
        that.updateParkhouses(true, true);
      }
    });

    // Update the parkhouses every 60000 ms
    this.intervalId = setInterval(this.updateParkhouses, 60000);

    this.state = {
      ...this.state,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if the parkhouses array is filled
    // @todo refactor function and remove unnecessary logic
    if (
      typeof this.props.parkhouses.parkhouses !== typeof undefined &&
      this.props.parkhouses.parkhouses.length
    ) {
      // Check if the currently selected index changed and if the selected index is zero
      if (
        this.state.selectedIndex !== 0 &&
        prevState.selectedIndex !== this.state.selectedIndex
      ) {
        // Set the new index into state and filter all parkobjects after the given city filter
        this.handleIndexChange(this.state.selectedIndex);
      } else {
        // If it did not change if it zero, copy the whole parkhouses object as clone into the state
        const newParkobjects = this.buildFilteredParkobjects(
          this.state.selectedIndex,
        );
        if (
          JSON.stringify(newParkobjects) !==
          JSON.stringify(this.state.parkobjects)
        ) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            parkobjects: newParkobjects,
          });
        }
      }
    }
  }

  /**
   * Experimental function to login a user when using an apag://nupsi/RFID intent url which can be used to login with Nupsi (actually Mobility-Key)
   *
   * @param {String} url
   * @memberof HomeScreen
   */
  handleNupsiLogin(url) {
    if (typeof url !== typeof undefined && url !== null && url && url !== '') {
      const identifier = url.replace('apag://nupsi/', '').replace(/:/g, '');
      if (identifier !== '') {
        this.props.navigation.navigate('MeineAPAGLogin', {
          identifier,
        });
      }
    }
  }

  componentDidMount() {
    // Get the opening URL for the app so that intent urls can be handle like the Nupsi Login
    Linking.getInitialURL()
      .then(url => {
        this.handleNupsiLogin(url);
      })
      .catch(err => console.log(err));
    // Fetch all parkhouses
    this.updateParkhouses(true);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    // Unbined the event listener for the internet connection
    if (this.unsubscribe !== null) {
      this.unsubscribe();
    }
  }

  /**
   * Fetches the parkhouses and handles diplaying the spinner.
   * If componenDidMount or manual user interaction run this function mounting is true and renders the spinners.
   * If the interval is executing this function the spinner is shown.
   *
   * @param {Boolean} mounting
   * @param {Boolean} ignore
   * @memberof HomeScreen
   */
  updateParkhouses = (mounting, ignore) => {
    const that = this;
    const { mounted } = this.state;
    NetInfo.fetch().then(state => {
      // Verify if the user has internet or if it must be ignored because it is the initial mounting
      if (state.isConnected || ignore) {
        // mounted is only true if the parkhouses request is done
        if (mounting && mounted) {
          that.setState({ mounted: false });
        }
        let fetching = that.props.fetchParkhouses();
        if (mounting) {
          // Wait for request and set mounted to true
          fetching.then(() => {
            that.setState({ mounted: true });
          });
        }
      }
    });
  };

  /**
   * Filters all parkhouses by city and then sorts them again.
   *
   * @param {Number} i
   * @memberof HomeScreen
   */
  handleIndexChange = i => {
    this.setState({
      parkobjects: this.buildFilteredParkobjects(i),
      selectedIndex: i,
    });
  };

  /**
   * Build an array of parkhouses filtered by the city index
   *
   * @param {Number} i
   * @memberof HomeScreen
   */
  buildFilteredParkobjects = i => {
    let allCities = [
      'ALLE',
      ...Object.keys(
        groupParkhousesByCity(this.props.parkhouses.parkhouses),
      ).sort(),
    ];
    const { parkhouses } = this.props;
    const parkobjects = parkhouses.parkhouses;
    let parkFiltered = [];
    let filterKey = 'Bike-Station Bahnhof Schanz';
    if (i > 0) {
      filterKey = allCities[i];
      for (var k = 0; k < parkobjects.length; k++) {
        if (parkobjects[k].name === filterKey) {
          parkFiltered.push(parkobjects[k]);
        }
      }
    } else {
      parkFiltered = parkobjects;
    }
    return groupParkhousesByCity(sortParkhouses(parkFiltered));
  };

  render() {
    const { parkhouses, navigation } = this.props;
    const { parkobjects, mounted, selectedIndex } = this.state;
    const { isFetching } = parkhouses;
    // We do not need to wait for the fetch (isFetching) to complete if we have got the parkhouses in the Redux store.
    if (
      typeof parkobjects.Aachen !== typeof undefined &&
      !parkobjects.Aachen.length
    ) {
      return <LoadingScreen />;
    }
    // Get all cities as array for the current filter
    const cities = Object.keys(parkobjects);
    // Get all cities in total (unfiltered)
    const allCities = Object.keys(
      groupParkhousesByCity(this.props.parkhouses.parkhouses),
    ).sort();
    // Transform all city names to uppercase
    const upperCaseCities = allCities?.map(item => item.toUpperCase());
    // If not cities are found or if isFetching is true show a loading screen
    if (upperCaseCities.length === 0 && isFetching) {
      return <LoadingScreen />;
    }
    // Screen split by SegmentedControlTab from the react-native-segmented-control-tab package into multiple filtered subscreens
    // Inside is a normal ScrollView with a refresh control to update the current numbers of the parkhouses
    // Each parkhouse is of class ListItem
    // @todo replace SegmentedControlTab with createMaterialTopTabNavigator from react-navigation and remove the react-native-segmented-control-tab package

    console.log('uppercase cities', upperCaseCities);

    return (
      <View style={[GlobalStyle.wrapper, GlobalStyle.container]}>
        {upperCaseCities.length > 0 && (
          <SegmentedControlTab
            values={['ALLE', ...upperCaseCities]}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            allowFontScaling={false}
            tabsContainerStyle={GlobalStyle.segmentedControlTab}
            tabStyle={GlobalStyle.tabStyle}
            activeTabStyle={GlobalStyle.activeTabStyle}
            tabTextStyle={GlobalStyle.primaryTextColor}
            activeTabTextStyle={GlobalStyle.primaryTextColor}
          />
        )}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !mounted}
              onRefresh={() => this.updateParkhouses(false, true)}
              tintColor="#3A5998"
              colors={['#3A5998']}
            />
          }
          contentContainerStyle={[
            upperCaseCities.length === 0 && !isFetching
              ? GlobalStyle.container
              : {},
            { paddingBottom: 60 },
          ]}>
          {upperCaseCities.length === 0 && !isFetching && <ErrorScreen />}
          {cities?.map((city, index) => {
            return (
              <View key={city + 'scroll'}>
                {cities.length > 1 && (
                  <Text style={GlobalStyle.cityListItemText}>{city}</Text>
                )}

                {parkobjects[city]?.map((item, step) => (
                  <ListItem
                    parkobjects={parkobjects[city]}
                    key={'l' + item.id}
                    phid={item.id}
                    callMapFunc={this.callMapFunc}
                    navigation={navigation}
                    showNumbers={true}
                    selectedIndex={selectedIndex}
                  />
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    parkhouses: state.parkhouses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchParkhouses: params => dispatch(fetchParkhouses(params)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
