import { Component } from 'react';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { senderID } from '../env';
import { connect } from 'react-redux';
import {
  registerFCMToken,
  sendFCMToken,
  deleteFCMToken,
} from '../store/actions/user';
import NetInfo from '@react-native-community/netinfo';

class NotificationService extends Component {
  lastId = 0;
  registered = false;
  configured = false;
  justLaunched = true;
  intervalId = null;
  connected = null;
  constructor(props) {
    super(props);
    const that = this;
    if (this.props.consent.consent.settings.push) {
      this.configure();
    }

    // Start event listener to check for the current internet connection
    this.unsubscribe = NetInfo.addEventListener(state => {
      // If the state changes and isConnected is true try to update the parkhouses
      if (state.isConnected && this.connected !== state.isConnected) {
        if (!that.registered && !that.justLaunched) {
          if (that.props.consent.consent.settings.push && !that.registered) {
            PushNotification.requestPermissions();
          }
        } else {
          if (
            !that.props.user.FCMDeviceTokenSaved &&
            that.props.user.FCMDeviceToken !== null &&
            !that.justLaunched &&
            that.props.consent.consent.settings.push
          ) {
            that.send(that.props.user.FCMDeviceToken);
          } else {
            if (
              !that.props.consent.consent.settings.push &&
              that.props.user.FCMDeviceToken !== null &&
              that.props.user.FCMDeviceTokenDelete &&
              that.props.user.FCMDeviceTokenSaved
            ) {
              that.props.deleteFCMToken({
                token: that.props.user.FCMDeviceToken,
              });
            }
          }
        }
      }
      this.connected = state.isConnected;

      that.justLaunched = false;
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !this.justLaunched &&
      this.props.consent.consent.settings.push &&
      !this.configured
    ) {
      this.configure();
    } else {
      if (
        !this.props.consent.consent.settings.push &&
        this.props.consent.consent.settings.push !==
          prevProps.consent.consent.settings.push &&
        this.props.user.FCMDeviceToken !== null &&
        this.props.user.FCMDeviceTokenSaved
      ) {
        PushNotification.abandonPermissions();
        this.props.deleteFCMToken({ token: this.props.user.FCMDeviceToken });
      } else {
        if (
          this.props.consent.consent.settings.push &&
          this.props.consent.consent.settings.push !==
            prevProps.consent.consent.settings.push &&
          this.props.user.FCMDeviceToken !== null &&
          !this.props.user.FCMDeviceTokenSaved
        ) {
          this.send(this.props.user.FCMDeviceToken);
        }
      }
    }
  }
  configure() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: this.onRegister.bind(this), //this._onRegister.bind(this),
      // (required) Called when a remote or local notification is opened or received
      onNotification: this.onNotification.bind(this), //this._onNotification,
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID,
    });
    this.configured = true;
  }
  componentWillUnmount() {
    // Unbined the event listener for the internet connection
    if (this.unsubscribe !== null) {
      this.unsubscribe();
    }
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }
  hex_to_ascii(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
  onRegister(token) {
    if (Platform.OS === 'ios') {
      token.token = this.hex_to_ascii(token.token);
    }
    this.registered = true;
    if (
      !this.props.user.FCMDeviceTokenSaved ||
      token.token !== this.props.user.FCMDeviceToken
    ) {
      this.send(token.token);
      this.intervalId = setInterval(() => this.checkFCMToken(token), 60000);
    }
    this.props.registerFCMToken({ token: token.token });
  }

  checkFCMToken(token) {
    if (!this.props.user.FCMDeviceTokenSaved) {
      this.send(token.token);
    } else {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
    }
  }

  onNotification(notification) {
    if (Platform.OS === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NewData);
    }
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({ id: '' + this.lastId });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  send(token) {
    if (!this.props.user.FCMDeviceTokenSending) {
      this.props.sendFCMToken({ token });
    }
  }

  render() {
    // Nothing is rendered for the NotificationService because it just handles business logic in the background
    return null;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    consent: state.consent,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    registerFCMToken: params => dispatch(registerFCMToken(params)),
    sendFCMToken: params => dispatch(sendFCMToken(params)),
    deleteFCMToken: params => dispatch(deleteFCMToken(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationService);
