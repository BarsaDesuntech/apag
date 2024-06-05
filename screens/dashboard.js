import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableHighlight,
  RefreshControl,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { CommonActions } from '@react-navigation/native';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import GlobalStyle from '../style';
import {
  getRechnungen,
  downloadedRechnung,
  downloadRechnungFailure,
  checkDownloads,
} from '../store/actions/rechnungen';
import LoadingScreen from '../screens/loading';
import AnimatedCircularProgress from '../components/AnimatedCircularProgress';
import ErrorScreen from './error';
import { meineapagapi } from '../env';
import { getAuthToken } from '../store/actions/helpers';
import { UNAUTHENTICATED } from '../store/actions/constants';

/**
 * Displays or downloads one invoice to view.
 *
 * @class Rechnung
 * @extends {Component}
 */
class Rechnung extends Component {
  static propTypes = {
    rechnung: PropTypes.object,
    user: PropTypes.object,
    dispatch: PropTypes.func,
  };
  state = {
    percent: 0,
    size: 0,
    // to show if an invoice has been downloaded all downloaded invoice ids are passed
    downloaded:
      this.props.downloadedRechnungen.indexOf(
        this.props.rechnung.Rechnungsnummer,
      ) !== -1
        ? true
        : false,
    downloading: false,
  };

