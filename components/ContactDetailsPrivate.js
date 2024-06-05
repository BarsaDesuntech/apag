import { View, Text } from 'react-native';
import React from 'react';
import InputBox from './InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateContactData } from '../store/actions/registration';
import GlobalStyle, {
  InputColor,
  fontScale,
  inputOutlineColor,
  placeholderColor,
} from '../style';
import DatePicker from 'react-native-datepicker';

const ContactDetailsPrivate = () => {
  const formData = useSelector(state => state.registration.private.contact);
  const dispatch = useDispatch();

  return (
    <View>
      <Text style={[GlobalStyle.title, { paddingVertical: 15 }]}>
        Kontaktdaten
      </Text>
      <InputBox
        placeholder="Telefonnummer"
        value={formData.Telefon1}
        onchange={text =>
          dispatch(UpdateContactData({ name: 'Telefon1', value: text }))
        }
      />
      <DatePicker
        is24Hour={true}
        date={formData.Geburtsdatum}
        mode="date"
        useNativeDriver={false}
        placeholder="Geburtsdatum (TT.MM.JJJJ)"
        format="DD.MM.YYYY"
        confirmBtnText="Bestätigen"
        iconComponent={<></>}
        cancelBtnText="Abbrechen"
        customStyles={{
          dateInput: [GlobalStyle.dateInput, { textAlign: 'left' }],
          placeholderText: {
            color: placeholderColor,
            alignSelf: 'flex-start',
            marginLeft: 15,
            fontSize: 16 * fontScale,
          },
          dateText: {
            color: InputColor,
            alignSelf: 'flex-start',
            marginLeft: 15,
            fontSize: 16 * fontScale,
          },
        }}
        style={[
          GlobalStyle.outlineStyle,
          {
            width: '100%',
            borderColor: inputOutlineColor,
            marginTop: 4,
            paddingVertical: 2,
          },
        ]}
        onDateChange={date =>
          dispatch(UpdateContactData({ name: 'Geburtsdatum', value: date }))
        }
      />
      {/* @TODO add abweichende Lieferadresse */}
    </View>
  );
};

export default ContactDetailsPrivate;
