import React, {Component} from 'react';
import {View, Platform, Text} from 'react-native';
import {Callout} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyle from '../style';
import PropTypes from 'prop-types';

/**
 * Renders a info box on the map when touching a parkhouse
 *
 * @class MapCallout
 * @extends {Component}
 */
export default class MapCallout extends Component {
  static propTypes = {
    item: PropTypes.object,
    phid: PropTypes.string,
  };

  /**
   * Navigates to the parkhouse detail page
   *
   * @param {Object} parkhouse
   * @memberof MapCallout
   */
  showParkhouse = (parkhouse) => {
    this.props.navigation.navigate('Parkhouse', {
      phid: parkhouse.id,
      item: parkhouse,
    });
  };

  render() {
    const {item} = this.props;
    return (
      <Callout onPress={() => this.showParkhouse(item)}>
        <View
          style={[
            GlobalStyle.callout,
            Platform.OS === 'android' ? GlobalStyle.calloutAndroid : {},
          ]}>
          <View style={GlobalStyle.container}>
            <Text style={GlobalStyle.calloutTitle}>{item.title}</Text>
            <View style={GlobalStyle.flexDirectionRow}>
              <Text style={GlobalStyle.calloutSubTitle}>
                freie Parkplätze: {item.free}
              </Text>
              {item.free != 0 &&
                !item.full &&
                (item.trend === 'up' || item.trend === 'down') && (
                  <Icon
                    size={16}
                    style={{
                      color: item.trend === 'up' ? '#A7BD4F' : '#e41312',
                      paddingLeft: 5,
                    }}
                    name={'arrow-' + item.trend}
                  />
                )}
              {item.free != 0 &&
                !item.full &&
                item.trend !== 'up' &&
                item.trend !== 'down' && (
                  <Icon
                    size={16}
                    style={{color: '#ebba13', paddingLeft: 5}}
                    name="arrow-forward"
                  />
                )}
            </View>
          </View>
          <Icon name="arrow-forward-circle-outline" size={24} />
        </View>
      </Callout>
    );
  }
}
