import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import GlobalStyle from '../style';
import { UPDATE_PASSWORD_FAILURE } from '../store/actions/constants';
import { updatePassword, getCurrentUser } from '../store/actions/user';
import Notice from '../components/notice';
import LoadingScreen from './loading';
import Hoshi from '../components/react-native-textinput-effects/lib/Hoshi';

/**
 * Displays the login screen to Meine APAG.
 *
 * @class PasswordScreen
 * @extends {Component}
 */
class EditSecurityInformationScreen extends Component {
  state = {
    old_password: '',
    new_password: '',
    new_password_retype: '',
    user_name: this.props.user.userObject.user_name,
    isSaving: false,
    errors: null,
    finished: false,
  };

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ save: undefined });
  }

  componentDidMount() {
    // Store the save function and changed state inside the navigation as this allows the save button to be in the header instead of the screen (crazy scope problems with react-navigation)
    this.props.navigation.setParams({
      save: this.updatePassword,
      changed: false,
    });
  }

  /**
   * Executes Redux action login and navigates to Dashboard if successful.
   *
   * @memberof PasswordScreen
   */
  updatePassword = () => {
    const { navigation } = this.props;
    const {
      old_password,
      new_password,
      new_password_retype,
      user_name,
    } = this.state;
    return new Promise((resolve, reject) => {
      // Check if anything has changed
      if (
        old_password !== '' &&
        ((new_password !== '' && new_password_retype !== '') ||
          this.state.user_name !== this.props.user.userObject.user_name)
      ) {
        // Update the state to show a loading indicator
        this.setState({ isSaving: true });
        // Send all necessary information to the Meine APAG API (old_password is always needed to verify the identify of the user)
        this.props
          .updatePassword({
            old_password,
            new_password,
            new_password_retype,
            username: user_name,
          })
          .then(res => {
            // If there were any issues updating the password inform the user
            if (res.type === UPDATE_PASSWORD_FAILURE) {
              this.setState({ isSaving: false, errors: res.errors });
              this.setState({ errors: res.errors });
              Alert.alert('Hinweis', this.buildErrorMessage(res.errors));
              resolve();
              // If everything has worked well retrieve the user from the Meine APAG API again to have a clean Redux store and redirect the user back to the dashboard
            } else {
              this.props.getCurrentUser().then(() => {
                resolve();
                this.setState({ isSaving: false, finished: true });
                setTimeout(() => {
                  navigation.goBack();
                }, 500);
              });
            }
          });
        // If nothing has changed inform the user
      } else {
        Alert.alert(
          'Anmeldung',
          'Zum Speichern der Daten müssen Sie entweder Ihren Anmeldenamen ändern bzw. ein neues Passwort eingeben und anschließend bestätigen!',
        );
        resolve();
      }
    });
  };

  // Updates a field inside the state by setting the exact property in state
  // After changing any value the changed property is set inside the navigation properties which will render the save button
  updateValue = (value, index) => {
    let update = {};
    update[index] = value;

    this.setState(() => update);
    this.props.navigation.setParams({ changed: true });
  };

  // Extracts the error information restructures it to an error message with line breaks for each error
  buildErrorMessage(errors) {
    let message = '';
    let keys = Object.keys(errors);
    for (var i = 0; i < keys.length; i++) {
      if (errors[keys[i]][0] !== 'error') {
        message += errors[keys[i]][0] + '\n';
      }
    }
    return message;
  }

  render() {
    const { isSaving, finished } = this.state;

    // While saving or requesting customer information a loading screen is shown
    if (isSaving || finished) {
      return <LoadingScreen finished={finished} />;
    }

    // @todo do we need a error screen or do all information already exist locally on the device

    const {
      old_password,
      new_password,
      new_password_retype,
      user_name,
    } = this.state;
    // ScrollView using the KeyboardAwareScrollView package to let the screen scroll up when the keyboard is showing up
    // Simple form to update the customer login data like password and username by verifiying the user with the current (old) password
    return (
      <KeyboardAwareScrollView
        style={[
          GlobalStyle.container,
          GlobalStyle.keyboardAwareScrollViewCustomStyle,
        ]}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}>
        <Notice
          texts={[
            'Zum Aktualisieren Ihrer Anmeldedaten geben Sie Ihr aktuelles Passwort und die zu ändernden Datene ein.',
          ]}
        />
        <View>
          <View
            style={[
              GlobalStyle.containerSmallPadding,
              GlobalStyle.noMarginTop,
            ]}>
            <View>
              <Hoshi
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                height={36}
                onChangeText={text => this.updateValue(text, 'old_password')}
                value={old_password}
                inputStyle={GlobalStyle.hoshiInputStyle}
                label="Altes Passwort"
                secureTextEntry={true}
                useNativeDriver={false}
                labelStyle={{}}
              />
            </View>
            <View>
              <Hoshi
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                height={36}
                onChangeText={text => this.updateValue(text, 'new_password')}
                value={new_password}
                inputStyle={GlobalStyle.hoshiInputStyle}
                label="Neues Passwort"
                secureTextEntry={true}
                style={GlobalStyle.mt10}
                useNativeDriver={false}
              />
            </View>
            <View>
              <Hoshi
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                height={36}
                useNativeDriver={false}
                onChangeText={text =>
                  this.updateValue(text, 'new_password_retype')
                }
                value={new_password_retype}
                inputStyle={GlobalStyle.hoshiInputStyle}
                label="Neues Passwort bestätigen"
                secureTextEntry={true}
                style={GlobalStyle.mt10}
              />
            </View>
            <View>
              <Hoshi
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                useNativeDriver={false}
                height={36}
                onChangeText={text => this.updateValue(text, 'user_name')}
                value={user_name}
                inputStyle={GlobalStyle.hoshiInputStyle}
                label="Benutzername"
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
    getCurrentUser: params => dispatch(getCurrentUser(params)),
    updatePassword: params => dispatch(updatePassword(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditSecurityInformationScreen);
