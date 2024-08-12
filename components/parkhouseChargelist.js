import React, {Component} from 'react';
import {Text, View} from 'react-native';
import GlobalStyle from '../style';
import PropTypes from 'prop-types';
import {AllHtmlEntities} from 'html-entities';
const entities = new AllHtmlEntities();

/**
 * Renders the service fees for a parkhouse
 *
 * @class ParkhouseChargeItem
 * @extends {Component}
 */
class ParkhouseChargeItem extends Component {
  static propTypes = {
    charge: PropTypes.object,
  };

  render() {
    const {charge} = this.props;
    return (
      <View
        style={[GlobalStyle.primaryBackgroundColor, GlobalStyle.chargeItem]}>
        <Text style={GlobalStyle.chargeItemTitle}>{charge.title}</Text>
        <Text style={GlobalStyle.chargeItemSlot}>{charge.slot}</Text>
        <View style={GlobalStyle.chargeItemBubble}>
          <Text
            style={[
              GlobalStyle.primaryTextColor,
              GlobalStyle.chargeItemBubbleText,
            ]}>
            {entities.decode(charge.range)}
          </Text>
        </View>
        {charge.info != null && (
          <Text style={GlobalStyle.chargeItemText}>
            {entities.decode(charge.info)}
          </Text>
        )}
      </View>
    );
  }
}

/**
 * Renders a list of service fees by using the ParkhouseChargeItem class
 *
 * @export
 * @class ParkhouseChargeList
 * @extends {Component}
 */
export default class ParkhouseChargeList extends Component {
  static propTypes = {
    charges: PropTypes.array,
    chargeMax: PropTypes.string,
  };

  render() {
    const {charges, chargeMax} = this.props;
    return (
      <View style={GlobalStyle.container}>
        {charges?.map(charge => (
          <ParkhouseChargeItem key={charge.title} charge={charge} />
        ))}
        <View
          style={[
            GlobalStyle.primaryBackgroundColor,
            GlobalStyle.chargeItemMax,
          ]}>
          <Text style={GlobalStyle.chargeItemMaxText}>{chargeMax}</Text>
        </View>
      </View>
    );
  }
}
