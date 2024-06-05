import React from 'react';
import { View, Text } from 'react-native';
import GlobalStyle, { primaryBlue, primaryGreen } from '../style';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomActionSheet } from '../components/ActionSheet';

const EmailVerificationSuccess = props => {
  const navigation = useNavigation();
  return (
    <View style={[GlobalStyle.container, { backgroundColor: primaryBlue }]}>
      <CustomActionSheet checkTrue={true}>
        <View style={[GlobalStyle.noMarginTop]}>
          <Text
            variant="headlineSmall"
            style={[GlobalStyle.title, { paddingTop: 20, fontWeight: '400' }]}>
            {'Ihre E-Mail-Adresse wurde soeben'}
          </Text>
          <Text style={[GlobalStyle.title, { marginBottom: 20 }]}>
            {'erfolgreich verifiziert.'}
          </Text>
        </View>
        <View
          style={[
            GlobalStyle.Shadow15,
            { marginTop: 300, marginBottom: 15, shadowColor: primaryGreen },
          ]}>
          <Button
            onPress={() =>
              navigation.navigate('AntragFlow', { screen: 'Invoice' })
            }
            style={GlobalStyle.signUpButton}
            labelStyle={GlobalStyle.signUpButtonLabel}
            buttonColor={'grey'}
            mode="contained">
            Weiter
          </Button>
        </View>
      </CustomActionSheet>
    </View>
  );
};

export default EmailVerificationSuccess;
