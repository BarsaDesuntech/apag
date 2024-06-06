import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';

/**
 * Renders a history chart for the capacity usage of a parkhouse
 *
 * @class CrazyChart
 * @extends {Component}
 */
export default class CrazyChart extends Component {
  static propTypes = {
    data: PropTypes.array,
  };

  /**
   * Get a gradient color by providing percentage
   *
   * @param {Float} ratio
   * @memberof CrazyChart
   */
  getGradientColor(ratio) {
    const color1 = '3F6CB1';
    const color2 = 'FFFFFF';
    const hex = x => {
      x = x.toString(16);
      return x.length == 1 ? '0' + x : x;
    };

    const r = Math.ceil(
      parseInt(color1.substring(0, 2), 16) * ratio +
        parseInt(color2.substring(0, 2), 16) * (1 - ratio),
    );
    const g = Math.ceil(
      parseInt(color1.substring(2, 4), 16) * ratio +
        parseInt(color2.substring(2, 4), 16) * (1 - ratio),
    );
    const b = Math.ceil(
      parseInt(color1.substring(4, 6), 16) * ratio +
        parseInt(color2.substring(4, 6), 16) * (1 - ratio),
    );

    return '#' + hex(r) + hex(g) + hex(b);
  }

  render() {
    const { data } = this.props;
    return (
      <View style={GlobalStyle.crazyChartContainer}>
        {data?.map((day, index) => {
          return (
            <View key={index} style={GlobalStyle.crazyChartItem}>
              {day?.map((percent, hour) => {
                return (
                  <View
                    key={index + 'hour' + hour}
                    style={{
                      backgroundColor: this.getGradientColor(percent / 100),
                      width: '100%',
                      height: 4,
                    }}
                  />
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }
}
