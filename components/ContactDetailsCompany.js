import { View, Text } from 'react-native';
import React from 'react';
import InputBox from './InputBox';
import { useDispatch, useSelector } from 'react-redux';
import {
  UpdateContactData,
  UpdateCustomerData,
} from '../store/actions/registration';
import GlobalStyle from '../style';

const ContactDetailsCompany = () => {
  const formData = useSelector(state => state.registration.company.contact);
  const dispatch = useDispatch();

  return (
    <View>
      <Text style={[GlobalStyle.title, { paddingVertical: 15 }]}>
        Ansprechpartner
      </Text>
      <InputBox
        placeholder="Anrede"
        value={formData.contact_person_anrede}
        onchange={text =>
          dispatch(
            UpdateContactData({ name: 'contact_person_anrede', value: text }),
          )
        }
      />
      <InputBox
        placeholder="Vorname"
        value={formData.contact_person_firstname}
        onchange={text =>
          dispatch(
            UpdateContactData({
              name: 'contact_person_firstname',
              value: text,
            }),
          )
        }
      />
      <InputBox
        placeholder="Nachname"
        value={formData.contact_person_surname}
        onchange={text =>
          dispatch(
            UpdateContactData({ name: 'contact_person_surname', value: text }),
          )
        }
      />
      <InputBox
        placeholder="Telefonnummer"
        value={formData.phone}
        onchange={text => {
          dispatch(UpdateContactData({ name: 'phone', value: text }));
          dispatch(UpdateCustomerData({ name: 'Telefon1', value: text }));
        }}
      />
      {/* @TODO add abweichende Lieferadresse */}
    </View>
  );
};

export default ContactDetailsCompany;
