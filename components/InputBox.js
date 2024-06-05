import React from 'react';
import { TextInput } from 'react-native-paper';
import GlobalStyle, {
  InputColor,
  inputOutlineColor,
  placeholderColor,
} from '../style';

const InputBox = ({ value, onchange, placeholder }) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      mode="outlined"
      outlineColor={inputOutlineColor}
      activeOutlineColor={inputOutlineColor}
      style={GlobalStyle.textInputStyle}
      outlineStyle={GlobalStyle.outlineStyle}
      placeholderTextColor={placeholderColor}
      onChangeText={text => onchange(text)}
      contentStyle={{ color: InputColor }}
    />
  );
};

export default InputBox;
