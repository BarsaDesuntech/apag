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
  darkBlue,
  inputOutlineColor,
  lightGrey,
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
import { useSelector, useDispatch } from 'react-redux';
import searchPark from '../store/reducers/searchPark';
import { useNavigation } from '@react-navigation/native';
import {
  SET_NEAR_BY_PARK,
  SET_RECENT_SEARCH,
  SET_VISIBLE_SEARCH_BOTTOM_SHEET,
} from '../store/actions/constants';
const options = [
  {
    id: 1,
    title: 'Parkmoglichkeiten',
    titleDes: 'in der Nähe',
    des: 'Anzeigen',
    backgroundColor: primaryBlue,
    iconName: 'parking',
    type: 'car',
  },
  {
    id: 2,
    title: 'E-Ladeplatze',
    titleDes: 'in der Nähe',
    des: 'Anzeigen',
    backgroundColor: primaryGreen,
    iconName: 'charging-station',
    type: 'station',
  },
  {
    id: 3,
    title: 'Bike-Stations',
    titleDes: 'in der Nähe',
    des: 'Anzeigen',
    backgroundColor: darkBlue,
    iconName: 'pedal-bike',
    type: 'bike',
  },
];

export const SearchScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { parkhouses } = useSelector(state => state.parkhouses);
  const { recentSearches } = useSelector(state => state.searchPark);

  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState(parkhouses ?? []);
  const [visibleItems, setVisibleItems] = useState(5);
  const [swipedIndex, setSwipedIndex] = useState([]);
  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter(item =>
    item?.name?.toLowerCase().includes(searchValue.toLowerCase()),
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
  const handlePressSearchParkName = item => {
    const newRecentSearchObj = {
      id: item?.id,
      legacy_id: item?.legacy_id,
      name: item?.name,
    };
    const existingIndex = recentSearches.findIndex(
      search => search?.id === item?.id,
    );

    let updatedSearches;
    if (existingIndex >= 0) {
      // Page already exists, update it and move to top
      updatedSearches = [
        newRecentSearchObj,
        ...recentSearches.filter(search => search.id !== item?.id),
      ];
    } else {
      updatedSearches = [newRecentSearchObj, ...recentSearches];
    }

    dispatch({
      type: SET_RECENT_SEARCH,
      payload: updatedSearches,
    });
    dispatch({
      type: SET_VISIBLE_SEARCH_BOTTOM_SHEET,
      payload: false,
    });
    navigation.navigate('Parkhouse', {
      phid: item.id,
      item: item,
    });
  };
  const handleDeleteRecentSearch = id => {
    const updatedSearches = recentSearches.filter(search => search.id !== id);
    dispatch({
      type: SET_RECENT_SEARCH,
      payload: updatedSearches, // Send the updated list of recent searches
    });
  };
  const handlePressOnRecentItem = item => {
    dispatch({
      type: SET_VISIBLE_SEARCH_BOTTOM_SHEET,
      payload: false,
    });
    navigation.navigate('Parkhouse', {
      phid: item.id,
      item: item,
    });
  };
  const handleFavoriteMark = (favorite, id) => {
    const updatedSearches = recentSearches.map(item =>
      item.id === id ? { ...item, isFavorite: favorite } : item,
    );
    dispatch({
      type: SET_RECENT_SEARCH,
      payload: updatedSearches, // Send the updated list of recent searches
    });
  };
  const loadMoreItems = () => {
    if (visibleItems <= recentSearches.length) {
      setVisibleItems(prev => prev + 5); // Load 5 more items
    }
  };
  // Render each item in the FlatList
  const renderSuggestionItem = ({ item, index }) => {
    const startIndex = item?.name
      ?.toLowerCase()
      .indexOf(searchValue.toLowerCase());
    const endIndex = startIndex + searchValue.length;

    // Bold matching text
    const beforeMatch = item?.name?.slice(0, startIndex);
    const matchText = item?.name?.slice(startIndex, endIndex);
    const afterMatch = item?.name?.slice(endIndex);

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={() => handlePressSearchParkName(item)}>
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
                <Text style={{ color: lightGrey }}> Aachen</Text>
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
        nestedScrollEnabled={true}
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
              height: 44,
            }}
            outlineStyle={{ borderWidth: 1, borderRadius: 12 }}
            placeholderTextColor={placeholderColor}
            onChangeText={text => setSearchValue(text)}
          />
        }
        renderItem={() => (
          <View style={{ flex: 1 }}>
            {/* Suggestion */}
            {checkIsSearchOn(searchValue) ? (
              <View
                style={[
                  Platform.OS === 'ios' && styles.shadowStyle,
                  {
                    flex: 1,
                  },
                ]}>
                <FlatList
                  data={filteredSuggestions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderSuggestionItem}
                  style={styles.suggestionList}
                  ListEmptyComponent={
                    <View style={{ height: 300, justifyContent: 'center' }}>
                      <Text style={{ textAlign: 'center' }}>No Data.</Text>
                    </View>
                  }
                  nestedScrollEnabled
                />
              </View>
            ) : null}
            {/* Near By filter */}
            {checkIsSearchOn(searchValue)
              ? null
              : options.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      dispatch({
                        type: SET_NEAR_BY_PARK,
                        payload: item?.type,
                      });
                      dispatch({
                        type: SET_VISIBLE_SEARCH_BOTTOM_SHEET,
                        payload: false,
                      });
                    }}>
                    <View
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
                        <Text
                          style={[styles.titleStyle, { fontWeight: '500' }]}>
                          {item.title}{' '}
                          <Text
                            style={[styles.textWhite, { fontWeight: '400' }]}>
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
                  </TouchableOpacity>
                ))}
            {!checkIsSearchOn(searchValue) ? (
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  fontWeight: '700',
                  color: placeholderColor,
                  paddingLeft: 14,
                  marginVertical: 8,
                }}>
                Suchverlauf
              </Text>
            ) : null}
            {checkIsSearchOn(searchValue) ? null : (
              <BottomSheetFlatList
                data={recentSearches.slice(0, visibleItems)}
                nestedScrollEnabled
                keyExtractor={(item, index) => item.id.toString()}
                ListEmptyComponent={
                  <View style={{ height: 200, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center' }}>No Data.</Text>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <SuchverlaufItems
                    item={item}
                    onSwipeComplete={swiped =>
                      handleSwipeComplete(swiped, index)
                    }
                    swipedIndexItem={swipedIndex}
                    index={index}
                    handleDeleteRecentSearch={() =>
                      handleDeleteRecentSearch(item?.id)
                    }
                    contentContainerStyle={{ marginVertical: 8 }}
                    onPressItem={() => handlePressOnRecentItem(item)}
                    handleFavoriteMark={handleFavoriteMark}
                  />
                )}
                ListFooterComponent={
                  <>
                    {recentSearches.length > 0 &&
                      visibleItems < recentSearches.length && (
                        <TouchableOpacity onPress={loadMoreItems}>
                          <View
                            style={[
                              styles.floatingButtonContainer,
                              styles.shadowStyle,
                            ]}>
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
                        </TouchableOpacity>
                      )}
                  </>
                }
              />
            )}
          </View>
        )}
      />
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
    paddingVertical: 14,
    borderRadius: 8 + 4,
    marginBottom: 9,
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
