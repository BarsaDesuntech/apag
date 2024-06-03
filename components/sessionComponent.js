import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRabattQR } from '../store/actions/rabatt';
import { getCurrentUser, logout } from '../store/actions/user';

/**
 * Component which is rendered globally for the App once which checks if the session is valid in an interval
 * This also improves some problems with expiring JWTs
 *
 * @class SessionComponent
 * @extends {Component}
 */
class SessionComponent extends Component {
  static propTypes = {
    user: PropTypes.object,
    rabatt: PropTypes.object,
  };

  state = {
    isLoggedIn: this.props.user.isLoggedIn,
  };
  intervalId = null;

  componentDidMount() {
    // this.props.getRabattQR(); // @todo check if the QR-Code stays always the same (currently not because the date is included) and if needs to be requested again
    // Initiate interval in which the valid "session"/JWT is checked against the Meine APAG API
    // store intervalId in the state so it can be accessed later:

    this.intervalId = setInterval(
      () => this.handleSession(this.props.user),
      60000,
    );
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.intervalId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // With every state or property change update the isLoggedIn state property and recheck if the "session"/JWT is still valid
    if (typeof this.props.user.isLoggedIn !== typeof undefined) {
      if (prevState.isLoggedIn !== this.props.user.isLoggedIn) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(() => ({ isLoggedIn: this.props.user.isLoggedIn }));
        this.handleSession(this.props.user);
      }
    }
  }

  /**
   * Requests the current logged in user from the Meine APAG API if logged in locally
   * The logout method in the case that the user is no more logged in locally is not used because there would have been already an UNAUTHENTICATED Redux event which logs out the user
   *
   * @param {Object} user
   * @memberof SessionComponent
   */
  handleSession = user => {
    if (typeof user !== typeof undefined && user.isLoggedIn) {
      this.props.getCurrentUser(false);
    } else {
      // this.logout(); // Triggers a second logout which is not wanted when hitting the logout button
    }
  };

  /**
   * Send the logout request to the Meine APAG API
   *
   * @memberof SessionComponent
   */
  logout = () => {
    this.props.logout();
  };

  render() {
    // Nothing is rendered for the SessionComponent because it just handles business logic in the background
    return null;
  }
}

function mapStateToProps(state) {
  return {
    rabatt: state.rabatt,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRabattQR: () => dispatch(getRabattQR()),
    getCurrentUser: params => dispatch(getCurrentUser(params)),
    logout: () => dispatch(logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionComponent);
