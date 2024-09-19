import React, { Component } from 'react';
import { View, Image, Platform, Text, ImageBackground } from 'react-native';
import { Marker } from 'react-native-maps';
import GlobalStyle, { primaryBlue } from '../style';
import MapCallout from './mapcallout';

// Globally defined variables on import which handle the counting for the charging places map
// @todo should be handled via Redux but more complicated then
var index = 0;
var lastDistance = 0;
var lastPlace = 0;

/**
 * Custom marker class for the map
 * Handles the different layoutings of the icons, images and markers on the different types of maps we provide
 * Can show just the icon, number of order on different operating systems on different map providers
 * @todo refactor when the react-native-maps is more mature because currently the marker render multiple times
 *
 * @class CustomMarker
 * @extends {Component}
 */
export default class CustomMarker extends Component {
  state = {
    isReady: true,
  };

  componentDidMount() {
    this.setState({ isReady: false });
  }

  render() {
    const { showCallouts, navigation, include, hasLocation, numbered, item } =
      this.props;
    const { isReady } = this.state;
    // If instead of the parkhouse icon numbers should be shown (is the case for the charging station map)
    if (numbered === true) {
      // If the parkhouse should be shown on the map or it is not defined which should be shown render a marker
      if (
        typeof include === typeof undefined ||
        include.indexOf(item.id) !== -1
      ) {
        // Calculate the current item index and save as lastDistance to remember for the following markers
        if (hasLocation) {
          if (lastDistance <= item.distance) {
            if (lastPlace === item.id) {
              index = 0;
            }
            index++;
          }
          if (lastDistance > item.distance) {
            index = 1;
          }
          lastDistance = item.distance;
        } else {
          index = item.index;
        }
        // Save the last (current) place id for the marker so that it can be used for all following markers
        lastPlace = item.id;
        // Preload marker image otherwise there are rendering issues
        const image = require('../assets/img/pin_blanko.png');
        // Differentiate between operating systems so that on all map providers and operating systems the marker and number written on top of it is shown correctly
        return Platform.OS === 'android' ? (
          <Marker
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }}
            key={'marker' + item.id}
            anchor={Platform.OS === 'android' ? { x: 0.5, y: 0.5 } : null}
            tracksViewChanges={isReady}>
            <View style={GlobalStyle.doubleDigitCont}>
              <Image
                imageStyle={{ resizeMode: 'contain' }}
                source={image}
                style={[
                  GlobalStyle.pin,
                  { position: 'absolute', top: 0, left: 0 },
                ]}
              />
              <Text
                allowFontScaling={false}
                style={[
                  GlobalStyle.digitTxt,
                  {
                    paddingLeft: index > 9 ? 18 : 21,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    paddingTop: 3,
                    fontSize: index > 9 ? 12 : 14,
                  },
                ]}>
                {index}
              </Text>
            </View>
          </Marker>
        ) : (
          <Marker
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }}
            key={'marker' + item.id}
            anchor={Platform.OS === 'android' ? { x: 0.5, y: 0.5 } : null}
            tracksViewChanges={isReady}>
            <View style={GlobalStyle.doubleDigitCont}>
              <ImageBackground
                imageStyle={{ resizeMode: 'contain' }}
                source={image}
                style={GlobalStyle.pin}>
                <Text
                  allowFontScaling={false}
                  style={[
                    GlobalStyle.digitTxt,
                    {
                      paddingLeft: index > 9 ? 18 : 21,
                      paddingTop: 3,
                      fontSize: index > 9 ? 12 : 14,
                    },
                  ]}>
                  {index}
                </Text>
              </ImageBackground>
            </View>
          </Marker>
        );
        // If the parkhouse should not be shown on the map only render an empty View as the return value cannot be null
      } else {
        return <View key={'marker' + item.id} />;
      }
      // If the normal parkhouse icon distguished between house and place should be shown
    } else {
      // If the parkhouse should be shown on the map or it is not defined which should be shown render a marker
      if (
        typeof include === typeof undefined ||
        include.indexOf(item.id) !== -1
      ) {
        // Preload the image because otherwise there are some rendering issues with react-native-maps
        if (item.type === 'car') {
          var image = require('../assets/img/pin.png');
        }
        // else if (item.type === 'bike') {
        //   var image = require('../assets/img/pedal_bike.png');
        // }
        else {
          var image = require('../assets/img/pin_pp.png');
        }
        // Render a normal react-native-maps marker
        return (
          <Marker
            identifier={item.id}
            key={'marker' + item.id}
            anchor={Platform.OS === 'android' ? { x: 0.5, y: 0.5 } : null}
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }}
            tracksViewChanges={isReady}>
            <Image
              source={image}
              style={[
                GlobalStyle.pin,
                // item?.type === 'bike' && {
                //   tintColor: primaryBlue,
                //   width: 40,
                //   height: 40,
                // },
              ]}
            />
            {showCallouts && <MapCallout item={item} navigation={navigation} />}
          </Marker>
        );
        // If the parkhouse should not be shown on the map only render an empty View as the return value cannot be null
      } else {
        return <View key={'marker' + item.id} />;
      }
    }
  }
}
