import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableHighlight, View } from 'react-native';
import GlobalStyle from '../style';

/**
 * Renders a button inside a list item (parkhouse)
 * Is used on the laden screen to reserve a charging stations
 *
 * @export
 * @class ListButton
 * @extends {Component}
 */
export default class ListButton extends Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    text: '',
  };

  render = () => {
    const { text, onPress } = this.props;
    return (
      <TouchableHighlight
        style={GlobalStyle.listButton}
        underlayColor="#628fd3"
        onPress={onPress}>
        <View>
          <Text
            style={[GlobalStyle.buttonPrimaryText, GlobalStyle.listButtonText]}>
            {' '}
            {text}{' '}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
}
