import React, { useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import GlobalStyle, {
  lightGrey,
  primaryBlue,
  primaryGreen,
  white,
} from '../style';
import { Button } from 'react-native-paper';
import Wrapper from '../components/Wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { AddVehicleDetails } from '../store/actions/registration';
import ShowLicensePlate from '../components/ShowLicensePlate';
import InputBox from '../components/InputBox';
import { VehicleList } from '../helpers/constant';
import { useNavigation } from '@react-navigation/native';

export const CheckSrc = require('../assets/img/check.png');
/**
 * Displays the login screen to Meine APAG.
 *
 * @class AddVehicleScreen
 * @extends {Component}
 */

const AddVehicle = () => {
  const vehicleDetails = useSelector(({ registration: t }) => t.vehicleDetails);
  const paymentMode = useSelector(({ registration: t }) => t.paymentMode);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onPressFunction = useCallback(() => {
    // @TODO add actual functionality
    navigation.navigate('AntragFlow', { screen: 'ConfirmEmail' });
  }, [navigation]);
  const skipFunction = useCallback(() => {
    navigation.navigate('AntragFlow', { screen: 'ConfirmEmail' });
  }, [navigation]);
  const back = useCallback(() => {
    if (paymentMode === 'Lastschrift') {
      navigation.navigate('AntragFlow', { screen: 'DirectDebit' });
    } else if (paymentMode === 'Kreditkarte') {
      navigation.navigate('AntragFlow', { screen: 'CreditCard' });
    } else {
      navigation.navigate('AntragFlow', { screen: 'CreditCard' });
    }
  }, [paymentMode, navigation]);

  return (
    <Wrapper handleBack={back}>
      <View style={[GlobalStyle.noMarginTop, { paddingVertical: 10 }]}>
        <Text
          variant="headlineSmall"
          style={[GlobalStyle.title, { paddingTop: 20 }]}>
          {'Fahrzeug hinzufügen'}
        </Text>
      </View>
      <View>
        {VehicleList.map((list, index) => (
          <View
            key={index}
            style={[
              GlobalStyle.flexDirectionRow,
              { alignItems: 'flex-start', columnGap: 15, marginBottom: 5 },
            ]}>
            <Image
              source={CheckSrc}
              resizeMode={'contain'}
              style={{ height: 20, width: 20, marginTop: 3.5 }}
              fadeDuration={0}
            />
            <Text
              variant="headlineSmall"
              style={[
                GlobalStyle.title,
                GlobalStyle.normal16,
                { marginBottom: 5, paddingLeft: 10, fontWeight: '400' },
              ]}>
              {list}
            </Text>
          </View>
        ))}
      </View>
      <View>
        <InputBox
          value={vehicleDetails?.licensePlate}
          placeholder="KFZ-Kennzeichen"
          onchange={text =>
            dispatch(AddVehicleDetails({ name: 'licensePlate', value: text }))
          }
        />
        <InputBox
          value={vehicleDetails?.vehicleName}
          placeholder="Fahrzeugname (optional)"
          onchange={text =>
            dispatch(AddVehicleDetails({ name: 'vehicleName', value: text }))
          }
        />
      </View>
      <View
        style={[
          GlobalStyle.noMarginTop,
          { flexDirection: 'row', paddingBottom: 20 },
        ]}>
        <Text
          variant="headlineSmall"
          style={[GlobalStyle.title, { paddingTop: 10, fontSize: 16 }]}>
          {'Weitere Fahrzeuge'}{' '}
          <Text
            style={[
              GlobalStyle.consentItemTitle,
              { paddingTop: 20, color: '#324B72' },
            ]}>
            {
              'können Sie jederzeit in Ihren Account-Einstellungen hinzufügen & verwalten.'
            }
          </Text>
        </Text>
      </View>
      {vehicleDetails.licensePlate ? <ShowLicensePlate /> : null}
      <View
        style={[
          StepSheetStyle.buttonGroup,
          { paddingTop: vehicleDetails.licensePlate ? 40 : 117 },
        ]}>
        <View
          style={[
            { width: '100%' },
            Boolean(vehicleDetails.licensePlate)
              ? [
                  GlobalStyle.Shadow15,
                  { backgroundColor: primaryGreen, shadowColor: primaryGreen },
                ]
              : {},
          ]}>
          <Button
            mode="contained"
            onPress={onPressFunction}
            disabled={!vehicleDetails.licensePlate}
            style={[
              GlobalStyle.signUpButton,
              {
                backgroundColor: !Boolean(vehicleDetails.licensePlate)
                  ? lightGrey
                  : primaryGreen,
              },
            ]}
            labelStyle={[
              GlobalStyle.signUpButtonLabel,
              {
                backgroundColor: !Boolean(vehicleDetails.licensePlate)
                  ? lightGrey
                  : primaryGreen,
              },
            ]}>
            Weiter
          </Button>
        </View>
        <Button
          mode="outlined"
          style={[StepSheetStyle.buttonTabs, { marginTop: 5 }]}
          onPress={skipFunction}
          labelStyle={[
            GlobalStyle.signUpButtonLabel,
            StepSheetStyle.buttonLabel,
          ]}>
          Überspringen
        </Button>
      </View>
    </Wrapper>
  );
};

export default AddVehicle;

const StepSheetStyle = StyleSheet.create({
  buttonGroup: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTabs: {
    borderColor: white,
    borderWidth: 0,
    borderRadius: 4,
  },
  buttonLabel: {
    color: primaryBlue,
  },
});
