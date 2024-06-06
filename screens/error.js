import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from '../style';

/**
 * Displays an error message when fetching has not worked or a custom text can be passed
 *
 * @export
 * @class ErrorScreen
 * @extends {Component}
 */
export default class ErrorScreen extends Component {
  render() {
    const {text} = this.props;
    return (
      <View
        style={[
          GlobalStyle.container,
          GlobalStyle.wrapper,
          GlobalStyle.alignItemsCenter,
        ]}>
        <Icon size={46} name="exclamation-circle" style={GlobalStyle.pb10} />
        <Text>{text ? text : 'Es gab ein Problem bei Ihrer Anfrage!'}</Text>
      </View>
    );
  }
}
