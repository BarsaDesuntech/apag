import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';
import LoadingScreen from '../screens/loading';
import { getCurrentUserDetails } from '../store/actions/user';
import ErrorScreen from '../screens/error';

/**
 * Renders a list of all existing invoices for the current loggedin customer.
 *
 * @class MeineDatenScreen
 * @extends {Component}
 */
class MeineDatenScreen extends Component {
  static propTypes = {
    user: PropTypes.object,
  };

  componentDidMount() {
    // Initiate API call to get the current user details
    this.props.getCurrentUserDetails();
  }

  // Some simple redirect functions
  editPersonalInformation = () => {
    const { navigation } = this.props;
    navigation.navigate('EditPersonalInformation');
  };

  editPaymentInformation = () => {
    const { navigation } = this.props;
    navigation.navigate('EditPaymentInformation');
  };

  editSecurityInformation = () => {
    const { navigation } = this.props;
    navigation.navigate('EditSecurityInformation');
  };

  render() {
    const { user } = this.props;
    const { details } = user;

    // Show loading screen if no details are found and isFetching is true
    if (
      (typeof details === typeof undefined || details === null) &&
      user.isFetching
    ) {
      return <LoadingScreen />;
    }

    // If no details are found here show an error screen
    if (details === null || typeof details === typeof undefined) {
      return <ErrorScreen />;
    }

    // Renders a simple overview above all customer information like address, payment, username and so on => nothing complicated
    return (
      <View style={[GlobalStyle.minHeight100, GlobalStyle.whiteBackground]}>
        <ScrollView
          contentContainerStyle={GlobalStyle.scrollView15}
          refreshControl={
            <RefreshControl
              refreshing={user.isFetching}
              onRefresh={() => this.props.getCurrentUserDetails()}
              tintColor="#3A5998"
              colors={['#3A5998']}
            />
          }>
          <View>
            <View style={[GlobalStyle.data, GlobalStyle.whiteBackground]}>
              <TouchableHighlight
                underlayColor="#f4f4f4"
                style={GlobalStyle.borderRadius5}
                onPress={this.editPersonalInformation}>
                <View style={GlobalStyle.datenContainer}>
                  <View style={GlobalStyle.datenContainerLayout}>
                    <Text
                      style={[
                        GlobalStyle.dataHeader,
                        GlobalStyle.primaryTextColor,
                      ]}>
                      Adressdaten
                    </Text>
                    <Icon size={26} name="md-create" color="#3f6cb1" />
                  </View>
                  <Text style={[GlobalStyle.dataNumber]}>
                    {details.Name2 + ' ' + details.Name1}
                  </Text>
                  <Text style={[GlobalStyle.dataNumber]}>
                    {details.Strasse}
                  </Text>
                  <Text style={[GlobalStyle.dataNumber]}>
                    {details.PLZ + ' ' + details.Ort}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={[GlobalStyle.data, GlobalStyle.whiteBackground]}>
              <TouchableHighlight
                underlayColor="#f4f4f4"
                style={GlobalStyle.borderRadius5}
                onPress={this.editPaymentInformation}>
                <View style={GlobalStyle.datenContainer}>
                  <View style={GlobalStyle.datenContainerLayout}>
                    <Text
                      style={[
                        GlobalStyle.dataHeader,
                        GlobalStyle.primaryTextColor,
                      ]}>
                      Zahlungsdaten
                    </Text>
                    <Icon size={26} name="md-create" color="#3f6cb1" />
                  </View>
                  {details.Zahlart === 'SEPA-Basislastschrift (CORE)' && (
                    <View>
                      <Text style={[GlobalStyle.dataNumber]}>
                        {details.IBAN}
                      </Text>
                      <Text style={[GlobalStyle.dataNumber]}>
                        {details.BIC}
                      </Text>
                    </View>
                  )}
                  {details.Zahlart === 'Bankeinzug' && (
                    <View>
                      <Text style={[GlobalStyle.dataNumber]}>
                        {details.Bank}
                      </Text>
                      <Text style={[GlobalStyle.dataNumber]}>
                        {'Kontonummer endet auf: ...' + details.Kontonummer}
                      </Text>
                      <Text style={[GlobalStyle.dataNumber]}>
                        {'BLZ: ' + details.BLZ}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            </View>
            <View style={[GlobalStyle.data, GlobalStyle.whiteBackground]}>
              <TouchableHighlight
                underlayColor="#f4f4f4"
                style={GlobalStyle.borderRadius5}
                onPress={this.editSecurityInformation}>
                <View style={GlobalStyle.datenContainer}>
                  <View style={GlobalStyle.datenContainerLayout}>
                    <Text
                      style={[
                        GlobalStyle.dataHeader,
                        GlobalStyle.primaryTextColor,
                      ]}>
                      Anmeldung und Sicherheit
                    </Text>
                    <Icon size={26} name="md-create" color="#3f6cb1" />
                  </View>
                  <View style={GlobalStyle.flexDirectionRow}>
                    <Text style={[GlobalStyle.dataNumber]}>Benutzername: </Text>
                    <Text style={[GlobalStyle.dataNumber]}>
                      {user && user.userObject && user.userObject.user_name}
                    </Text>
                  </View>
                  <View style={GlobalStyle.flexDirectionRow}>
                    <Text style={[GlobalStyle.dataNumber]}>Passwort: </Text>
                    <Text style={[GlobalStyle.dataNumber]}>**********</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MeineDatenScreen);
