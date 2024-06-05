import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableHighlight, View, Animated, Easing} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from '../style';

/**
 * Renders a simple button with the primary color of our style file
 * Can handle a loading indication if the loading property is set to true
 * Can handle a disable indication if the disable property is set to true
 *
 * @class ButtonPrimary
 * @extends {Component}
 */
export default class ButtonPrimary extends Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
    style: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    text: '',
  };

  spinValue = new Animated.Value(0);

  onPress = () => {
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    this.props.onPress();
  };

  render = () => {
    const {text, style, loading, underlayColor, disable} = this.props;

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const AnimatedIcon = Animated.createAnimatedComponent(Icon);
    return (
      <TouchableHighlight
        style={[GlobalStyle.buttonPrimary, style]}
        underlayColor={
          typeof underlayColor !== typeof undefined ? underlayColor : '#628fd3'
        }
        onPress={this.onPress}
        disabled={disable || loading}>
        <View style={GlobalStyle.primaryCont}>
          {loading ? (
            <AnimatedIcon
              name="spinner"
              size={30}
              color={'#fff'}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{transform: [{rotate: spin}], marginRight: 10}}
            />
          ) : null}
          <Text style={[GlobalStyle.buttonPrimaryText]}>{text}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}
