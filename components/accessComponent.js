import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CommonActions } from '@react-navigation/native';

/**
 * Class is rendered inside the MeineAPAG navigator to handle the password reset function whenever an administrator has triggered it
 *
 * @class AccessComponent
 * @extends {Component}
 */
class AccessComponent extends Component {
  static propTypes = {
    user: PropTypes.object,
    rabatt: PropTypes.object,
  };

  state = {
    reset: this.props.user.reset,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      typeof this.props.user.isLoggedIn !== typeof undefined &&
      this.props.user.isLoggedIn
    ) {
      if (
        prevState.reset !== this.props.user.reset &&
        typeof this.props.user.reset !== typeof undefined &&
        this.props.user.reset
      ) {
        const { navigation } = this.props;
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: 'MeineAPAGPasswordReset' }],
        });
        navigation.dispatch(resetAction);
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(() => ({ reset: this.props.user.reset }));
      }
    }
  }

  render() {
    // Nothing is rendered for the SessionComponent because it just handles business logic in the background
    return <View />;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AccessComponent);
