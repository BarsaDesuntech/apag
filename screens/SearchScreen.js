import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import {
  black,
  inputOutlineColor,
  lightGrey,
  oldBlue,
  placeholderColor,
  primaryBlue,
  primaryGreen,
  secondaryBlue,
} from '../style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SuchverlaufItems } from '../components/SearchScreen/SuchverlaufItems';
import { FlatList } from 'react-native-gesture-handler';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

const options = [
  {
    id: 1,
    title: 'Parkmoglichkeiten',
    titleDes: 'in der Nahe',
    des: 'Anzeigen',
    backgroundColor: primaryBlue,
    iconName: 'parking',
  },
  {
    id: 2,
    title: 'E-Ladeplatze',
    titleDes: 'in der Nahe',
    des: 'Anzeigen',
    backgroundColor: primaryGreen,
    iconName: 'charging-station',
  },
  {
    id: 3,
    title: 'Bike-Stations',
    titleDes: 'in der Nahe',
    des: 'Anzeigen',
    backgroundColor: oldBlue,
    iconName: 'pedal-bike',
  },
];

const sucherLaufArray = [
  { id: 1, title: 'Wirichbongar', des: 'Aachen' },
  { id: 2, title: 'TheaterstraBe33', des: 'Aachen' },
  { id: 3, title: 'Wirichbongar', des: 'Aachen' },
  { id: 4, title: 'Adalbersteingweg 123', des: 'Aachen' },
  { id: 5, title: 'FranzstraBe 24', des: 'Aachen' },
];
const searchSuggestion = [
  { id: 1, title: 'TheaterstraBe Aachen  ' },
  { id: 2, title: 'Theaterplatz Aachen' },
  { id: 3, title: 'TheresienstraBe Aachen' },
];
export const SearchScreen = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Theaterstraße  ',
    'Theaterplatz  ',
    'Theresienstraße  ',
  ]);
  const [swipedIndex, setSwipedIndex] = useState([]);
  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter(item =>
    item.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const checkIsSearchOn = searchValue => {
    return searchValue?.length > 0;
  };

  const handleSwipeComplete = (isSwiped, index) => {
    if (isSwiped) {
      setSwipedIndex(prev => [...prev, index]);
    } else {
      setSwipedIndex(prev => prev.filter(i => i !== index));
    }
  };

  // Render each item in the FlatList
  const renderSuggestionItem = ({ item, index }) => {
    const startIndex = item.toLowerCase().indexOf(searchValue.toLowerCase());
    const endIndex = startIndex + searchValue.length;

    // Bold matching text
    const beforeMatch = item.slice(0, startIndex);
    const matchText = item.slice(startIndex, endIndex);
    const afterMatch = item.slice(endIndex);

    return (
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
        <View
          style={[
            {
              backgroundColor: '#fff',
              paddingVertical: 14,
              marginHorizontal: 12,
              paddingHorizontal: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: lightGrey,
              flex: 1,
              elevation: 6,
              borderTopRightRadius: index === 0 ? 8 : 0,
              borderTopLeftRadius: index === 0 ? 8 : 0,
              borderBottomLeftRadius: index === suggestions.length - 1 ? 8 : 0,
              borderBottomRightRadius: index === suggestions.length - 1 ? 8 : 0,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                maxWidth: '86%',
              }}>
              <MaterialIcons name="location-on" size={24} color={primaryBlue} />
              <Text style={styles.suggestionText}>
                {beforeMatch}
                <Text style={styles.boldText}>{matchText}</Text>
                {afterMatch}
                <Text style={{ color: lightGrey }}>Aachen</Text>
              </Text>
            </View>
            <FontAwesome5
              name="chevron-right"
              size={24}
              color={primaryBlue}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        data={[{ key: 'SearchData' }]}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
          backgroundColor: '#fff',
        }}
        stickyHeaderIndices={[0]}
        ListHeaderComponentStyle={{ backgroundColor: '#fff' }}
        ListHeaderComponent={
          <TextInput
            placeholder="Suchen"
            value={searchValue}
            mode="outlined"
            outlineColor={inputOutlineColor}
            activeOutlineColor={lightGrey}
            left={
              <TextInput.Icon icon="magnify" color={primaryBlue} size={28} />
            }
            right={
              checkIsSearchOn(searchValue) ? (
                <TextInput.Icon
                  icon={'close'}
                  color={'#000'}
                  onPress={() => setSearchValue('')}
                />
              ) : (
                {}
              )
            }
            style={{
              backgroundColor: '#fff',
              marginVertical: 10,
              marginHorizontal: 10,
            }}
            outlineStyle={{ borderWidth: 3, borderRadius: 12 }}
            placeholderTextColor={placeholderColor}
            onChangeText={text => setSearchValue(text)}
          />
        }
        renderItem={() => (
          <>
            {checkIsSearchOn(searchValue) ? (
              <View
                style={[
                  Platform.OS === 'ios' && styles.shadowStyle,
                  {
                    flex: 1,
                  },
                ]}>
                <BottomSheetFlatList
                  data={filteredSuggestions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderSuggestionItem}
                  style={styles.suggestionList}
                />
              </View>
            ) : null}
            {checkIsSearchOn(searchValue)
              ? null
              : options.map(item => (
                  <View
                    key={item.id}
                    style={[
                      styles.listContainer,
                      { backgroundColor: item.backgroundColor },
                    ]}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {item.iconName === 'pedal-bike' ? (
                        <MaterialIcons
                          name={item.iconName}
                          color={'#fff'}
                          size={26}
                        />
                      ) : (
                        <FontAwesome5
                          name={item.iconName}
                          color={'#fff'}
                          size={26}
                        />
                      )}
                      <Text style={styles.titleStyle}>
                        {item.title}{' '}
                        <Text style={[styles.textWhite, { fontWeight: '400' }]}>
                          {item.titleDes}
                        </Text>
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.titleStyle,
                        { paddingRight: 4, fontWeight: '600' },
                      ]}>
                      {item.des}
                    </Text>
                  </View>
                ))}
            {!checkIsSearchOn(searchValue) ? (
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontWeight: '700',
                  color: placeholderColor,
                  paddingLeft: 10,
                  marginVertical: 8,
                }}>
                Suchverlauf
              </Text>
            ) : null}
            {checkIsSearchOn(searchValue) ? null : (
              <FlatList
                data={sucherLaufArray}
                renderScrollComponent={ScrollView}
                nestedScrollEnabled
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <SuchverlaufItems
                    item={item}
                    onSwipeComplete={swiped =>
                      handleSwipeComplete(swiped, index)
                    }
                    swipedIndexItem={swipedIndex}
                    index={index}
                    contentContainerStyle={{ marginVertical: 8 }}
                  />
                )}
              />
            )}
          </>
        )}
      />

      <View style={[styles.floatingButtonContainer, styles.shadowStyle]}>
        <Text
          style={{
            color: primaryBlue,
            fontWeight: '700',
            fontFamily: 'Roboto-Bold',
            fontSize: 16,
          }}>
          Mehr anzeigen
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontFamily: 'Roboto-Bold',
    color: '#FFF',
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '900',
  },
  textWhite: {
    fontFamily: 'Roboto-Medium',
    color: '#FFF',
    fontSize: 14,
    paddingRight: 4,
  },
  listContainer: {
    backgroundColor: primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8 + 4,
    marginBottom: 8,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, // Shadow at the bottom
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Shadow for Android
    elevation: 10,
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, // Shadow at the bottom
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Shadow for Android
    elevation: 10,
  },
  floatingButtonContainer: {
    backgroundColor: secondaryBlue,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 40,
    borderRadius: 8,
  },
  suggestionList: {
    marginTop: 2,
  },
  suggestionItem: {
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: 'roboto-light',
    marginLeft: 8,
    color: black,
    fontWeight: '400',
  },
  boldText: {
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
});
