import { View, Text } from 'react-native';
import React from 'react';
import InputBox from './InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateCustomerData } from '../store/actions/registration';
import GlobalStyle from '../style';

const InvoiceFormCompany = () => {
  const formData = useSelector(state => state.registration.company.customer);
  const dispatch = useDispatch();

  return (
    <View>
      <Text style={[GlobalStyle.title, { paddingVertical: 15 }]}>
        Firmendaten
      </Text>
      <InputBox
        placeholder="Firmenname"
        value={formData.Name1}
        onchange={text => {
          dispatch(UpdateCustomerData({ name: 'Name1', value: text }));
          dispatch(UpdateCustomerData({ name: 'Name2', value: text }));
        }}
      />
      <InputBox
        placeholder="Straße + Hausnummer"
        value={formData.Strasse}
        onchange={text =>
          dispatch(UpdateCustomerData({ name: 'Strasse', value: text }))
        }
      />
      <InputBox
        placeholder="PLZ"
        value={formData.PLZ}
        onchange={text =>
          dispatch(UpdateCustomerData({ name: 'PLZ', value: text }))
        }
      />
      <InputBox
        placeholder="Ort"
        value={formData.Ort}
        onchange={text =>
          dispatch(UpdateCustomerData({ name: 'Ort', value: text }))
        }
      />
      <InputBox
        placeholder="Land"
        value={formData.Land}
        onchange={text =>
          dispatch(UpdateCustomerData({ name: 'Land', value: text }))
        }
      />
      {/* @TODO add lieferadresse */}
      {/* @TODO add rechnungsadresse */}
    </View>
  );
};

export default InvoiceFormCompany;
