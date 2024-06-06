import { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Client, Configuration } from 'bugsnag-react-native';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';

class BugsnagService extends Component {
  lastId = 0;
  registered = false;
  configured = false;
  connected = null;
  constructor(props) {
    super(props);
    if (this.props.consent.consent.settings.bugsnag) {
      this.configure();
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.consent.consent.settings.bugsnag && !this.configured) {
      this.configure();
    } else {
      if (
        !this.props.consent.consent.settings.bugsnag &&
        this.props.consent.consent.settings.bugsnag !==
          prevProps.consent.consent.settings.bugsnag
      ) {
        this.killBugsnag();
      } else {
        if (
          this.props.consent.consent.settings.bugsnag &&
          this.props.consent.consent.settings.bugsnag !==
            prevProps.consent.consent.settings.bugsnag
        ) {
          this.configure();
        }
      }
    }
  }
  async configure() {
    let trackingStatus = await getTrackingStatus();
    const isIos = Platform.OS === 'ios';
    if (isIos && trackingStatus === 'not-determined') {
      trackingStatus = await requestTrackingPermission();
    }
    if (
      this.configured &&
      ((isIos && trackingStatus === 'authorized') || !isIos)
    ) {
      this.bugsnag.startSession();
    } else {
      this.config = new Configuration('d4b7d9f4a2fcf28167fac38085fc19c5');
      this.bugsnag = new Client(this.config);
      this.configured = true;
    }
  }
  killBugsnag() {
    if (this.bugsnag) {
      this.bugsnag.stopSession();
    }
  }
  render() {
    // Nothing is rendered for the BugsnagService because it just handles business logic in the background
    return null;
  }
}

function mapStateToProps(state) {
  return {
    consent: state.consent,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(BugsnagService);
