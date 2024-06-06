import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableHighlight, View} from 'react-native';
import GlobalStyle from '../style';

/**
 * Renders a simple button with the primary color of our style file
 *
 * @class ButtonPrimary
 * @extends {Component}
 */
export default class ButtonTransparent extends Component {
  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {
    text: '',
  };

  render = () => {
    const {text, onPress, style, textStyle} = this.props;
    return (
      <TouchableHighlight
        style={[GlobalStyle.buttonPrimary, style]}
        underlayColor="transparent"
        onPress={onPress}>
        <View>
          <Text style={[GlobalStyle.buttonPrimaryText, textStyle]}>
            {' '}
            {text}{' '}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
}
