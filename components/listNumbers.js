import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyle from '../style';

/**
 * Renders a progress bar for the provided percentage
 *
 * @class ProgressBar
 * @extends {Component}
 */
class ProgressBar extends Component {
  static propTypes = {
    percent: PropTypes.number,
  };

  render() {
    const { percent } = this.props;
    return (
      <View style={GlobalStyle.statsOuterPill}>
        <View style={[GlobalStyle.statsInnerPill, { width: percent + '%' }]} />
      </View>
    );
  }
}

/**
 * Renders the capacitiy number, trend and capacity bar for a parkhouse list item
 *
 * @class ListNumbers
 * @extends {Component}
 */
export default class ListNumbers extends Component {
  static propTypes = {
    item: PropTypes.object,
  };

  render() {
    const { item } = this.props;
    // Check if the parkhouse has a message attached and based on that hide or show numbers or not
    const hasMessage = typeof item.message !== typeof undefined;
    return (
      <View style={GlobalStyle.parkobjectListItemNumberContainer}>
        {item.free != 0 && !item.full && !hasMessage && (
          <Text style={GlobalStyle.parkobjectListItemNumber}>{item.free}</Text>
        )}
        {item.free != 0 &&
          !item.full &&
          (item.trend === 'up' || item.trend === 'down') &&
          !hasMessage && (
            <Icon
              size={16}
              style={{ color: item.trend === 'up' ? '#A7BD4F' : '#e41312' }}
              name={'arrow-' + item.trend}
            />
          )}
        {item.free != 0 &&
          !item.full &&
          item.trend != 'up' &&
          item.trend != 'down' &&
          !hasMessage && (
            <Icon size={16} style={{ color: '#ebba13' }} name="arrow-forward" />
          )}
        {item.free != 0 && !item.full && !hasMessage && (
          <ProgressBar percent={100 - (item.free / item.capacity) * 100} />
        )}
        {(item.free == 0 || (!!item.full && !hasMessage)) && (
          <View style={GlobalStyle.parkobjectListItemMessage}>
            <View
              style={[
                GlobalStyle.yellowBackground,
                GlobalStyle.roundedCorners,
                GlobalStyle.numberBox,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: Platform.OS === 'android' ? 0 : 2,
                },
              ]}>
              <Text
                style={[
                  GlobalStyle.parkobjectListItemNumber,
                  GlobalStyle.parkobjectListItemNumberWhiteText,
                ]}>
                voll
              </Text>
            </View>
          </View>
        )}
        {hasMessage && (
          <View style={GlobalStyle.parkobjectListItemMessage}>
            <View
              style={[
                GlobalStyle.yellowBackground,
                GlobalStyle.roundedCorners,
                GlobalStyle.numberBox,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: Platform.OS === 'android' ? 0 : 2,
                },
              ]}>
              <Text
                style={[
                  GlobalStyle.parkobjectListItemNumber,
                  GlobalStyle.parkobjectListItemNumberWhiteText,
                ]}>
                k.A.
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
