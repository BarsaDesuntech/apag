import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { lightGrey, lightGrey200, primaryBlue } from '../../style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export const SuchverlaufItems = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <FontAwesome5 name="clock" color={primaryBlue} size={24} />
        <View style={{ marginLeft: 12 }}>
          <Text
            style={{
              fontFamily: 'roboto-medium',
              fontWeight: '400',
              fontSize: 16,
            }}>
            {item?.title}
          </Text>
          <Text
            style={{
              fontFamily: 'roboto-medium',
              fontWeight: '400',
              //   color: lightGrey,
              fontSize: 12,
            }}>
            {item?.des}
          </Text>
        </View>
      </View>
      <FontAwesome
        name={isFavorite ? 'heart' : 'heart-o'}
        size={24}
        color={isFavorite ? 'red' : primaryBlue}
        key={item.id}
        onPress={() => setIsFavorite(!isFavorite)}
      />
    </View>
  );
};
