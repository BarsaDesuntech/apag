import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import ListNumbers from '../components/listNumbers';
import GlobalStyle from '../style';
import {withParkhouse, calcDim} from '../helpers';

/**
 * Displays a parkhouse in a list
 * Handles the HomeScreen list showing the number of currently free car lots and showing the trending
 * Handles the LadenScreen list showing the distance to parkhouse, the number of free charging stations and a reserve button
 *
 * @class ListItem
 * @extends {Component}
 */
class ListItem extends Component {
  static propTypes = {
    parkhouse: PropTypes.object,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    lp: PropTypes.string,
    callMapFunc: PropTypes.func,
    target: PropTypes.object,
    distance: PropTypes.number,
    bookings: PropTypes.object,
  };

  /**
   * Navigates to the parkhouse detail page
   *
   * @memberof ListItem
   */
  showParkhouse = () => {
    const {parkhouse, navigation} = this.props;
    navigation.navigate('Parkhouse', {
      phid: parkhouse.id,
      item: parkhouse,
    });
  };

  /**
   * Navigates to the booking page
   *
   * @memberof ListItem
   */
  bookParkhousePlace = () => {
    const {parkhouse, navigation, startDate, endDate, lp} = this.props;
    navigation.navigate('Book', {
      startDate,
      endDate,
      ph: parkhouse.type + ' ' + parkhouse.title,
      phid: parkhouse.id,
      lp,
    });
  };

  render() {
    const {parkhouse, callMapFunc, showNumbers, bookings, index} = this.props;
    // Preload the pin image which is required for the LadenScreen
    const icon = require('../assets/img/pin_blanko_s.png');
    const iconSize = Image.resolveAssetSource(icon);
    // Calculate the correct image size while keeping the aspect ratio
    const {imageWidth, imageHeight} = calcDim(
      iconSize.width,
      iconSize.height,
      34,
      0,
    );
    // Check if the free parking lot numbers should be shown or not and define inline style for that
    const styling = !showNumbers
      ? {borderColor: '#EDEDED', borderBottomWidth: 0.5}
      : {};
    // Renders a simple TouchableHighlight where inside the different components are shown based on the current screen and parkhouse
    return (
      <TouchableHighlight
        key={parkhouse.id}
        underlayColor="#f1f1f1"
        onPress={showNumbers ? this.showParkhouse : this.bookParkhousePlace}>
        <View style={[GlobalStyle.listItem, styling]}>
          {!showNumbers && (
            <View
              style={[
                GlobalStyle.listItemImage,
                {height: imageHeight, width: imageWidth + 4},
              ]}>
              <ImageBackground
                source={icon}
                onPress={() =>
                  callMapFunc('fitToSuppliedMarkers', [parkhouse.id])
                }
                resizeMode={'contain'}
                style={{height: '100%', width: '100%'}}>
                <Text
                  style={[
                    GlobalStyle.parkobjectListItemNumber,
                    {
                      color: '#fff',
                      width: '100%',
                      textAlign: 'center',
                      paddingTop: Platform.OS === 'android' ? 4 : 6,
                    },
                  ]}>
                  {index + 1}
                </Text>
              </ImageBackground>
            </View>
          )}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: 1,
            }}>
            <Text style={GlobalStyle.parkobjectListItemText}>
              {parkhouse.title}
            </Text>
            {typeof parkhouse.distance === typeof undefined && showNumbers && (
              <Text style={GlobalStyle.parkobjectListItemSubText}>
                {parkhouse.type + ' in ' + parkhouse.site}
              </Text>
            )}
            {typeof parkhouse.distance === typeof undefined && !showNumbers && (
              <Text style={GlobalStyle.parkobjectListItemSubText}>
                {typeof bookings !== typeof undefined
                  ? 'Noch ' + bookings.free + ' frei'
                  : ''}
              </Text>
            )}
            {typeof parkhouse.distance !== typeof undefined && (
              <Text style={GlobalStyle.parkobjectListItemSubText}>
                {(typeof bookings !== typeof undefined
                  ? 'Noch ' + bookings.free + ' frei - '
                  : '') +
                  'ca. ' +
                  parkhouse.distance +
                  ' km'}
              </Text>
            )}
          </View>
          {!showNumbers && (
            <View style={GlobalStyle.parkobjectListItemBook}>
              <Icon
                name={'arrow-forward'}
                size={32}
                onPress={this.bookParkhousePlace}
                color={'#3A5998'}
              />
            </View>
          )}
          {showNumbers && (
            <View style={GlobalStyle.parkobjectListItemNumberContainer}>
              <ListNumbers item={parkhouse} />
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

export default withParkhouse(ListItem);
