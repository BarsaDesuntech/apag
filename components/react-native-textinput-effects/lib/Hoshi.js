import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Platform
} from 'react-native';

import BaseInput from './BaseInput';

export default class Hoshi extends BaseInput {
  static propTypes = {
    borderColor: PropTypes.string,
    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string,
    inputPadding: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    borderColor: 'red',
    inputPadding: 16,
    height: 48,
    borderHeight: 3,
    animationDuration: 200,
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      maskColor,
      borderColor,
      borderHeight,
      inputPadding,
      height: inputHeight,
    } = this.props;
    const { width, focusedAnim, value } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;
    const left = (typeof inputStyle !== typeof undefined && typeof inputStyle.left !== typeof undefined) ? inputStyle.left : 0;
    return (
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            height: inputHeight + inputPadding,
            width: containerWidth,
            borderBottomWidth: borderHeight
          },
        ]}
        onLayout={this._onLayout}
      >
        <TextInput
          ref={this.input}
          {...this.props}
          style={[
            styles.textInput,
            {
              width,
              height: inputHeight,
              left: inputPadding,
            },
            inputStyle,
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={'transparent'}
          autoCorrect={false}
          spellCheck={false}
          keyboardType={((typeof this.props.secureTextEntry !== typeof undefined && this.props.secureTextEntry) || Platform.OS === 'ios') ? 'default' : 'visible-password'}
        />
        <TouchableWithoutFeedback onPress={this.focus} style={{height: inputHeight,}}>
          <Animated.View
            style={[
              styles.labelContainer,
              {
                opacity: (this.isFocused && typeof value !== typeof undefined && value.length > 0) ? 0 : 1,
                bottom: inputPadding/2,
                left: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [left, 2 * left, 0, left],
                }),
              },
            ]}
          >
            <Text style={[styles.label, labelStyle]}>
              {label}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.border,
            {
              width: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width],
              }),
              backgroundColor: borderColor,
              height: borderHeight,
              bottom: -1*borderHeight,
            },
          ]}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: '#cccccc',
  },
  labelContainer: {
    position: 'absolute',
  },
  label: {
    fontSize: 18,
    color: '#cccccc',
    fontFamily: 'Roboto-Bold'
  },
  textInput: {
    position: 'absolute',
    bottom: -4,
    padding: 0,
    color: '#cccccc',
    fontSize: 18,
    fontFamily: 'Roboto-Bold'
  },
  labelMask: {
    height: 24,
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
