import { View, Text, Image } from 'react-native';
import React from 'react';
import { Switch } from 'react-native-paper';
import GlobalStyle, { primaryBlue } from '../style';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AddVehicleDetails } from '../store/actions/registration';

export const CheckSrc = require('../assets/img/check.png');

const ShowLicensePlate = () => {
  const vehicleDetails = useSelector(({ registration: t }) => t.vehicleDetails);
  const dispatch = useDispatch();

  return (
    <>
      <View
        style={[
          GlobalStyle.noMarginTop,
          { marginLeft: -5 },
          StepSheetStyle.checkBoxContent,
        ]}>
        <Text
          variant="headlineSmall"
          style={[GlobalStyle.title, { width: '80%' }]}>
          {'Kennzeichen-Erkennung aktivieren'}
        </Text>
        <Switch
          color={primaryBlue}
          value={vehicleDetails.activateLicense}
          onValueChange={() =>
            dispatch(
              AddVehicleDetails({
                name: 'activateLicense',
                value: !vehicleDetails.ActivateLicense,
              }),
            )
          }
        />
      </View>
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            columnGap: 15,
            marginBottom: 5,
          }}>
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
              { alignSelf: 'center', paddingLeft: 10, fontWeight: '400' },
            ]}>
            {
              'Ticket-, Bargeld- und Kontaktloses Ein- und Ausfahren in den APAG-Parkobjekten'
            }
          </Text>
        </View>
        <View
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
            {
              'Erweiterte Parkberechtigung für die Parkobjekte der APAG als Anwohner mit Parkberechtigungsschein'
            }
          </Text>
        </View>
      </View>
    </>
  );
};

export default ShowLicensePlate;

const StepSheetStyle = StyleSheet.create({
  checkBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignContent: 'space-between',
    marginBottom: 10,
  },
});
