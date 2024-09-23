import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon component

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { black, white, primaryBlue, redColor, InputColor } from '../../style';
import { PanGestureHandler } from 'react-native-gesture-handler';
const ITEM_HEIGHT = 80;
const BUTTON_WIDTH = 350;
const H_SWIPE_RANGE = BUTTON_WIDTH - ITEM_HEIGHT;

const data = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
export const SuchverlaufItems = ({
  item,
  onSwipeComplete,
  swipedIndexItem,
  index,
  handleDeleteRecentSearch,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const X = useSharedValue(0);
  const [swiped, setSwiped] = React.useState(false);

  const handleComplete = isSwiped => {
    if (isSwiped !== swiped) {
      setSwiped(isSwiped);
      onSwipeComplete(isSwiped);
    }
  };

  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.completed = swiped;
    },
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = -H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= -H_SWIPE_RANGE && newValue <= 0) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value > -BUTTON_WIDTH / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(-H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        X.value,
        [-H_SWIPE_RANGE, 0],
        [redColor, white], // Colors for right to left swipe
      ),
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        X.value,
        [-H_SWIPE_RANGE, 0],
        [1, 0], // Icon becomes fully visible when swiping to the left
      ),
      transform: [
        {
          translateX: interpolate(
            X.value,
            [-H_SWIPE_RANGE, 0],
            [-ITEM_HEIGHT / 6, ITEM_HEIGHT / 4],
          ),
        },
      ],
    };
  });

  // New styles for left and right arrow icons
  const arrowIconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        X.value,
        [-H_SWIPE_RANGE, 0],
        [1, 0], // Icons become fully visible when swiping to the left
      ),
    };
  });

  const textOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(X.value, [-H_SWIPE_RANGE, 0], [0, 1]),
    };
  });

  return (
    <PanGestureHandler onGestureEvent={animatedGestureHandler}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <Animated.View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 14,
              // marginVertical: 8,
              zIndex: swipedIndexItem?.includes(index) ? 0 : 4,
            },
            textOpacityStyle,
          ]}>
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FontAwesome5 name="clock" color={primaryBlue} size={20} />
            <Animated.View style={{ marginLeft: 14, flex: 1, maxWidth: '80%' }}>
              <Text
                style={{
                  fontFamily: 'roboto-medium',

                  color: InputColor,
                  fontSize: 16,
                }}>
                {item?.name}
              </Text>
              <Animated.Text
                style={{
                  fontFamily: 'roboto-medium',
                  fontWeight: '400',
                  color: InputColor,
                  fontSize: 12,
                  marginTop: 2,
                }}>
                {item?.des}Aachen
              </Animated.Text>
            </Animated.View>
          </Animated.View>
          <Animated.View style={{ zIndex: 4 }}>
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color={isFavorite ? redColor : primaryBlue}
              key={item.id}
              onPress={() => setIsFavorite(!isFavorite)}
            />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            top: 12,
          }}>
          <Animated.View
            key={item}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            {[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4].map(item => (
              <Animated.View
                key={item}
                style={[styles.leftArrowIcon, arrowIconStyle]}>
                <Icon
                  name="chevron-left"
                  size={24}
                  color={white}
                  style={{ opacity: item }}
                />
              </Animated.View>
            ))}
          </Animated.View>
          <Animated.View style={[iconStyle, { zIndex: 6 }]}>
            <Icon
              name="delete-outline"
              size={24}
              color={white}
              onPress={handleDeleteRecentSearch}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 4,
    backgroundColor: white, // Default color
  },
  itemText: {
    fontSize: 18,
    color: black,
  },

  itemContainer: {
    justifyContent: 'center',
    paddingVertical: 8,
    marginVertical: 4,
    position: 'relative', // Ensure positioning is relative for the icon container
    backgroundColor: white, // Default color
  },
  itemText: {
    fontSize: 18,
    color: black,
  },

  leftArrowIcon: {
    marginHorizontal: 4,
  },
});
