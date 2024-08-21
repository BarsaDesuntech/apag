import React, { useCallback, useMemo, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import GlobalStyle, { oldBlue, primaryBlue, white } from '../style';
import {
  View,
  Platform,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import { logout } from '../store/actions/user';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconFontawesome4 from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/home';
import ParkhouseScreen from '../screens/parkhouse';
import MapScreen from '../screens/housesMap';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import DashboardScreen from '../screens/dashboard';
import MeineDatenScreen from '../screens/daten';
import EditPersonalInformationScreen from '../screens/editPersonalInformation';
import EditPaymentInformationScreen from '../screens/editPaymentInformation';
import ButtonPrimary from '../components/buttonPrimary';
import PasswordScreen from '../screens/password';
import PasswordResetScreen from '../screens/passwordReset';
import AccessComponent from '../components/accessComponent';
import EditSecurityInformationScreen from '../screens/editSecurityInformation';
import ConsentSettingsScreen from '../screens/consentSettings';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { startNavigation } from '../helpers';
import LaunchPopper from '../screens/launchPopper';
import LaunchLoginScreen from '../screens/launchLoginScreen';
import EmailVerification from '../screens/emailVerification';
import EmailVerificationSuccess from '../screens/emailVerificationSuccess';
import Invoice from '../screens/Invoice';
import PaymentMode from '../screens/PaymentMode';
import DirectDebit from '../screens/DirectDebit';
import AddVehicle from '../screens/AddVehicle';
import ConfirmEmail from '../screens/ConfirmEmail';
import CreditCard from '../screens/CreditCard';
import AntragFlowStepper from '../components/AntragFlowStepper';
import Advantages from '../screens/advantages';
import { getUser } from '../store/selectors/user';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SearchScreen } from '../screens/SearchScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetAndroid } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Button } from 'react-native-paper';
// Import the logo and calculate the display width and height
export const APAGImageSrc = require('../img/logo_apag_light_x2.png');
// Define global image class to use anywhere where needed
const APAGImage = (
  <Image
    source={APAGImageSrc}
    resizeMode={'contain'}
    style={GlobalStyle.fullWidthHeight}
    fadeDuration={0}
  />
);

// Return an settings object for the navigation options based on some title and collor settings
const getTabNavigationOptions = title => ({
  drawerLabel: title,
  title: title,
  inactiveTintColor: '#636363',
});

// Handles the Geo intent in order to initiate the navigation via Google Maps, Apple Maps and Co.
const handleNavigation = (navigation, route) => {
  const { item } = route.params;
  startNavigation(item);
};

const headerStyle = [
  GlobalStyle.primaryBackgroundColor,
  {
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    elevation: 0,
  },
];

const headerOptions = {
  headerStyle,
  headerTitleAlign: 'left',
  headerTitleStyle: GlobalStyle.headerTitleStyle,
  headerTintColor: '#fff',
  headerBackTitle: ' ',
  headerRight: _props => (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        height: '100%',
        paddingVertical: Platform.OS === 'ios' ? 8 : 12,
      }}>
      {APAGImage}
    </View>
  ),
};

const parkhouseHeaderOptions = {
  headerTitle: '',
  headerStyle: {
    backgroundColor: 'transparent',
  },
  headerTintColor: '#fff',
  headerTransparent: true,
  headerBackTitle: ' ',
};

const meineHeaderOptions = {
  headerTitleStyle: headerStyle,
  headerTintColor: '#fff',
  headerStyle: GlobalStyle.primaryBackgroundColor,
};

// Retrieve the tab icon component
const getTabIcon = (iconName, tintColor, size, solid = true) => {
  if (solid) {
    return <Icon name={iconName} size={size} color={tintColor} solid />;
  }
  return <Icon name={iconName} size={size} color={tintColor} light />;
};
const getTabIconAlt = (iconName, tintColor, size, solid = true) => {
  return (
    <Ionicons
      name={iconName + (solid ? '' : '-outline')}
      size={size}
      color={tintColor}
    />
  );
};

// Build navigation options for the Rechnungen Tab / DashboardScreen
const MeineRechnungenOptions = getTabNavigationOptions('Rechnungen');
// Build navigation options for the MeineDatenScreen
const MeineDatenOptions = getTabNavigationOptions('Meine Daten');

