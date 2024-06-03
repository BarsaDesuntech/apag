import React, { useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import GlobalStyle, { primaryGreen } from '../style';
import { Button } from 'react-native-paper';
import {
  hasSeenLaunchLoginScreen,
  setIsInLaunchFlow,
} from '../store/actions/settings';
import WrapperAction from '../components/WrapperAction';
import { AccountList } from '../helpers/constant';

export const CheckSrc = require('../assets/img/check.png');

const Advantages = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const back = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'LaunchPopup' }],
    });
  }, [navigation]);

  const skip = useCallback(
    (option, index) => {
      dispatch(setIsInLaunchFlow(false));
      dispatch(hasSeenLaunchLoginScreen(true));
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    },
    [navigation, dispatch],
  );

  const next = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AntragFlow',
          params: {
            screen: 'RegisterForm',
          },
        },
      ],
    });
  }, [navigation]);

  return (
    <WrapperAction handleBack={back}>
      <View
        style={[GlobalStyle.containerSmallPadding, GlobalStyle.noMarginTop]}>
        <Text
          variant="headlineSmall"
          style={[
            GlobalStyle.title,
            GlobalStyle.mb20,
            { alignSelf: 'center', textAlign: 'center', paddingTop: 20 },
          ]}>
          {'Mit einem meine.apag-Account genießen Sie u.a.'}
        </Text>
        <View>
          {AccountList.map(list => (
            <View
              key={list}
              style={[GlobalStyle.flexDirectionRow, { marginBottom: 5 }]}>
              <Image
                source={CheckSrc}
                resizeMode={'contain'}
                style={{ height: 20, width: 20, marginTop: 3 }}
                fadeDuration={0}
              />
              <Text
                variant="headlineSmall"
                style={[
                  GlobalStyle.invoiceNumber,
                  {
                    alignSelf: 'center',
                    paddingLeft: 10,
                    fontWeight: '300',
                    color: '#324B72',
                  },
                ]}>
                {list}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={[
            GlobalStyle.Shadow15,
            {
              marginTop: 200,
              overflow: 'hidden',
              borderRadius: 8,
              width: '97%',
              shadowColor: primaryGreen,
            },
          ]}>
          <Button
            onPress={next}
            style={[GlobalStyle.signUpButton]}
            labelStyle={[GlobalStyle.signUpButtonLabel]}
            mode="contained">
            Account erstellen
          </Button>
        </View>
        <Button
          onPress={skip}
          style={GlobalStyle.skipButton}
          labelStyle={GlobalStyle.skipButtonLabel}
          mode="text">
          Trotzdem überspringen
        </Button>
      </View>
    </WrapperAction>
  );
};

export default Advantages;
