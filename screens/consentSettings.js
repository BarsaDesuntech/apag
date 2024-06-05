import React, {Component} from 'react';
import {View, Text, Switch, Linking, Platform} from 'react-native';
import {connect} from 'react-redux';
import GlobalStyle from '../style';
import PropTypes from 'prop-types';
import {saveConsentSettings} from '../store/actions/consent';
import Notice from '../components/notice';

class ConsentItem extends Component {
  static propTypes = {
    index: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
  };

  render() {
    const {text, index} = this.props;
    return (
      <View
        style={[
          GlobalStyle.consentItem,
          Platform.OS === 'ios' ? {height: 40} : {},
        ]}>
        <Text style={GlobalStyle.consentItemTitle}>{text}</Text>
        <Switch
          onValueChange={val => this.props.onChange(index, val)}
          value={this.props.value}
          style={GlobalStyle.consentSwitch}
        />
      </View>
    );
  }
}

/**
 * This is the screen where the user can define his GDPR settings.
 *
 * @class ConsentSettingsScreen
 * @extends {Component}
 */
class ConsentSettingsScreen extends Component {
  onChange = (index, value) => {
    let settings = {};
    settings[index] = value;
    this.props.saveConsentSettings(settings);
  };
  render() {
    const {consent} = this.props.consent;
    return (
      <View style={[GlobalStyle.container, GlobalStyle.containerSmallPadding]}>
        <Notice
          texts={[
            'Sie können im Folgenden Datenschutzeinstellungen vornehmen. Wenn Sie einzelne Dienste deaktivieren, kann das dazu führen, dass einige Funktionen nicht mehr wie gewohnt verfügbar sind. Wir weisen Sie dann an der jeweiligen Stelle auf Ihre Wahlmöglichkeiten hin. Detailinformationen können Sie der Datenschutzerklärung entnehmen:',
          ]}
          style={GlobalStyle.normal16}
        />
        <Text
          style={GlobalStyle.consentText}
          onPress={() => {
            Linking.openURL('https://apag.de/datenschutz');
          }}>
          Datenschutzerklärung: apag.de/datenschutz
        </Text>
        <ConsentItem
          index="maps"
          text="Einbindung von externen Kartenmaterial"
          value={consent.settings.maps}
          onChange={this.onChange}
        />
        <ConsentItem
          index="push"
          text="Nutzung von Push-Services"
          value={consent.settings.push}
          onChange={this.onChange}
        />
        <ConsentItem
          index="bugsnag"
          text="Externe Dienste zur Fehleranalyse"
          value={consent.settings.bugsnag}
          onChange={this.onChange}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    consent: state.consent,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveConsentSettings: params => dispatch(saveConsentSettings(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentSettingsScreen);