/**
 * Simple wrapper for our navigator
 *
 * @class AppNavigation
 * @extends {Component}
 */
const AppNavigation = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const consent = useSelector(({ consent: t }) => t);
  const app = useSelector(({ app: t }) => t);
  const logoutUser = () => dispatch(logout());
  const showMenu = navigation => {
    const handleAction = index => {
      switch (index) {
        case 0:
          Linking.canOpenURL('https://www.apag.de/datenschutz').then(
            supported => {
              if (supported) {
                Linking.openURL('https://www.apag.de/datenschutz');
              } else {
                console.log(
                  "Don't know how to open URI: https://www.apag.de/datenschutz",
                );
              }
            },
          );
          break;
        case 1:
          Linking.canOpenURL('https://www.apag.de/impressum').then(
            supported => {
              if (supported) {
                Linking.openURL('https://www.apag.de/impressum');
              } else {
                console.log(
                  "Don't know how to open URI: https://www.apag.de/impressum",
                );
              }
            },
          );
          break;
        case 2:
          navigation.navigate('GDPR');
          break;
        case 3:
          if (user.isLoggedIn) {
            logoutUser();
          }
          break;
      }
    };
    let actionList = [
      'Datenschutzerklärung',
      'Impressum',
      'Datenschutzeinstellungen',
    ];
    // If the user is logged in the logout will be shown inside this dialog
    if (user.isLoggedIn) {
      actionList.push('Abmelden');
    }
    actionList.push('Abbrechen');
    showActionSheetWithOptions(
      {
        options: actionList,
        cancelButtonIndex: actionList.length - 1,
      },
      handleAction,
    );
  };

  // Stack Navigator for the Parken Tab
  const ParkenListeStackNavigator = createStackNavigator();
  const ParkenListe = (
    <ParkenListeStackNavigator.Navigator
      gestureEnabled={true}
      initialRouteName={'Parken'}>
      <ParkenListeStackNavigator.Screen
        name="Parken"
        component={HomeScreen}
        options={{
          headerTitle: 'Parkmöglichkeiten',
          ...headerOptions,
        }}
      />
      <ParkenListeStackNavigator.Screen
        name="Parkhouse"
        component={ParkhouseScreen}
        options={({ navigation, route }) => ({
          ...parkhouseHeaderOptions,
          headerRight: _props => (
            <TouchableOpacity
              style={GlobalStyle.parkhouseNavigationButton}
              onPress={() => handleNavigation(navigation, route)}>
              <IconFontawesome4 color="#3A5998" name="map-marker" size={24} />
            </TouchableOpacity>
          ),
        })}
      />
    </ParkenListeStackNavigator.Navigator>
  );

  // Stack navigator for Karte/Map tab
  const ParkenKarteStackNavigator = createStackNavigator();
  const ParkenKarte = (
    <ParkenKarteStackNavigator.Navigator
      gestureEnabled={true}
      initialRouteName="Karte">
      <ParkenKarteStackNavigator.Screen
        name="Karte"
        component={MapScreen}
        options={({ navigation }) => ({
          ...parkhouseHeaderOptions,
        })}
      />
      <ParkenKarteStackNavigator.Screen
        name="Parkhouse"
        component={ParkhouseScreen}
        options={({ navigation, route }) => ({
          ...parkhouseHeaderOptions,
          headerRight: _props => (
            <TouchableOpacity
              style={GlobalStyle.parkhouseNavigationButton}
              onPress={() => handleNavigation(navigation, route)}>
              <IconFontawesome4 color="#3A5998" name="map-marker" size={24} />
            </TouchableOpacity>
          ),
        })}
      />
    </ParkenKarteStackNavigator.Navigator>
  );

  // Stack navigator for Karte/Map tab
  const StepperStackNavigator = createStackNavigator();
  const AntragFlow = (
    <StepperStackNavigator.Navigator
      initialRouteName="Register"
      // headerMode="float"

      screenOptions={{
        headerMode: 'float',
        headerStyle: {
          ...GlobalStyle.stepperTitleStyle,
          borderBottomWidth: 0,
          shadowColor: 'transparent',
          shadowOffset: { width: -10, height: -1 }, // Shadow offset (iOS only)
          shadowRadius: 0, // Shadow blur radius (iOS only)
        },
      }}>
      <StepperStackNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          header: () => null,
          headerLeft: () => null,
          headerTitle: () => null,
        }}
      />
      <StepperStackNavigator.Screen
        name="Advantages"
        component={Advantages}
        options={{
          header: () => null,
          headerLeft: () => null,
          headerTitle: () => null,
        }}
      />
      <StepperStackNavigator.Screen
        name="EmailVerification"
        component={EmailVerification}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
      <StepperStackNavigator.Screen
        name="EmailVerificationSuccess"
        component={EmailVerificationSuccess}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
      <StepperStackNavigator.Screen
        name="Invoice"
        component={Invoice}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerBackTitleVisible: false,
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
      <StepperStackNavigator.Screen
        name="PaymentMode"
        component={PaymentMode}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
      <StepperStackNavigator.Screen
        name="DirectDebit"
        component={DirectDebit}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
      <StepperStackNavigator.Screen
        name="CreditCard"
        component={CreditCard}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
      <StepperStackNavigator.Screen
        name="AddVehicle"
        component={AddVehicle}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
      <StepperStackNavigator.Screen
        name="ConfirmEmail"
        component={ConfirmEmail}
        options={{
          headerLeft: () => null,
          headerStyle: {
            ...GlobalStyle.stepperTitleStyle,
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 }, // Shadow offset (iOS only)
            shadowRadius: 0, // Shadow blur radius (iOS only)
          },
          headerTitle: props => <AntragFlowStepper {...props} />,
        }}
      />
    </StepperStackNavigator.Navigator>
  );

  // Tab Navigator for the Meine APAG tab
  // Shows all screens that need authentication
  // Is only used after logging in successfully
  const MeineAPAGStackNavigator = createMaterialTopTabNavigator();
  const MeineAPAGNavigator = (
    <MeineAPAGStackNavigator.Navigator
      initialRouteName="Dashboard"
      tabBarOptions={{
        activeTintColor: '#3A5998',
        inactiveTintColor: '#636363',
        style: {
          backgroundColor: '#fff',
        },
        labelStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: Platform.OS === 'ios' ? 16 : 14,
        },
        indicatorStyle: {
          backgroundColor: '#3A5998',
        },
      }}>
      <MeineAPAGStackNavigator.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={MeineRechnungenOptions}
      />
      <MeineAPAGStackNavigator.Screen
        name="MeineDaten"
        component={MeineDatenScreen}
        options={MeineDatenOptions}
      />
    </MeineAPAGStackNavigator.Navigator>
  );

  // Class showing a save button when the changed navigation parameter is set to true
  // Is used for the edit function after login like edit customer, payment or security information
  class HeaderSaveButton extends React.Component {
    state = {
      disable: false,
    };
    // Executes the save action for button
    action = () => {
      this.setState(() => ({
        disable: true,
      }));
      const { index, routes } = this.props.navigation.dangerouslyGetState();
      const currentRoute = routes[index];
      const action = currentRoute.params ? currentRoute.params.save : undefined;
      if (typeof action !== typeof undefined) {
        action().then(() => {
          this.setState(() => ({ disable: false }));
        });
      }
    };
    render() {
      const { disable } = this.state;
      const { index, routes } = this.props.navigation.dangerouslyGetState();
      const currentRoute = routes[index];
      const changed = currentRoute.params
        ? currentRoute.params.changed
        : undefined;
      const show =
        typeof changed !== typeof undefined && changed ? true : false;
      // If the button should not be shown return null
      if (!show) {
        return null;
      }
      return (
        <ButtonPrimary
          text="Speichern"
          onPress={this.action}
          disable={disable}
          style={[GlobalStyle.headerSaveButton]}
        />
      );
    }
  }

  const meineAPAGTitle = app.app.isInLaunchFlow ? ' ' : 'Meine APAG';

  // Stack navigator for Meine APAG
  // Handles the initial authentication flow
  // There is only "pushed" navigation between the unauthenticated screens or between authenticated screen
  // The Account Tab navigator screen called "MeineAPAG" is only shown by replacing the current navigation stack
  const MeineAPAGGlobalNavigator = createStackNavigator();
  const MeineAPAG = (
    <SafeAreaView style={[{ flex: 1 }, GlobalStyle.primaryBackgroundColor]}>
      <MeineAPAGGlobalNavigator.Navigator
        gestureEnabled={true}
        screenOptions={{
          headerStatusBarHeight: 0,
          headerTitle: 'Meine APAG',

          headerStyle: GlobalStyle.primaryBackgroundColor,
          headerTitleStyle: {
            fontFamily: 'Roboto-Bold',
            fontSize: 18,
            flex: 1,
            alignSelf: 'center',
            textAlign: 'center',
          },
          headerTintColor: '#fff',
          headerBackTitle: 'Zurück',
        }}>
        {!user.isLoggedIn && (
          <MeineAPAGGlobalNavigator.Screen
            name="MeineAPAGLogin"
            component={LoginScreen}
            title="Meine APAG"
            options={({ route }) => ({
              ...meineHeaderOptions,
              title: meineAPAGTitle,
              headerShown: app.app.isInLaunchFlow ? false : true,
            })}
          />
        )}
        {!user.isLoggedIn && (
          <MeineAPAGGlobalNavigator.Screen
            name="MeineAPAGRegister"
            component={RegisterScreen}
            title="Meine APAG"
            options={({ route }) => ({
              ...meineHeaderOptions,
              title: meineAPAGTitle,
              headerShown: app.app.isInLaunchFlow ? false : true,
            })}
          />
        )}
        {!user.isLoggedIn && (
          <MeineAPAGGlobalNavigator.Screen
            name="MeineAPAGPassword"
            component={PasswordScreen}
            options={{
              ...meineHeaderOptions,
              title: meineAPAGTitle,
              headerShown: app.app.isInLaunchFlow ? false : true,
            }}
          />
        )}
        {user.isLoggedIn && user.reset === 'password' && (
          <MeineAPAGGlobalNavigator.Screen
            name="MeineAPAGPasswordReset"
            component={PasswordResetScreen}
            options={{
              ...meineHeaderOptions,
              title: meineAPAGTitle,
            }}
          />
        )}
        {!user.isLoggedIn && (
          <MeineAPAGGlobalNavigator.Screen
            name="AntragFlow"
            options={{
              title: meineAPAGTitle,
              headerTitle: 'Meine APAG',
              ...meineHeaderOptions,
            }}>
            {() => AntragFlow}
          </MeineAPAGGlobalNavigator.Screen>
        )}
        <MeineAPAGGlobalNavigator.Screen
          name="MeineAPAG"
          options={({ navigation }) => ({
            title: meineAPAGTitle,
            headerTitle: 'Meine APAG',
            ...meineHeaderOptions,
            headerRight: _props => (
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: '100%',
                  padding: Platform.OS === 'ios' ? 8 : 12,
                }}>
                <AccessComponent navigation={navigation} />
                {APAGImage}
              </View>
            ),
          })}>
          {() => MeineAPAGNavigator}
        </MeineAPAGGlobalNavigator.Screen>
        <MeineAPAGGlobalNavigator.Screen
          name="EditPersonalInformation"
          component={EditPersonalInformationScreen}
          options={({ navigation }) => ({
            title: 'Meine APAG',
            headerTitle: ' ',
            headerLeft: () => (
              <Ionicons
                name="close"
                size={24}
                color="#3f6cb1"
                style={GlobalStyle.ph15}
                onPress={() => navigation.goBack()}
              />
            ),
            headerStyle: { backgroundColor: '#fff', elevation: 0 },
            headerRight: _props => <HeaderSaveButton navigation={navigation} />,
          })}
        />
        <MeineAPAGGlobalNavigator.Screen
          name="EditPaymentInformation"
          component={EditPaymentInformationScreen}
          options={({ navigation }) => ({
            title: 'Meine APAG',
            headerTitle: ' ',
            headerLeft: () => (
              <Ionicons
                name="close"
                size={24}
                color="#3f6cb1"
                style={GlobalStyle.ph15}
                onPress={() => navigation.goBack()}
              />
            ),
            headerStyle: { backgroundColor: '#fff', elevation: 0 },
            headerRight: _props => <HeaderSaveButton navigation={navigation} />,
          })}
        />
        <MeineAPAGGlobalNavigator.Screen
          name="EditSecurityInformation"
          component={EditSecurityInformationScreen}
          options={({ navigation }) => ({
            title: 'Meine APAG',
            headerTitle: ' ',
            headerLeft: () => (
              <Ionicons
                name="close"
                size={24}
                color="#3f6cb1"
                style={GlobalStyle.ph15}
                onPress={() => navigation.goBack()}
              />
            ),
            headerStyle: { backgroundColor: '#fff', elevation: 0 },
            headerRight: _props => <HeaderSaveButton navigation={navigation} />,
          })}
        />
      </MeineAPAGGlobalNavigator.Navigator>
    </SafeAreaView>
  );

  // Combines all tabs and screen to a bottom navigation for the entire app
  const BottomNavigator = createBottomTabNavigator();
  const ConsentNavigatorStack = createStackNavigator();
  const MainNavigatorStack = createStackNavigator();
  const ConsentNavigatorStackFirst = createStackNavigator();
  const searchBottomSheetRef = useRef(null);
  const [isSearchBottomSheetVisible, setIsSearchBottomSheetVisible] =
    useState(false);
  const snapPoints = useMemo(() => ['25%', '80%'], []);

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setIsSearchBottomSheetVisible(false);
    } else {
      setIsSearchBottomSheetVisible(true);
    }
  }, []);
  return (
    <NavigationContainer>
      <>
        {!consent.consent.filled && (
          <ConsentNavigatorStackFirst.Navigator
            initialRouteName={'Datenschutz'}
            screenOptions={{ headerShown: false }}>
            <ConsentNavigatorStack.Screen
              name={'Datenschutz'}
              component={LaunchPopper}
            />
          </ConsentNavigatorStackFirst.Navigator>
        )}
        {consent.consent.filled && (
          <MainNavigatorStack.Navigator
            gestureEnabled={true}
            initialRouteName={
              consent.consent.filled && !app.app.hasSeenLaunchLoginScreen
                ? 'LaunchPopup'
                : 'Main'
            }
            screenOptions={{ headerShown: false }}>
            <MainNavigatorStack.Screen
              name={'LaunchPopup'}
              component={LaunchLoginScreen}
            />
            <MainNavigatorStack.Screen
              name="AntragFlow"
              options={{
                headerStyle: GlobalStyle.stepperTitleStyle,
              }}>
              {() => AntragFlow}
            </MainNavigatorStack.Screen>
            <MainNavigatorStack.Screen name="Main">
              {() => (
                <BottomNavigator.Navigator
                  initialRouteName="Karte"
                  // tabBarOptions={{
                  //   activeTintColor: oldBlue,
                  //   inactiveTintColor: primaryBlue,
                  //   style: {
                  //     backgroundColor: white,
                  //     fontFamily: 'Roboto',
                  //     display: app.app.isInLaunchFlow ? 'none' : 'flex',
                  //     borderTopWidth: 0,
                  //     height: 90,
                  //     paddingVertical: 5,
                  //   },
                  // }}
                  screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: oldBlue,
                    tabBarInactiveTintColor: primaryBlue,
                    tabBarStyle: {
                      backgroundColor: white,
                      fontFamily: 'Roboto',
                      display: app.app.isInLaunchFlow ? 'none' : 'flex',
                      borderTopWidth: 0,
                      // height: 90,
                      paddingVertical: 5,
                    },
                  }}>
                  <BottomNavigator.Screen
                    name="Karte"
                    options={{
                      tabBarLabel: 'Karte',
                      tabBarIcon: ({ color, size, focused }) =>
                        getTabIconAlt('map', color, size + 2, focused),
                    }}>
                    {() => ParkenKarte}
                  </BottomNavigator.Screen>
                  <BottomNavigator.Screen
                    name="Parken"
                    options={{
                      tabBarLabel: 'Parken',
                      tabBarIcon: ({ color, size, focused }) =>
                        getTabIcon('parking', color, size, focused),
                    }}>
                    {() => ParkenListe}
                  </BottomNavigator.Screen>
                  {/* <BottomNavigator.Screen
                  name="Home"
                  options={{
                    tabBarButton: props => (
                      <TouchableOpacity {...props}>
                        <View
                          style={{
                            height: 60,
                            backgroundColor: primaryBlue,
                            justifyContent: 'center',
                            width: 60,
                            alignItems: 'center',
                            borderRadius: 50,
                          }}>
                          {getTabIconAlt('search', white, 35, false)}
                        </View>
                        <View style={{ height: 30, backgroundColor: white }} />
                      </TouchableOpacity>
                    ),
                  }}>
                  {() => ParkenListe}
                </BottomNavigator.Screen> */}
                  <BottomNavigator.Screen
                    name="Search"
                    listeners={({ navigation }) => ({
                      tabPress: e => {
                        if (e && e.preventDefault) {
                          e.preventDefault();
                        }
                        setIsSearchBottomSheetVisible(true);
                        searchBottomSheetRef.current?.present();
                      },
                      tabLongPress: e => {
                        if (e && e.preventDefault) {
                          e.preventDefault();
                        }
                        setIsSearchBottomSheetVisible(true);
                        searchBottomSheetRef.current?.present();
                      },
                    })}
                    options={{
                      tabBarLabel: 'Search',
                      headerTitle: 'Search',
                      tabBarIcon: ({ color, size, focused }) =>
                        getTabIcon('user', color, size, focused),
                    }}>
                    {() => null}
                  </BottomNavigator.Screen>
                  <BottomNavigator.Screen
                    name="Account"
                    options={{
                      tabBarLabel: 'Meine APAG',
                      headerTitle: 'Meine APAG',
                      tabBarIcon: ({ color, size, focused }) =>
                        getTabIcon('user', color, size, focused),
                    }}>
                    {() => MeineAPAG}
                  </BottomNavigator.Screen>
                  <BottomNavigator.Screen
                    name="Menü"
                    listeners={({ navigation }) => ({
                      tabPress: e => {
                        if (e && e.preventDefault) {
                          e.preventDefault();
                        }

                        showMenu(navigation);
                      },
                      tabLongPress: e => {
                        if (e && e.preventDefault) {
                          e.preventDefault();
                        }
                        showMenu(navigation);
                      },
                    })}
                    options={{
                      tabBarLabel: 'Mehr',
                      tabBarIcon: ({ color, size }) =>
                        getTabIcon('bars', color, size),
                    }}>
                    {() => null}
                  </BottomNavigator.Screen>
                </BottomNavigator.Navigator>
              )}
            </MainNavigatorStack.Screen>
            <MainNavigatorStack.Screen name="GDPR">
              {() => (
                <ConsentNavigatorStack.Navigator initialRouteName="GDPRSettings">
                  <ConsentNavigatorStack.Screen
                    name="GDPRSettings"
                    options={{
                      headerTitle: 'Datenschutzeinstellungen',
                      headerStyle: [
                        GlobalStyle.primaryBackgroundColor,
                        {
                          shadowOpacity: 0,
                          shadowOffset: {
                            height: 0,
                          },
                          shadowRadius: 0,
                          elevation: 0,
                        },
                      ],
                      headerTitleStyle: headerStyle,
                      headerTintColor: '#fff',
                      headerBackTitle: ' ',
                      headerRight: _props => (
                        <View
                          // eslint-disable-next-line react-native/no-inline-styles
                          style={{
                            height: '100%',
                            paddingVertical: Platform.OS === 'ios' ? 8 : 12,
                          }}>
                          {APAGImage}
                        </View>
                      ),
                    }}
                    component={ConsentSettingsScreen}
                  />
                </ConsentNavigatorStack.Navigator>
              )}
            </MainNavigatorStack.Screen>
          </MainNavigatorStack.Navigator>
        )}

        {/* Close Icon Positioned Absolutely */}

        {/* RBSheet */}
        {isSearchBottomSheetVisible ? (
          <TouchableOpacity
            style={{
              position: 'absolute',
              // top: 0,
              top: '18%', // Adjust this value as needed to align the icon with the top of the sheet
              alignSelf: 'center',
              zIndex: 20000,
              backgroundColor: 'white',
              justifyContent: 'center',
              borderRadius: 24,
              padding: 10,
              elevation: 10, // Android shadow
              shadowColor: '#000', // iOS shadow
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
            onPress={() => searchBottomSheetRef.current.close()}>
            <Ionicons name="close" size={24} color={primaryBlue} />
          </TouchableOpacity>
        ) : null}
        <BottomSheetModalProvider>
          <View>
            <BottomSheetModal
              ref={searchBottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              enableOverDrag={false}
              enableDismissOnClose
              enablePanDownToClose={true}
              handleComponent={() => null}
              onChange={handleSheetChanges}>
              <BottomSheetView style={{ flex: 1, paddingTop: 28 }}>
                <View style={{ flex: 1, position: 'relative' }}>
                  <SearchScreen />
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </>
    </NavigationContainer>
  );
};

export default AppNavigation;
