import {Component, createRef} from 'react';
import PropTypes from 'prop-types';

import {Animated, Text, View} from 'react-native';
import ViewPropTypes from 'deprecated-react-native-prop-types';

export default class BaseInput extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    style: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
    inputStyle: Text.style,
    labelStyle: Text.style,
    easing: PropTypes.func,
    animationDuration: PropTypes.number,
    useNativeDriver: PropTypes.bool,

    editable: PropTypes.bool,

    /* those are TextInput props which are overridden
     * so, i'm calling them manually
     */
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.input = createRef();
    this._onLayout = this._onLayout.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this.focus = this.focus.bind(this);

    const value = props.value || props.defaultValue;

    this.state = {
      value,
      focusedAnim: new Animated.Value(0),
      width: null,
    };
  }

  // componentWillReceiveProps(newProps) {
  //   const newValue = newProps.value;
  //   if (newProps.hasOwnProperty('value') && newValue !== this.state.value) {
  //     this.setState({
  //       value: newValue,
  //     });

  //     // animate input if it's active state has changed with the new value
  //     // and input is not focused currently.
  //     const isFocused = this.inputRef().isFocused();
  //     if (!isFocused) {
  //       const isActive = Boolean(newValue);
  //       if (isActive !== this.isActive) {
  //         this._toggle(isActive);
  //       }
  //     }
  //   }
  // }

  _onLayout(event) {
    this.setState({
      width: event.nativeEvent.layout.width,
    });
  }

  _onChange(event) {
    this.setState({
      value: event.nativeEvent.text,
    });

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(event);
    }
  }

  _onBlur(event) {
    this._toggle(false);

    const onBlur = this.props.onBlur;
    if (onBlur) {
      onBlur(event);
    }
  }

  _onFocus(event) {
    this._toggle(true);

    const onFocus = this.props.onFocus;
    if (onFocus) {
      onFocus(event);
    }
  }

  _toggle(isActive) {
    const {animationDuration, easing, useNativeDriver} = this.props;
    this.isActive = isActive;
    Animated.timing(this.state.focusedAnim, {
      toValue: isActive ? 1 : 0,
      duration: animationDuration,
      easing,
      useNativeDriver,
    }).start();
  }

  // public methods

  inputRef() {
    return this.input.current;
  }

  focus() {
    if (this.props.editable !== false) {
      this.inputRef().focus();
    }
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }
}
