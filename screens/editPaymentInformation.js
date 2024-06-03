import React, { Component } from 'react';
import { View, Alert, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';
import LoadingScreen from '../screens/loading';
import {
  getCurrentUserDetails,
  updateCurrentUserDetails,
} from '../store/actions/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorScreen from '../screens/error';
import { Hoshi } from '../components/react-native-textinput-effects';
import { UPDATING_CURRENT_USER_DETAILS_FAILURE } from '../store/actions/constants';
import Notice from '../components/notice';

/**
 * Renders a list of all existing invoices for the current loggedin customer.
 *
 * @class EditPaymentInformationScreen
 * @extends {Component}
 */
class EditPaymentInformationScreen extends Component {
  static propTypes = {
    user: PropTypes.object,
  };

  state = {
    details: null,
    isSaving: false,
    errors: null,
    finished: false,
  };

  constructor(props) {
    super(props);

    // Initialize the save property with undefined
    this.props.navigation.setParams({ save: undefined });
  }

  componentDidMount() {
    // Import the current customer information (payment details) from props to state
    this.setUserDetails(this.props);
    // Store the save function and changed state inside the navigation as this allows the save button to be in the header instead of the screen (crazy scope problems with react-navigation)
    this.props.navigation.setParams({ save: this.save, changed: false });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If any property changes the information are refelected inside the form
    if (
      JSON.stringify(typeof this.props.user.details) !==
      JSON.stringify(prevProps.user.details)
    ) {
      this.setUserDetails(this.props);
    }
  }

  setUserDetails = props => {
    if (
      typeof props.user.details !== typeof undefined &&
      this.state.details === null
    ) {
      // Set all in the current state by cloning it via JSON.stringify and JSON.parse
      let details = JSON.parse(JSON.stringify(props.user.details));
      // Clear all payment details as they should not be visible to the user
      details.IBAN = '';
      details.BIC = '';
      details.BLZ = '';
      details.Bank = '';
      details.Kontonummer = '';
      this.setState({ details });
    }
  };

  save = () => {
    return new Promise((resolve, reject) => {
      const { navigation } = this.props;
      const { details } = this.state;
      // Validate the payment details before sending them to the Meine APAG API
      if (
        (details.Zahlart === 'SEPA-Basislastschrift (CORE)' &&
          (details.IBAN === '' || details.BIC === '')) ||
        (details.Zahlart === 'Bankeinzug' &&
          (details.Bank === '' ||
            details.BLZ === '' ||
            details.Kontonummer === ''))
      ) {
        let errors = {};
        if (details.Zahlart === 'SEPA-Basislastschrift (CORE)') {
          if (details.IBAN === '') {
            errors.IBAN = ['Das IBAN Feld ist erforderlich.'];
          }
          if (details.BIC === '') {
            errors.BIC = ['Das BIC Feld ist erforderlich.'];
          }
        } else {
          if (details.Bank === '') {
            errors.Bank = ['Das Bank Feld ist erforderlich.'];
          }
          if (details.BLZ === '') {
            errors.BLZ = ['Das BLZ Feld ist erforderlich.'];
          }
          if (details.Kontonummer === '') {
            errors.Kontonummer = ['Das Kontonummer Feld ist erforderlich.'];
          }
        }
        resolve();
        // Render errors next to each form input
        this.setState({ errors });
        // Show an alert to the user which fields are not correctly filled
        Alert.alert('Hinweis', this.buildErrorMessage(errors));
      } else {
        // Update the state to show a loading indicator
        this.setState({ isSaving: true });
        // Call the Meine APAG API with the new payment details
        // If the personal property is set to true the payment details are blanked again before sending them which is not required here
        this.props
          .updateCurrentUserDetails({ details: details, personal: false })
          .then(res => {
            // Save has finished
            this.setState({ isSaving: false });
            // If an error occured while saving display it
            if (res.type === UPDATING_CURRENT_USER_DETAILS_FAILURE) {
              this.setState({ errors: res.errors });
              Alert.alert('Hinweis', this.buildErrorMessage(res.errors));
              resolve();
              // If no error occured show a check mark for the defined timeout and then redirect the user back to the overview
            } else {
              resolve();
              this.setState({ finished: true });
              // Wait for some seconds to show the check mark and then redirect
              setTimeout(() => {
                navigation.goBack();
              }, 500);
            }
          });
      }
    });
  };

  // Extracts the error information restructures it to an error message with line breaks for each error
  buildErrorMessage(errors) {
    let message = '';
    let keys = Object.keys(errors);
    for (var i = 0; i < keys.length; i++) {
      message += errors[keys[i]][0] + '\n';
    }
    return message;
  }

  // Updates a field inside the state by rebuilding the complete object @todo is this really required
  // After changing any value the changed property is set inside the navigation properties which will render the save button
  updateValue = (value, index) => {
    const { details } = this.state;
    let updatedDetails = {
      ...details,
    };
    updatedDetails[index] = value;
    this.setState(() => ({
      details: {
        ...updatedDetails,
      },
    }));
    this.props.navigation.setParams({ changed: true });
  };

  // Verify if an error has occured
  hasError = index => {
    const { errors } = this.state;
    if (
      typeof errors !== typeof undefined &&
      errors !== null &&
      typeof errors[index] !== typeof undefined &&
      errors[index].length
    ) {
      return true;
    }
    return false;
  };

  render() {
    const { details, isSaving, finished } = this.state;

    // While saving or requesting customer information a loading screen is shown
    if (
      typeof details === typeof undefined ||
      details === null ||
      isSaving ||
      finished
    ) {
      return <LoadingScreen finished={finished} />;
    }

    // If no customer information is found show an error message
    if (details === null || typeof details === typeof undefined) {
      return <ErrorScreen />;
    }

    // ScrollView using the KeyboardAwareScrollView package to let the screen scroll up when the keyboard is showing up
    // Simple form distinguishing between two payment methods to request the correct fields from the user (SEPA, Bankeinzug)
    return (
      <KeyboardAwareScrollView
        style={[
          GlobalStyle.container,
          GlobalStyle.keyboardAwareScrollViewCustomStyle,
        ]}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}>
        <View>
          <Notice
            style={GlobalStyle.dataNumber}
            texts={[
              'Zum Aktualisieren Ihrer Zahlungsdaten geben Sie Ihre neue IBAN und BIC ein. Zum Schutz Ihrer Daten zeigen wir Ihre aktuellen Zahlungsinformationen nur verkürzt an.',
            ]}
          />
          <View
            style={[
              GlobalStyle.containerSmallPadding,
              GlobalStyle.noMarginTop,
            ]}>
            {details.Zahlart === 'SEPA-Basislastschrift (CORE)' && (
              <View>
                <Hoshi
                  label={'IBAN'}
                  borderColor={'#3F6CB1'}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  useNativeDriver={false}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('IBAN') ? '#D40019' : '#505050',
                  }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  labelStyle={this.hasError('IBAN') ? { color: '#D40019' } : {}}
                  onChangeText={text => this.updateValue(text, 'IBAN')}
                  value={details.IBAN}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('IBAN')
                      ? '#D40019'
                      : '#cccccc',
                  }}
                />
                <Hoshi
                  label={'BIC'}
                  useNativeDriver={false}
                  borderColor={'#3F6CB1'}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('BIC') ? '#D40019' : '#505050',
                  }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  labelStyle={this.hasError('BIC') ? { color: '#D40019' } : {}}
                  onChangeText={text => this.updateValue(text, 'BIC')}
                  value={details.BIC}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('BIC')
                      ? '#D40019'
                      : '#cccccc',
                    marginTop: 10,
                  }}
                />
              </View>
            )}
            {details.Zahlart === 'Bankeinzug' && (
              <View>
                <Hoshi
                  useNativeDriver={false}
                  label={'Kontonummer'}
                  borderColor={'#3F6CB1'}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('Kontonummer') ? '#D40019' : '#505050',
                  }}
                  labelStyle={
                    // eslint-disable-next-line react-native/no-inline-styles
                    this.hasError('Kontonummer') ? { color: '#D40019' } : {}
                  }
                  onChangeText={text => this.updateValue(text, 'Kontonummer')}
                  value={details.Kontonummer}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('Kontonummer')
                      ? '#D40019'
                      : '#cccccc',
                  }}
                />
                <Hoshi
                  label={'BLZ'}
                  useNativeDriver={false}
                  borderColor={'#3F6CB1'}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('BLZ') ? '#D40019' : '#505050',
                  }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  labelStyle={this.hasError('BLZ') ? { color: '#D40019' } : {}}
                  onChangeText={text => this.updateValue(text, 'BLZ')}
                  value={details.BLZ}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('BLZ')
                      ? '#D40019'
                      : '#cccccc',
                  }}
                />
                <Hoshi
                  label={'Bank'}
                  borderColor={'#3F6CB1'}
                  borderHeight={2}
                  useNativeDriver={false}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('Bank') ? '#D40019' : '#505050',
                  }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  labelStyle={this.hasError('Bank') ? { color: '#D40019' } : {}}
                  onChangeText={text => this.updateValue(text, 'Bank')}
                  value={details.Bank}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('Bank')
                      ? '#D40019'
                      : '#cccccc',
                  }}
                />
              </View>
            )}
          </View>
          <View
            style={[
              GlobalStyle.containerSmallPadding,
              GlobalStyle.noMarginTop,
            ]}>
            <View style={GlobalStyle.primaryCont}>
              <Text
                style={[GlobalStyle.dataHeader, GlobalStyle.primaryTextColor]}>
                Aktuelle Zahlungsdaten
              </Text>
            </View>
            {this.props.user.details.Zahlart ===
              'SEPA-Basislastschrift (CORE)' && (
              <View>
                <Text style={[GlobalStyle.dataNumber]}>
                  {this.props.user.details.IBAN}
                </Text>
                <Text style={[GlobalStyle.dataNumber]}>
                  {this.props.user.details.BIC}
                </Text>
              </View>
            )}
            {this.props.user.details.Zahlart === 'Bankeinzug' && (
              <View>
                <Text style={[GlobalStyle.dataNumber]}>
                  {this.props.user.details.Bank}
                </Text>
                <Text style={[GlobalStyle.dataNumber]}>
                  {'Kontonummer endet auf: ...' +
                    this.props.user.details.Kontonummer}
                </Text>
                <Text style={[GlobalStyle.dataNumber]}>
                  {'BLZ: ' + this.props.user.details.BLZ}
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCurrentUserDetails: () => dispatch(getCurrentUserDetails()),
    updateCurrentUserDetails: params =>
      dispatch(updateCurrentUserDetails(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPaymentInformationScreen);
