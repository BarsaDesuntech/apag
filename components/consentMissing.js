import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import GlobalStyle from '../style';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
 * Renders a short message with a link to the gdpr consent settings
 *
 * @export
 * @class ConsentMissing
 * @extends {Component}
 */
export default class ConsentMissing extends Component {
  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  render = () => {
    const { text, icon } = this.props;
    return (
      <View style={[GlobalStyle.consentMissing]}>
        {Boolean(typeof icon !== typeof undefined) && (
          <Icon
            name={icon}
            size={160}
            color="#eee"
            style={{ marginBottom: 30 }}
          />
        )}
        <Text style={GlobalStyle.consentMissingText}>{text}</Text>
        <Text
          style={[GlobalStyle.bold16, GlobalStyle.mt20]}
          onPress={() => {
            this.props.navigation.navigate('GDPR');
          }}>
          Zu den Datenschutzeinstellungen
        </Text>
      </View>
    );
  };
}
