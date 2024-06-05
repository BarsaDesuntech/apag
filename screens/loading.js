import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from '../style';
import PropTypes from 'prop-types';

/**
 * Displays the Loading Spinner for use when fetching for example.
 *
 * @export
 * @class LoadingScreen
 * @extends {Component}
 */
export default class LoadingScreen extends Component {
  static propTypes = {
    finished: PropTypes.bool,
  };
  render() {
    const {finished} = this.props;
    // If the finished property is true show a check mark instead of the loading indicator
    if (finished) {
      return (
        <View
          style={[
            GlobalStyle.container,
            GlobalStyle.wrapper,
            GlobalStyle.alignItemsCenter,
          ]}>
          <Icon name="check" size={60} color="#a5dc86" />
        </View>
      );
    }
    return (
      <View style={[GlobalStyle.container, GlobalStyle.wrapper]}>
        <ActivityIndicator size="large" color="#3f6cb1" />
      </View>
    );
  }
}
