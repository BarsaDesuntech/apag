import { View, Text, Pressable } from 'react-native';
import React from 'react';
import InputBox from './InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateCustomerData } from '../store/actions/registration';
import GlobalStyle, {
  fontScale,
  placeholderColor,
  secondaryBlue,
} from '../style';

const InvoiceFormPrivate = () => {
  const formData = useSelector(state => state.registration.private.customer);
  const dispatch = useDispatch();

  return (
    <View>
      <Text style={[GlobalStyle.title, { paddingTop: 15, paddingBottom: 10 }]}>
        Adressdaten
      </Text>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          style={[
            GlobalStyle.outlineStyle,
            GlobalStyle.customChip,
            {
              marginRight: 5,
              backgroundColor:
                formData.Anrede === 'Herr' ? secondaryBlue : undefined,
            },
          ]}
          onPress={() =>
            dispatch(UpdateCustomerData({ name: 'Anrede', value: 'Herr' }))
          }>
          <Text
            style={{
              textAlign: 'center',
              color: formData.Anrede === 'Herr' ? undefined : placeholderColor,
              fontSize: 16 * fontScale,
            }}>
            Herr
          </Text>
        </Pressable>
        <Pressable
          style={[
            GlobalStyle.outlineStyle,
            GlobalStyle.customChip,
            {
              marginLeft: 5,
              backgroundColor:
                formData.Anrede === 'Frau' ? secondaryBlue : undefined,
            },
          ]}
          onPress={() =>
            dispatch(UpdateCustomerData({ name: 'Anrede', value: 'Frau' }))
          }>
          <Text
            style={{
              textAlign: 'center',
              color: formData.Anrede === 'Frau' ? undefined : placeholderColor,
              fontSize: 16 * fontScale,
            }}>
            Frau
          </Text>
        </Pressable>
      </View>
      <InputBox
        placeholder="Vorname"
        value={formData.Name1}
        onchange={text =>
          dispatch(UpdateCustomerData({ name: 'Name1', value: text }))
        }
      />
      <InputBox
        placeholder="Nachname"
        value={formData.Name2}
        onchange={text =>
          dispatch(UpdateCustomerData({ name: 'Name2', value: text }))
        }
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
      {/* @TODO replace with dropdown */}
      <InputBox
        placeholder="Land"
        value={formData.Land}
        onchange={text =>
          dispatch(UpdateCustomerData({ name: 'Land', value: text }))
        }
      />
    </View>
  );
};

export default InvoiceFormPrivate;
