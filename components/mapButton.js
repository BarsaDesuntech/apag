import React from 'react';
import { TouchableOpacity } from 'react-native';
import { white } from '../style';

export const MapButton = ({ children, ...rest }) => (
  <TouchableOpacity
    style={{
      backgroundColor: white,
      borderRadius: 50,
      padding: 8,
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      width: 40,
    }}
    {...rest}>
    {children}
  </TouchableOpacity>
);
