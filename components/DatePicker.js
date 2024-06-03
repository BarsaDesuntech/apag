import React from 'react';
import { SafeAreaView, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { inputOutlineColor } from '../style';
import { useDispatch, useSelector } from 'react-redux';
import { AddCreditCard } from '../store/actions/registration';

const CustomDatePicker = () => {
  const expiryDate = useSelector(
    state => state.registration.creditCard.expiryDate,
  );
  const dispatch = useDispatch();
  const handlerChange = date => {
    dispatch(AddCreditCard({ name: 'expiryDate', value: date }));
  };

  return (
    <SafeAreaView>
      <View>
        <DatePicker
          style={{
            backgroundColor: '#fff',
            marginTop: 5,
            color: 'red',
            width: 80,
            borderWidth: 2,
            borderRadius: 8,
            borderColor: inputOutlineColor,
            height: 50,
            justifyContent: 'center',
          }}
          date={expiryDate}
          mode="date"
          placeholder="MM/JJ"
          format="-MM/YYYY"
          androidVariant="nativeAndroid"
          minDate={new Date()}
          maxDate="01-01-2070"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              right: -5,
              top: 4,
              marginLeft: 0,
              display: 'none',
            },
            dateInput: {
              borderColor: 'gray',
              alignItems: 'center',
              borderWidth: 0,
              borderBottomWidth: 0,
            },
            placeholderText: {
              fontSize: 14,
              color: '#324B72',
            },
            dateText: {
              fontSize: 14,
            },
          }}
          onDateChange={date => handlerChange(date)}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomDatePicker;