  /**
   * Download the selected invoice either from the Meine APAG API or retreive it from the device if downloaded locally already
   *
   * @param {Function} dispatch
   * @param {Function} getState
   * @memberof Rechnung
   */
  downloadRechnung = async (dispatch, getState) => {
    // Determine file path for current OS
    const SavePath =
      Platform.OS === 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const FilePath = `${SavePath}/rechnungen/${this.props.rechnung.Rechnungsnummer}.pdf`; // path of the file
    const message =
      'Es gab ein Problem bei der Anfrage zum Server. Bitte versuchen Sie es später erneut.';

    // If the file is not downloaded yet we have to call the Meine APAG API and save the file locally on the device
    if (!this.state.downloaded) {
      try {
        // Initialize default download state
        this.setState({ percent: 0, downloading: true, size: 0 });
        // Retreive the currently valid JWT Token from store
        getAuthToken(dispatch, getState)
          .then(accessToken => {
            const headers = {
              Authorization: 'Bearer ' + accessToken,
            };
            RNFetchBlob.config({
              fileCache: true,
              addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                title: `Rechnung ${this.props.rechnung.Rechnungsnummer}.pdf`,
                path: FilePath,
              },
              path: FilePath,
            })
              .fetch(
                'GET',
                meineapagapi +
                  'api/v1/rechnung/' +
                  this.props.rechnung.Rechnungsnummer +
                  '/pdf',
                headers,
              )
              .progress((received, total) => {
                const percent = (received / total) * 100;
                this.setState({ percent });
              })
              .then(res => {
                const respInfo = res.info();
                if (respInfo.status === 200 || !respInfo.status) {
                  this.setState({
                    percent: 100,
                    downloaded: true,
                    downloading: false,
                  });
                  this.props.downloadedRechnung({
                    Rechnungsnummer: this.props.rechnung.Rechnungsnummer,
                  });

                  FileViewer.open(FilePath, {
                    displayName:
                      'Rechnung ' + this.props.rechnung.Rechnungsnummer,
                  });
                } else {
                  Alert.alert('Hinweis', message);
                  dispatch(
                    downloadRechnungFailure({
                      Rechnungsnummer: this.props.rechnung.Rechnungsnummer,
                    }),
                  );
                  this.setState({
                    percent: 0,
                    downloaded: false,
                    downloading: false,
                  });
                }
              })
              .catch(error => {
                Alert.alert('Hinweis', message);
                dispatch(
                  downloadRechnungFailure({
                    Rechnungsnummer: this.props.rechnung.Rechnungsnummer,
                  }),
                );
                this.setState({ percent: 0, downloading: false, size: 0 });
              });
          })
          .catch(e => {
            // If there has been a problem getting the current JWT token the download can not be started
            Alert.alert('Hinweis', message);
            this.setState({ percent: 0, downloading: false, size: 0 });
            if (
              typeof e.error !== typeof undefined &&
              e.error === 'Could not retrieve JWT.'
            ) {
              // If the logout property is filled an UNAUTHENTICATED Redux event is thrown which will logout the user globally
              if (e.logout) {
                return dispatch({
                  type: UNAUTHENTICATED,
                });
              } else {
                return dispatch(
                  downloadRechnungFailure({
                    Rechnungsnummer: this.props.rechnung.Rechnungsnummer,
                  }),
                );
              }
            }
            // The fallback always is to logout the user if there has been a problem getting the current and correct JWT from anywhere
            return dispatch({
              type: UNAUTHENTICATED,
            });
          });
      } catch (error) {
        Alert.alert('Hinweis', message);
      }
      // If unvoice is already downloaded the precalculated file path can be used
    } else {
      try {
        // Open file in the FileViewer
        // Needs to be surrounded by a try-catch block if the PDF file has been delete manually
        FileViewer.open(FilePath, {
          displayName: 'Rechnung ' + this.props.rechnung.Rechnungsnummer,
        })
          .then()
          .catch(e => {
            dispatch(
              downloadRechnungFailure({
                Rechnungsnummer: this.props.rechnung.Rechnungsnummer,
              }),
            );
            // dispatch(this.downloadRechnung); Disabled as causing inifinite lop
          });
      } catch (error) {
        Alert.alert('Hinweis', 'Die Datei existiert nicht auf Ihrem Gerät.');
      }
    }
  };

  render() {
    const { rechnung, dispatch } = this.props;
    const { downloaded, downloading, percent } = this.state;

    // Very simple component - the downloaded and downloading state variables just define which icon is displayed the rest stays always the same
    return (
      <TouchableHighlight
        onPress={() => dispatch(this.downloadRechnung)}
        underlayColor="#f4f4f4"
        style={GlobalStyle.ph5}>
        <View style={[GlobalStyle.invoice]}>
          <View style={GlobalStyle.invoiceContainer}>
            <View style={GlobalStyle.flexDirectionColumn}>
              <Text style={[GlobalStyle.invoiceHeader]}>
                {rechnung.Rechnungsdatum}
              </Text>
              <Text style={[GlobalStyle.invoiceNumber]}>
                {rechnung.Rechnungsnummer}
              </Text>
            </View>
            <View style={GlobalStyle.flexDirectionRow}>
              <Text
                style={[
                  GlobalStyle.invoiceHeader,
                  // eslint-disable-next-line react-native/no-inline-styles
                  downloading && !downloaded ? { marginRight: 10.5 } : {},
                ]}>
                {rechnung.Betrag}
              </Text>
              {downloading && !downloaded && (
                <AnimatedCircularProgress
                  size={32}
                  rotation={0}
                  width={5}
                  fill={percent}
                  tintColor="#3f6cb1"
                />
              )}
              {!downloaded && !downloading && (
                <Icon
                  size={30}
                  name="md-cloud-download"
                  style={GlobalStyle.invoiceIconPadding}
                  color="#3f6cb1"
                />
              )}
              {downloaded && !downloading && (
                <Icon
                  size={30}
                  name="md-cloud-done"
                  style={GlobalStyle.invoiceIconPadding}
                  color="#3f6cb1"
                />
              )}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

/**
 * Renders a list of all existing invoices for the current loggedin customer.
 *
 * @class DashboardScreen
 * @extends {Component}
 */
class DashboardScreen extends Component {
  static propTypes = {
    user: PropTypes.object,
    rechnungen: PropTypes.object,
  };

  componentDidMount() {
    // @TODO check by date if there could be a new invoice - currently manual check
    this.checkLoggedIn(this.props);
    this.props.getRechnungen();
    // Check if there are running downloads to continue
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // This check is needed to redirect the user from the dashboard or any other secured view inside the App once the user has logged out
    // This is due to state and scope problems inside the authentication flow
    if (
      typeof this.props.user !== typeof undefined &&
      typeof prevProps.user !== typeof undefined &&
      this.props.user.isLoggedIn !== prevProps.user.isLoggedIn
    ) {
      this.checkLoggedIn(this.props);
    }
  }

  /**
   * Check and redirects the user if not logged in
   *
   * @param {Object} props
   * @memberof DashboardScreen
   */
  checkLoggedIn = props => {
    if (!props.user.isLoggedIn) {
      const { navigation } = this.props;
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: 'MeineAPAGLogin' }],
      });
      navigation.dispatch(resetAction);
    }
  };

  render() {
    const { rechnungen, downloadedRechnungGet, dispatch } = this.props;
    const rechnungenData = rechnungen.rechnungen;
    const downloadedRechnungen = rechnungen.downloadedRechnungen;

    // If no invoices are found and isFetching is true show a loading screen
    if (
      (typeof rechnungenData === typeof undefined || !rechnungenData.length) &&
      rechnungen.isFetching
    ) {
      return <LoadingScreen />;
    }

    // ScrollView where all invoices are displayed (completely Redux based)
    // Every invoice is of type Rechnung class
    // If no invoices are found an error message is displayed
    return (
      <View style={[GlobalStyle.whiteBackground, GlobalStyle.minHeight100]}>
        <ScrollView
          contentContainerStyle={[
            typeof rechnungenData === typeof undefined || !rechnungenData.length
              ? GlobalStyle.container
              : {},
          ]}
          refreshControl={
            <RefreshControl
              refreshing={rechnungen.isFetching}
              onRefresh={() => this.props.getRechnungen()}
              tintColor="#3A5998"
              colors={['#3A5998']}
            />
          }>
          {!!rechnungenData.length &&
            rechnungenData.map((rechnung, i) => (
              <Rechnung
                dispatch={dispatch}
                last={rechnungenData.length === i + 1}
                downloadedRechnungen={downloadedRechnungen}
                key={'rechnung' + i}
                downloadedRechnung={downloadedRechnungGet}
                rechnung={rechnung}
                user={this.props.user}
              />
            ))}
          {(typeof rechnungenData === typeof undefined ||
            !rechnungenData.length) && (
            <ErrorScreen text="Es sind noch keine Rechnungen hinterlegt" />
          )}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    rechnungen: state.rechnungen,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRechnungen: params => dispatch(getRechnungen(params)),
    downloadedRechnungGet: params => dispatch(downloadedRechnung(params)),
    checkDownloads: () => dispatch(checkDownloads()),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
