import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RadioButton } from 'react-native-paper';
import GlobalStyle, { inputOutlineColor, primaryBlue } from '../style';
import { useDispatch, useSelector } from 'react-redux';
import { SetPaymentMode } from '../store/actions/registration';

const sepa_payment = require('../assets/img/sepa_payment.png');
// const visa_payment = require('../assets/img/visa_payment.png');
// const master_card_payment = require('../assets/img/master_card_payment.png');
// const paypal_payment = require('../assets/img/paypal_payment.png');

export const options = [
  { label: 'Lastschrift', value: 'Lastschrift', img: [sepa_payment] },
  // {
  //   label: 'Kreditkarte',
  //   value: 'Kreditkarte',
  //   img: [visa_payment, master_card_payment],
  // },
  // { label: 'PayPal', value: 'PayPal', img: [paypal_payment] },
];

const RadioButtonGroup = () => {
  const dispatch = useDispatch();
  const paymentMode = useSelector(({ registration: t }) => t.paymentMode);

  return (
    <RadioButton.Group
      onValueChange={newValue => dispatch(SetPaymentMode(newValue))}
      value={paymentMode}>
      {options.map((item, index) => (
        <Pressable
          onPress={() => dispatch(SetPaymentMode(item.value))}
          key={index}
          style={[
            index === 0
              ? {
                  borderColor: '#E0E6ED',
                  borderStyle: 'solid',
                  borderTopWidth: 2,
                }
              : '',
          ]}>
          <View style={[StepSheetStyle.itemView]}>
            <View style={[GlobalStyle.flexDirectionRow, StepSheetStyle.item]}>
              <RadioButton.Android
                value={item.value}
                color={primaryBlue}
                uncheckedColor="#E0E6ED"
                style={StepSheetStyle.radioItem}
              />
              <Text style={[GlobalStyle.title, { color: primaryBlue }]}>
                {item.label}
              </Text>
            </View>
            <View
              style={item.img.length === 2 ? GlobalStyle.flexDirectionRow : ''}>
              {item.img.map(list => (
                <View
                  key={list}
                  style={[
                    StepSheetStyle.ImgBorder,
                    { width: 70, height: 50, marginRight: 1 },
                  ]}>
                  <Image
                    source={list}
                    resizeMode={'contain'}
                    style={{ width: 50, height: 50 }}
                  />
                </View>
              ))}
            </View>
          </View>
        </Pressable>
      ))}
    </RadioButton.Group>
  );
};

export default RadioButtonGroup;

const StepSheetStyle = StyleSheet.create({
  item: {
    alignItems: 'center',
  },
  itemView: {
    borderColor: '#E0E6ED',
    borderStyle: 'solid',
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ImgBorder: {
    borderWidth: 3,
    borderColor: inputOutlineColor,
    borderRadius: 7,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
