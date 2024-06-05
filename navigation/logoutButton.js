import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { logout } from '../store/actions/user';
import GlobalStyle from '../style';

/**
 * Renders a logout button for use in the navigation bar.
 *
 * @class LogoutButton
 * @extends {React.Component}
 */
class LogoutButton extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if the updated user inside props is alredy logged out. If that is the case logout the user without send a request to the Meine APAG API
    if (
      typeof this.props.user.isLoggedIn !== typeof undefined &&
      !this.props.user.isLoggedIn &&
      prevProps.user.isLoggedIn
    ) {
      logout(true);
    }
  }
  /**
   * Logout the user. Takes an optional boolean parameter skipAPI which defines if an API request has to be made or not
   *
   * @param {Boolean} skipAPI
   * @memberof Rechnung
   */
  logout = skipAPI => {
    if (!skipAPI && typeof this.props.logout !== typeof undefined) {
      this.props.logout();
    }
    const { navigation } = this.props;
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          params: {
            screen: 'MeineAPAG',
            params: { screen: 'MeineAPAGLogin' },
          },
        },
      ],
    });
  };
  render() {
    // Just renders a simple Icon
    return (
      <Icon
        name="log-out"
        size={24}
        color="#fff"
        style={GlobalStyle.logoutButton}
        onPress={() => this.logout(false)}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: params => dispatch(logout(params)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);
