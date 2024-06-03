import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  View,
} from 'react-native';
import { primaryGreen, white } from '../../style';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FadeInView from '../FadeInView';

const EASING_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);
const EASING_IN = Easing.out(EASING_OUT);
const WINDOW_HEIGHT = Dimensions.get('window').height;

// Import the logo and calculate the display width and height
export const CloseButtonSrc = require('../../assets/img/action_btn_close_shadow.png');
export const BackButtonSrc = require('../../assets/img/action_btn_back_shadow.png');
export const CheckButtonSrc = require('../../assets/img/action_btn_check_shadow.png');
export const CheckWhiteButtonSrc = require('../../assets/img/checkWhite.png');

export const CustomActionSheet = ({
  open = true,
  children,
  showClose = false,
  onClose,
  style,
  content = null,
  handleBack,
  checkTrue,
  checkTrueConfirm,
  noPadding,
}) => {
  const mounted = useRef(false);
  const fadeAnim = useRef(new Animated.Value(800)).current;

  const handleOpen = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: EASING_IN,
    }).start();
  }, [fadeAnim]);

  const handleClose = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: EASING_OUT,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (open) {
      if (!mounted.current) {
        handleOpen();
        mounted.current = true;
      }
    } else {
      handleClose();
    }
  }, [handleOpen, handleClose, open]);

  return (
    <Animated.View
      style={[
        ActionSheetStyle.Container,
        style,
        {
          transform: [{ translateY: fadeAnim }],
          ...(noPadding ? { paddingHorizontal: 0 } : undefined),
        },
      ]}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}
        extraHeight={0}
        extraScrollHeight={0}>
        {content}
      </KeyboardAwareScrollView>
      {children}
      {showClose && (
        <Pressable onPress={onClose} style={ActionSheetStyle.CloseButton}>
          <Image
            source={CloseButtonSrc}
            resizeMode={'contain'}
            fadeDuration={0}
          />
        </Pressable>
      )}
      {checkTrue && (
        <Pressable style={ActionSheetStyle.CloseButton}>
          <Image
            source={CheckButtonSrc}
            resizeMode={'contain'}
            fadeDuration={0}
          />
        </Pressable>
      )}
      {checkTrueConfirm && (
        <Pressable style={ActionSheetStyle.CheckButton}>
          <View
            style={[
              ActionSheetStyle.CheckButtonView,
              { backgroundColor: primaryGreen },
            ]}>
            <FadeInView>
              <Image
                source={CheckWhiteButtonSrc}
                resizeMode={'contain'}
                fadeDuration={0}
                style={[ActionSheetStyle.CheckButtonImg]}
              />
            </FadeInView>
          </View>
        </Pressable>
      )}
      {handleBack && (
        <Pressable onPress={handleBack} style={ActionSheetStyle.CloseButton}>
          <Image
            source={BackButtonSrc}
            resizeMode={'contain'}
            fadeDuration={0}
          />
        </Pressable>
      )}
    </Animated.View>
  );
};

const ActionSheetStyle = StyleSheet.create({
  Container: {
    backgroundColor: white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    maxHeight: 0.8 * WINDOW_HEIGHT,
    overflow: 'visible',
    flex: 1,
  },
  CloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -40,
  },
  CheckButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -35,
  },
  CheckButtonView: {
    height: 58,
    width: 58,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  CheckButtonImg: {
    height: 30,
    width: 30,
  },
});
