import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GlobalStyle, { primaryGreen } from '../style';
import { Button } from 'react-native-paper';
import { checkVerified } from '../store/actions/user';
import { useDispatch } from 'react-redux';
import { LOGGED_IN } from '../store/actions/constants';
import { meineapagapi } from '../env';

const CountDown = ({ minute = 1, second = 30, style, next, token }) => {
  const dispatch = useDispatch();
  const checkRequest = useRef(null);
  const interval = useRef(null);
  const [minutes, setMinutes] = useState(minute);
  const [seconds, setSeconds] = useState(second);

  const resendEmail = () => {
    fetch(meineapagapi + 'api/register/email/resend_email/' + token + '/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        clearInterval(interval.current);
        interval.current = null;
        setMinutes(minute);
        setSeconds(second);
      })
      .catch(() => {});
  };

  /**
   * Handles Timer for next
   */
  useEffect(() => {
    if (!interval.current) {
      interval.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          // Right now not stopping to pull on last minute
          if (minutes === 0) {
            // clearInterval(interval.current);
            // interval.current = null;
          } else {
            setSeconds(59);
            setMinutes(minutes - 1);
          }
        }
        if (!checkRequest.current) {
          checkRequest.current = dispatch(checkVerified({ token, next }))
            .then(e => {
              console.log(e);
              if (e.type === LOGGED_IN) {
                clearInterval(interval);
              } else {
                checkRequest.current = null;
              }
            })
            .catch(() => {
              checkRequest.current = null;
            });
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval.current);
      interval.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, minutes]);

  return (
    <View style={style}>
      <View style={{ marginVertical: 20 }}>
        {seconds > 0 || minutes > 0 ? (
          <Text style={StepSheetStyle.otpText}>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </Text>
        ) : (
          <Text style={StepSheetStyle.otpText}>00:00</Text>
        )}
      </View>
      <View
        style={[
          { marginBottom: 15 },
          seconds > 0 || minutes > 0
            ? {}
            : [
                GlobalStyle.Shadow15,
                {
                  backgroundColor: primaryGreen,
                  width: '100%',
                  shadowColor: primaryGreen, // Shadow color (iOS only)
                },
              ],
        ]}>
        <Button
          style={[
            seconds > 0 || minutes > 0
              ? GlobalStyle.disableButton
              : GlobalStyle.signUpButton,
          ]}
          onPress={() => resendEmail()}
          disabled={seconds > 0 || minutes > 0}
          labelStyle={GlobalStyle.signUpButtonLabel}
          buttonColor={'grey'}
          mode="contained">
          Erneut senden
        </Button>
      </View>
    </View>
  );
};

export default CountDown;

const StepSheetStyle = StyleSheet.create({
  otpText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
  },
});
