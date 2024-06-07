import React, {Component} from 'react';
import {View, Text, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';
import LoadingScreen from '../screens/loading';
import {
  getCurrentUserDetails,
  updateCurrentUserDetails,
} from '../store/actions/user';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-datepicker';
import ErrorScreen from '../screens/error';
import {Hoshi} from '../components/react-native-textinput-effects';
import {UPDATING_CURRENT_USER_DETAILS_FAILURE} from '../store/actions/constants';

/**
 * Renders a list of all existing invoices for the current loggedin customer.
 *
 * @class EditPersonalInformationScreen
 * @extends {Component}
 */
class EditPersonalInformationScreen extends Component {
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
    this.props.navigation.setParams({save: undefined});
  }

  componentDidMount() {
    // Request customer information to be sure that only the newest data is displayed
    this.props.getCurrentUserDetails();
    // Import the current customer information (payment details) from props to state
    this.setUserDetails(this.props);
    // Store the save function and changed state inside the navigation as this allows the save button to be in the header instead of the screen (crazy scope problems with react-navigation)
    this.props.navigation.setParams({save: this.save, changed: false});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If any property changes the information are refelected inside the form
    if (
      JSON.stringify(prevProps.user.details) !==
      JSON.stringify(this.props.user.details)
    ) {
      this.setUserDetails(this.props);
    }
  }

  // Set the users details from props into state as long as the state is not already filled
  setUserDetails = props => {
    if (
      typeof props.user.details !== typeof undefined &&
      this.state.details === null
    ) {
      this.setState({details: props.user.details});
    }
  };

  save = () => {
    return new Promise((resolve, reject) => {
      const {navigation} = this.props;
      // Update the state to show a loading indicator
      this.setState({isSaving: true});
      // Send all details as filled in to the Meine APAG API
      // The personal property is filled with true which means that the payment details which live hidden inside the user details are cleared before sending otherwise they would be overwritten
      this.props
        .updateCurrentUserDetails({
          details: this.state.details,
          personal: true,
        })
        .then(res => {
          // Save has finished
          this.setState({isSaving: false});
          // If an error occured while saving display it
          if (res.type === UPDATING_CURRENT_USER_DETAILS_FAILURE) {
            this.setState({errors: res.errors});
            Alert.alert('Hinweis', this.buildErrorMessage(res.errors));
            resolve();
            // If no error occured show a check mark for the defined timeout and then redirect the user back to the overview
          } else {
            resolve();
            this.setState({finished: true});
            // Wait for some seconds to show the check mark and then redirect
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        });
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
    const {details} = this.state;
    let updatedDetails = {
      ...details,
    };
    updatedDetails[index] = value;
    this.setState(() => ({
      details: {
        ...updatedDetails,
      },
    }));
    this.props.navigation.setParams({changed: true});
  };

  // Verify if an error has occured
  hasError = index => {
    const {errors} = this.state;
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
    const {details, isSaving, finished} = this.state;

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
    // Simple form to update the customer details like on Meine APAG in browser
    return (
      <KeyboardAwareScrollView
        style={[
          GlobalStyle.container,
          GlobalStyle.keyboardAwareScrollViewCustomStyle,
        ]}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}>
        <View>
          <View
            style={[
              GlobalStyle.containerSmallPadding,
              GlobalStyle.noMarginTop,
            ]}>
            <View style={GlobalStyle.primaryCont}>
              <View style={GlobalStyle.selectContainer}>
                <Picker
                  selectedValue={details.Anrede}
                  style={GlobalStyle.selectStyle}
                  mode={'dropdown'}
                  onValueChange={(itemValue, itemIndex) =>
                    this.updateValue(itemValue, 'Anrede')
                  }>
                  <Picker.Item label="Herr" value="Herr" />
                  <Picker.Item label="Frau" value="Frau" />
                  <Picker.Item label="Firma" value="Firma" />
                </Picker>
                <Text style={GlobalStyle.selectText}>{details.Anrede}</Text>
              </View>
              <View style={[GlobalStyle.container, GlobalStyle.mr10]}>
                <Hoshi
                  label={'Name1'}
                  borderColor={'#3F6CB1'}
                  useNativeDriver={false}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('Name1') ? '#D40019' : '#505050',
                  }}
                  labelStyle={this.hasError('Name1') ? {color: '#D40019'} : {}}
                  onChangeText={text => this.updateValue(text, 'Name1')}
                  value={details.Name1}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('Name1')
                      ? '#D40019'
                      : '#cccccc',
                    marginTop: 10,
                  }}
                />
              </View>
              <View style={GlobalStyle.container}>
                <Hoshi
                  label={'Name2'}
                  borderColor={'#3F6CB1'}
                  useNativeDriver={false}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('Name2') ? '#D40019' : '#505050',
                  }}
                  labelStyle={this.hasError('Name2') ? {color: '#D40019'} : {}}
                  onChangeText={text => this.updateValue(text, 'Name2')}
                  value={details.Name2}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('Name2')
                      ? '#D40019'
                      : '#cccccc',
                    marginTop: 10,
                  }}
                />
              </View>
            </View>
            <View>
              <DatePicker
                is24Hour={true}
                date={details.Geburtsdatum}
                mode="date"
                useNativeDriver={false}
                placeholder="Datum auswählen"
                format="DD.MM.YYYY"
                confirmBtnText="Bestätigen"
                cancelBtnText="Abbrechen"
                iconComponent={
                  <Icon
                    size={26}
                    name="calendar"
                    color="#3F6CB1"
                    regular
                    style={GlobalStyle.pr10}
                  />
                }
                customStyles={{
                  dateIcon: GlobalStyle.dateIcon,
                  dateInput: GlobalStyle.dateInput,
                  dateText: [
                    GlobalStyle.inputFieldText,
                    GlobalStyle.dateInputText,
                    {color: '#505050', bottom: 4},
                  ],
                }}
                style={[
                  GlobalStyle.datePickerCustom,
                  GlobalStyle.inputFieldCustom,
                  GlobalStyle.datePickerPersonalStyle,
                ]}
                onDateChange={date => this.updateValue(date, 'Geburtsdatum')}
              />
            </View>
            <View>
              <Hoshi
                label={'Strasse'}
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                useNativeDriver={false}
                height={36}
                // eslint-disable-next-line react-native/no-inline-styles
                inputStyle={{
                  left: 0,
                  color: this.hasError('Strasse') ? '#D40019' : '#505050',
                }}
                labelStyle={this.hasError('Strasse') ? {color: '#D40019'} : {}}
                onChangeText={text => this.updateValue(text, 'Strasse')}
                value={details.Strasse}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  borderBottomColor: this.hasError('Strasse')
                    ? '#D40019'
                    : '#cccccc',
                  marginTop: 10,
                }}
              />
            </View>
            <View style={GlobalStyle.primaryCont}>
              <View style={[GlobalStyle.container, GlobalStyle.mr10]}>
                <Hoshi
                  label={'Ort'}
                  borderColor={'#3F6CB1'}
                  useNativeDriver={false}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('Ort') ? '#D40019' : '#505050',
                  }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  labelStyle={this.hasError('Ort') ? {color: '#D40019'} : {}}
                  onChangeText={text => this.updateValue(text, 'Ort')}
                  value={details.Ort}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('Ort')
                      ? '#D40019'
                      : '#cccccc',
                    marginTop: 10,
                  }}
                />
              </View>
              <View style={[GlobalStyle.container, GlobalStyle.mr10]}>
                <Hoshi
                  label={'PLZ'}
                  borderColor={'#3F6CB1'}
                  useNativeDriver={false}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  // eslint-disable-next-line react-native/no-inline-styles
                  inputStyle={{
                    left: 0,
                    color: this.hasError('PLZ') ? '#D40019' : '#505050',
                  }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  labelStyle={this.hasError('PLZ') ? {color: '#D40019'} : {}}
                  onChangeText={text => this.updateValue(text, 'PLZ')}
                  value={details.PLZ}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    borderBottomColor: this.hasError('PLZ')
                      ? '#D40019'
                      : '#cccccc',
                    marginTop: 10,
                  }}
                />
              </View>
              <View style={GlobalStyle.container}>
                <Hoshi
                  label={'Land'}
                  borderColor={'#3F6CB1'}
                  useNativeDriver={false}
                  borderHeight={2}
                  inputPadding={4}
                  height={36}
                  inputStyle={GlobalStyle.hoshiInputStyle}
                  onChangeText={text => this.updateValue(text, 'Land')}
                  value={details.Land}
                  style={GlobalStyle.mt10}
                />
              </View>
            </View>
            <View>
              <Hoshi
                label={'Telefon1'}
                borderColor={'#3F6CB1'}
                borderHeight={2}
                useNativeDriver={false}
                inputPadding={4}
                height={36}
                inputStyle={GlobalStyle.hoshiInputStyle}
                onChangeText={text => this.updateValue(text, 'Telefon1')}
                value={details.Telefon1}
                style={GlobalStyle.mt10}
              />
            </View>
            <View>
              <Hoshi
                label={'Telefon2'}
                borderColor={'#3F6CB1'}
                borderHeight={2}
                useNativeDriver={false}
                inputPadding={4}
                height={36}
                inputStyle={GlobalStyle.hoshiInputStyle}
                onChangeText={text => this.updateValue(text, 'Telefon2')}
                value={details.Telefon2}
                style={GlobalStyle.mt10}
              />
            </View>
            <View>
              <Hoshi
                label={'Fax'}
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                useNativeDriver={false}
                height={36}
                inputStyle={GlobalStyle.hoshiInputStyle}
                onChangeText={text => this.updateValue(text, 'Fax')}
                value={details.Fax}
                style={GlobalStyle.mt10}
              />
            </View>
            <View>
              <Hoshi
                label={'Homepage'}
                borderColor={'#3F6CB1'}
                borderHeight={2}
                useNativeDriver={false}
                inputPadding={4}
                height={36}
                inputStyle={GlobalStyle.hoshiInputStyle}
                onChangeText={text => this.updateValue(text, 'Homepage')}
                value={details.Homepage}
                style={GlobalStyle.mt10}
              />
            </View>
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
)(EditPersonalInformationScreen);
