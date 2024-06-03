import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';
import { AllHtmlEntities } from 'html-entities';
const entities = new AllHtmlEntities();

/**
 * Renders an array of parkhouse services as list
 *
 * @export
 * @class ParkhouseServicesList
 * @extends {Component}
 */
export default class ParkhouseServicesList extends Component {
  static propTypes = {
    services: PropTypes.object,
  };

  render() {
    const { services } = this.props;
    const keys = Object.keys(services);
    return (
      <View>
        {keys?.map(key => (
          <View style={GlobalStyle.flexDirectionRow} key={'service' + key}>
            <Icon
              name="md-checkmark"
              style={GlobalStyle.mr5}
              size={18}
              color="#717171"
            />
            <Text style={GlobalStyle.serviceText}>
              {entities.decode(services[key])}
            </Text>
          </View>
        ))}
      </View>
    );
  }
}
