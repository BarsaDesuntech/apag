import React, { useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { primaryGreen } from '../style';

const FadeInView = ({ children, style }) => {
  const fadeAnim = new Animated.Value(0.8);
  const fadeAnime = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 2.5,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnime, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['270deg', '360deg'],
  });

  const rotate = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });

  const Fade = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const FadeScale = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <>
      <Animated.View
        style={{
          ...style,
          transform: [{ rotate: spin }],
          position: 'relative',
          zIndex: 99,
          opacity: FadeScale,
        }}>
        {children}
      </Animated.View>
      <Animated.View
        style={{
          transform: [{ scale: rotate }],
          opacity: Fade,
          position: 'absolute',
          width: 20,
          height: 20,
          backgroundColor: primaryGreen,
          borderRadius: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </>
  );
};

export default FadeInView;
