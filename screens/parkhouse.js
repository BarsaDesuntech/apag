import React, { Component } from 'react';
import {
  Text,
  View,
  RefreshControl,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { StackedAreaChart, XAxis, YAxis } from 'react-native-svg-charts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';
import { fetchParkhouse } from '../store/actions/parkhouses';
import ParkhouseHeader from '../components/parkhouseHeader';
import CrazyChart from '../components/crazyChart';
import ParkhouseChargeList from '../components/parkhouseChargelist';
import ParkhouseServicesList from '../components/parkhouseServicesList';
import LoadingScreen from './loading';
import PagerView from 'react-native-pager-view';

import { withParkhouse } from '../helpers';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import { AllHtmlEntities } from 'html-entities';
import { PageIndicator } from 'react-native-page-indicator';
const STATUS_BAR_HEIGHT = getStatusBarHeight();
const WINDOW_WIDTH = Dimensions.get('window').width;
const HEADER_MAX_HEIGHT = (WINDOW_WIDTH / 16) * 9;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 64 : 56;
const HEADER_SCROLL_DISTANCE =
  HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - (isIphoneX() ? STATUS_BAR_HEIGHT : 0);
const entities = new AllHtmlEntities();

/**
 * Details page of one parkhouse including history, services location and more.
 *
 * @class ParkhouseScreen
 * @extends {Component}
 */
class ParkhouseScreen extends Component {
  static propTypes = {
    phid: PropTypes.string,
    parkhouses: PropTypes.object,
    parkhouse: PropTypes.object,
  };

  state = {
    mounted: false,
    // Define an animated variable for scrolling in Y direction
    scrollY: new Animated.Value(
      // iOS has negative initial scroll value because content inset...
      Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
    ),
    interval: false,
    manual: false,
    scrollableHeight: 0,
    viewHeight: 0,
    marginBottom: 0,
    currentSelectedViewPage: 0,
  };
  intervalId = null;

  constructor(props) {
    super(props);

    this.intervalId = setInterval(this.updateParkhouse, 60000);

    this.state = {
      ...this.state,
    };
  }

  componentDidMount() {
    // Fetch current parkhouses
    this.updateParkhouse(true);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  /**
   * Fetches the parkhouse and handles diplaying the spinner.
   * If componenDidMount or manual user interaction run this function mounting is true and renders the spinners.
   *
   * @param {Boolean} mounting
   * @memberof ParkhouseScreen
   */
  updateParkhouse = mounting => {
    const that = this;
    const { route } = this.props;
    const { mounted } = this.state;

    // Does happen when triggering update manually by dragging down
    if (mounting && mounted) {
      this.setState({ manual: true });
    }
    if (!mounting && mounted) {
      this.setState({ interval: true });
    }
    const { phid } = route.params;
    const fetching = this.props.fetchParkhouse({ phid });
    if (mounting) {
      fetching.then(() => {
        that.setState({ mounted: true, manual: false });
      });
    }
  };

  /**
   * Return a PagerDotIndicator
   *
   * @returns
   * @memberof ParkhouseScreen
  //  */
  // renderDotIndicator() {
  //   return (
  //     <PagerDotIndicator
  //       pageCount={3}
  //       dotStyle={GlobalStyle.secondaryBackgroundColor}
  //       selectedDotStyle={GlobalStyle.primaryBackgroundColor}
  //     />
  //   );
  // }

  /**
   * Build an object which is the data basis for the graphs on a parkhouse page
   *
   * @param {Object} data - Data indexed by time
   * @param {String} index - The key which will be the prefix for the resulting object values
   * @returns Object
   * @memberof ParkhouseScreen
   */
  formatData(data, index) {
    let array = [];
    const times = data ? Object.keys(data) : [];

    for (var i = 0; i < times.length; i++) {
      array.push({ time: times[i], percent: data[times[i]] });
    }

    let value = {};
    value[index + 'Times'] = times;
    value[index] = array;
    return value;
  }
  /**
   * Update the scrollableHeight property from state based on the current ScrollView height
   *
   * @param {Number} width
   * @param {Number} height
   * @memberof ParkhouseScreen
   */
  setScrollableHeight = (width, height) => {
    this.setState({ scrollableHeight: height });
    this.checkFullHeight(this.state.viewHeight, height);
  };
  /**
   * Update the height property from state based on the device window height
   *
   * @param {Number} width
   * @param {Number} height
   * @memberof ParkhouseScreen
   */
  setHeight = event => {
    const { height } = event.nativeEvent.layout;
    this.setState({ viewHeight: height });
    this.checkFullHeight(height, this.state.scrollableHeight);
  };
  /**
   * Update the bottom margin to artificially generate as the diefference of the HEADER_SCROLL_DISTANCE, the ScrollView height and device height
   *
   * @param {Number} viewHeight
   * @param {Number} scrollableHeight
   * @memberof ParkhouseScreen
   */
  checkFullHeight = (viewHeight, scrollableHeight) => {
    const { marginBottom } = this.state;
    if (
      marginBottom === 0 &&
      scrollableHeight - viewHeight < HEADER_SCROLL_DISTANCE &&
      scrollableHeight !== 0 &&
      viewHeight !== 0
    ) {
      this.setState({
        marginBottom: HEADER_SCROLL_DISTANCE - (scrollableHeight - viewHeight),
      });
    }
  };
  render() {
    const { parkhouse } = this.props;
    const { manual, marginBottom } = this.state;
    const item = parkhouse;

    // Render the screen when the parkhouse is inside the Redux store. It will naturally rerender when the fetch is through. We do not need to wait for isFetching.
    if (item == null) {
      return <LoadingScreen />;
    }
    // Define and extract some default variables to render
    const { parkhouses } = this.props;
    const { isFetching } = parkhouses;
    const { auslastung, auslastungTimes } = this.formatData(
      item.history,
      'auslastung',
    );
    const { prognose, prognoseTimes } = this.formatData(
      item.predict,
      'prognose',
    );
    const colors = ['#3f6cb1'];
    const keys = ['percent'];
    const crazyChartHours = [0, 6, 12, 18, 24];
    const weekDays = ['Zeit', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const weekDaysFakeValues = [0, 1, 2, 3, 4, 5, 6, 7];
    // Intialize the animated scrolling variable
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    // Check if there is a default message like a warning of the parkhouse
    const hasMessage = typeof parkhouse.message !== typeof undefined;
    // Complex ScrollView which intialize some state variable which handle the animated scrolling of the header and title
    // Every information displayed for a parkhouse is divided in sections by simple "View" classes
    // The graphs use the react-native-svg-charts package
    // The graph container uses the IndicatorViewPager to make the container between the graphs scrollable
    // The animated variable is passed to the ParkhouseHeader class in order to let the font scale and blur the image. This has to be done because the ScrollView is inside of another scope
    // @todo implement all those sections in separated smaller sub classes (mostly the graphs are still directly inside here)

    return (
      <View style={GlobalStyle.container} onLayout={this.setHeight}>
        <Animated.ScrollView
          onContentSizeChange={this.setScrollableHeight}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && manual}
              onRefresh={() => this.updateParkhouse(true)}
              progressViewOffset={HEADER_MAX_HEIGHT}
              tintColor="#3A5998"
              colors={['#3A5998']}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={1}
          style={[GlobalStyle.container, GlobalStyle.whiteBackground]}
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
              marginBottom: marginBottom,
            }}>
            {hasMessage && (
              <View
                style={[
                  GlobalStyle.yellowBackground,
                  GlobalStyle.noticePadding,
                ]}>
                <Text style={GlobalStyle.whiteFont}>{item.message}</Text>
              </View>
            )}
            <View style={GlobalStyle.parkhouseOpeningTimes}>
              <Text style={GlobalStyle.parkhouseSubTitle2}>
                {(item.hight_limit !== '-' ? item.hight_limit + ' - ' : '') +
                  item.opening_times}
              </Text>
            </View>
            {!hasMessage && (
              <View style={GlobalStyle.parkhouseChartContainer}>
                {/* // style={GlobalStyle.h180}
                  // indicator={this.renderDotIndicator()}
                  // autoPlayEnable={false}
                  // autoPlayInterval={6000} */}

                <PagerView
                  collapsable={false}
                  initialPage={0}
                  onPageSelected={e =>
                    this.setState({
                      currentSelectedViewPage: e.nativeEvent.position,
                    })
                  }>
                  <View key={'1'}>
                    <Text
                      style={[
                        GlobalStyle.primaryTextColor,
                        GlobalStyle.parkhouseHeading,
                        GlobalStyle.pb10,
                      ]}>
                      Verlauf der Auslastung in %
                    </Text>
                    <StackedAreaChart
                      style={GlobalStyle.crazyChartStyle}
                      data={auslastung}
                      yMax={100}
                      keys={keys}
                      colors={colors}
                      showGrid={false}
                      animate={false}
                      svgs={[
                        {
                          strokeWidth: 5,
                          stroke: '#3f6cb1',
                        },
                      ]}
                    />
                    <XAxis
                      data={auslastung}
                      svg={{ fontSize: 10, fill: '#717171' }}
                      contentInset={{ left: 30 }}
                      style={GlobalStyle.parkhouseAxisPadding}
                      numberOfTicks={auslastung.length / 2}
                      formatLabel={(value, index) => auslastungTimes[index * 2]}
                    />
                  </View>
                  <View key={'2'}>
                    <Text
                      style={[
                        GlobalStyle.primaryTextColor,
                        GlobalStyle.parkhouseHeading,
                        GlobalStyle.pb10,
                      ]}>
                      Prognose der Auslastung in %
                    </Text>
                    <StackedAreaChart
                      style={GlobalStyle.crazyChartStyle}
                      data={prognose}
                      yMax={100}
                      keys={keys}
                      colors={colors}
                      showGrid={false}
                      animate={true}
                      svgs={[
                        {
                          strokeWidth: 5,
                          stroke: '#3f6cb1',
                        },
                      ]}
                    />
                    <XAxis
                      data={prognose}
                      svg={{ fontSize: 10, fill: '#717171' }}
                      contentInset={{ left: 30 }}
                      style={GlobalStyle.parkhouseAxisPadding}
                      numberOfTicks={prognose.length / 2}
                      formatLabel={(value, index) => prognoseTimes[index * 2]}
                    />
                  </View>
                  <View key={'3'}>
                    <Text
                      style={[
                        GlobalStyle.primaryTextColor,
                        GlobalStyle.parkhouseHeading,
                        GlobalStyle.pb10,
                      ]}>
                      Wochenübersicht
                    </Text>
                    <View style={GlobalStyle.container}>
                      <View style={GlobalStyle.crazyChartContainer}>
                        <YAxis
                          data={crazyChartHours}
                          svg={{ fontSize: 10, fill: '#717171' }}
                          contentInset={{ top: 15, bottom: 10 }}
                          style={GlobalStyle.crazyChartYInset}
                          numberOfTicks={4}
                          formatLabel={(value, index) =>
                            (
                              '0' +
                              crazyChartHours[
                                crazyChartHours.length - index - 1
                              ]
                            ).slice(-2) + ':00'
                          }
                        />
                        <CrazyChart data={item.week} />
                      </View>
                      <XAxis
                        data={weekDaysFakeValues}
                        svg={{ fontSize: 10, fill: '#717171' }}
                        contentInset={{ left: 30, right: 20 }}
                        style={GlobalStyle.crazyChartXInset}
                        numberOfTicks={weekDays.length}
                        formatLabel={(value, index) => weekDays[index]}
                      />
                    </View>
                  </View>
                </PagerView>
                <View style={styles.pagination}>
                  {[...Array(3).keys()].map(index => (
                    <View
                      key={index}
                      //               dotStyle={GlobalStyle.secondaryBackgroundColor}
                      // selectedDotStyle={GlobalStyle.primaryBackgroundColor}
                      style={[
                        styles.dot,

                        this.state.currentSelectedViewPage === index
                          ? GlobalStyle.primaryBackgroundColor
                          : GlobalStyle.secondaryBackgroundColor,
                        ,
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
            <View style={GlobalStyle.parkhouseSection}>
              <Text
                style={[
                  GlobalStyle.primaryTextColor,
                  GlobalStyle.parkhouseHeading,
                ]}>
                Adresse
              </Text>
              <Text style={GlobalStyle.parkhouseText}>
                {entities.decode(item.destination)}
              </Text>
            </View>
            <View style={GlobalStyle.parkhouseSection}>
              <Text
                style={[
                  GlobalStyle.primaryTextColor,
                  GlobalStyle.parkhouseHeading,
                ]}>
                Beschreibung
              </Text>
              <Text style={GlobalStyle.parkhouseText}>
                {entities.decode(item.description)}
              </Text>
            </View>
            <View style={GlobalStyle.parkhouseSection}>
              <ParkhouseChargeList
                charges={item.charge}
                chargeMax={item.charge_max_24}
              />
            </View>
            <View style={GlobalStyle.serviceContainer}>
              <Text
                style={[
                  GlobalStyle.primaryTextColor,
                  GlobalStyle.parkhouseHeading,
                ]}>
                Service
              </Text>
              <ParkhouseServicesList services={item.services} />
            </View>
          </View>
        </Animated.ScrollView>
        <ParkhouseHeader item={item} height={scrollY} />
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
    fetchParkhouse: params => dispatch(fetchParkhouse(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withParkhouse(ParkhouseScreen));

const styles = StyleSheet.create({
  pageStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
