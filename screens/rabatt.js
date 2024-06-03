import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';
import { getRabattQR } from '../store/actions/rabatt';
import LoadingScreen from '../screens/loading';
import QRCode from 'react-native-qrcode-svg';
import Notice from '../components/notice';
const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const WINDOW_HEIGHT = window.height;

/**
 * Renders a list of all existing invoices for the current loggedin customer.
 *
 * @class RabattScreen
 * @extends {Component}
 */
class RabattScreen extends Component {
  static propTypes = {
    user: PropTypes.object,
    rabatt: PropTypes.object,
  };

  static navigationOptions = {
    title: 'Rabatt',
  };

  componentDidMount() {
    // Request QR-Code for Rabatt
    this.props.getRabattQR();
  }

  render() {
    const { rabatt } = this.props;
    // If not QR-Code is found show a loading screen
    // @todo check if isFetching and show an error message if something has gone wrong
    if (
      typeof rabatt.rabatt === typeof undefined ||
      typeof rabatt.rabatt.qr === typeof undefined
    ) {
      return <LoadingScreen />;
    }
    // Simple view just displaying a QR-Code based on the react-native-qrcode-svg package
    return (
      <View style={[GlobalStyle.container, GlobalStyle.rabattContainer]}>
        <Notice
          title="Rabattieren mit dem Nupsi"
          texts={[
            'Zeigen Sie diesen QR-Code in Partner-Läden und erhalten Sie einen Rabatt für Ihre monatliche Rechnung!',
          ]}
        />
        <View
          style={[
            GlobalStyle.centerContent,
            { marginTop: WINDOW_HEIGHT * 0.05 },
          ]}>
          <QRCode
            value={rabatt.rabatt.qr}
            size={WINDOW_WIDTH * 0.8}
            ecl={'H'}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    rabatt: state.rabatt,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRabattQR: () => dispatch(getRabattQR()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RabattScreen);
