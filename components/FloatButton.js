import React, { useEffect } from 'react';
import { View } from 'react-native';
import GlobalStyle, { lightGrey, primaryGreen } from '../style';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { flatten } from '../helpers/flatten';
import { getAuthToken } from '../store/actions/helpers';
import { meineapagapi } from '../env';
import { getUser } from '../store/selectors/user';
import { getCurrentUserDetails } from '../store/actions/user';

const FloatButton = () => {
  const navigation = useNavigation();
  const user = useSelector(getUser);
  const formData = useSelector(state => state.registration);
  const dispatch = useDispatch();
  console.log(formData[formData.type]);
  const isDisabled =
    !Object.values(formData[formData.type].contact).every(value => !!value) ||
    !Object.values(formData[formData.type].customer).every(value => !!value);

  const handleSave = () => {
    dispatch((_, getState) => {
      const state = getState();
      const isPrivate = state.registration.type === 'private';
      const newFormData = JSON.parse(
        JSON.stringify(
          isPrivate
            ? flatten(state.registration[state.registration.type])
            : state.registration[state.registration.type].customer,
        ),
      );
      newFormData.Telefon2 = '';
      newFormData.Fax = '';
      newFormData.Homepage = '';
      if (user.details) {
        newFormData.Email = user.details.Email;
      }
      if (!isPrivate) {
        newFormData.Anrede = 'Firma';
      }
      return getAuthToken(dispatch, getState).then(accessToken => {
        fetch(meineapagapi + 'api/v1/user/updateDetails', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify(newFormData),
        })
          .then(response => response.json())
          .then(responseJson => {
            navigation.navigate('AntragFlow', { screen: 'PaymentMode' });
          });
        if (!isPrivate) {
          // @TODO handle all promises together
          fetch(meineapagapi + 'api/v1/user/createContactPerson', {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + accessToken,
            },
            body: JSON.stringify(
              state.registration[state.registration.type].contact,
            ),
          })
            .then(response => response.json())
            .then(responseJson => responseJson);
        }
      });
    });
  };

  useEffect(() => {
    dispatch(getCurrentUserDetails());
  }, [dispatch]);

  return (
    <View style={FloatButtonStyle.floatButtonView}>
      <View style={[!isDisabled ? FloatButtonStyle.disabled : {}]}>
        <Button
          disabled={false}
          onPress={handleSave}
          style={[
            GlobalStyle.signUpButton,
            {
              textAlign: 'center',
              backgroundColor: isDisabled ? lightGrey : primaryGreen,
            },
          ]}
          labelStyle={GlobalStyle.signUpButtonLabel}
          buttonColor={'grey'}
          mode="contained">
          Weiter
        </Button>
      </View>
    </View>
  );
};

export default FloatButton;

const FloatButtonStyle = StyleSheet.create({
  floatButtonView: {
    paddingTop: 30,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 7,
    height: 80,
    justifyContent: 'center',
  },
  disabled: {
    textAlign: 'center',
    zIndex: 120,
    backgroundColor: primaryGreen,
    borderRadius: 7,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 15,
    shadowColor: primaryGreen,
  },
});
