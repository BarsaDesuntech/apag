import React, { Component } from 'react';
import { View, Text } from 'react-native';
import GlobalStyle from '../style';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
 * Renders a simple notice rectangle as information for the user - can be used globally throughout the app
 *
 * @export
 * @class Notice
 * @extends {Component}
 */
export default class Notice extends Component {
  static propTypes = {
    title: PropTypes.string,
    texts: PropTypes.array,
    containerStyle: PropTypes.object,
  };

  render() {
    const { title, texts, containerStyle, style, icon } = this.props;
    return (
      <View style={[GlobalStyle.containerSmallPadding, containerStyle]}>
        {Boolean(typeof title !== typeof undefined && title !== null) && (
          <Text style={[GlobalStyle.h2, GlobalStyle.noticeTitle]}>{title}</Text>
        )}
        {Boolean(typeof icon !== typeof undefined && icon !== null) && (
          <View
            style={[
              GlobalStyle.container,
              GlobalStyle.alignItemsCenter,
              GlobalStyle.m10,
            ]}>
            <Icon name={icon} size={60} color="#636363" solid />
          </View>
        )}
        <View>
          {Boolean(typeof texts !== typeof undefined && texts.length) &&
            texts?.map((text, i) => (
              <Text
                key={'text' + i}
                style={[GlobalStyle.normal12, { color: '#636363' }, style]}>
                {text}
              </Text>
            ))}
        </View>
      </View>
    );
  }
}
