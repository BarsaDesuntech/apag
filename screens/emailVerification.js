import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import GlobalStyle, { primaryBlue } from '../style';
import CountDown from '../components/CountDown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CustomActionSheet } from '../components/ActionSheet';

/**
 * Displays the First screen to Meine APAG.
 *
 * @class EmailVerification
 * @extends {Component}
 */
const EmailVerification = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const token = route.params.token;
  console.log(token);

  const back = useCallback(
    (option, index) => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'AntragFlow',
            params: {
              screen: 'Register',
            },
          },
        ],
      });
    },
    [navigation],
  );

  const next = useCallback(() => {
    navigation.navigate('AntragFlow', { screen: 'EmailVerificationSuccess' });
  }, [navigation]);

  return (
    <View style={[GlobalStyle.container, { backgroundColor: primaryBlue }]}>
      <CustomActionSheet handleBack={back}>
        <View style={[GlobalStyle.noMarginTop]}>
          <Text
            variant="headlineSmall"
            style={[
              GlobalStyle.title,
              {
                marginBottom: 20,
                paddingTop: 20,
                fontWeight: '400',
                width: '100%',
              },
            ]}>
            {
              'In Kürze erhalten Sie von uns einen Bestätigungs-Link per E-Mail mit weiteren Informationen. Bitte prüfen Sie bei Bedarf Ihren Spam-Ordner.'
            }
          </Text>
        </View>
        <CountDown
          minute={1}
          second={0}
          style={{ marginTop: 200 }}
          next={next}
          token={token}
        />
      </CustomActionSheet>
    </View>
  );
};

export default EmailVerification;
