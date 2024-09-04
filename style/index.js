import { StyleSheet, PixelRatio } from 'react-native';
const hairlineWidth = StyleSheet.hairlineWidth;
/**
 * Default colors: Change to match your CI
 */
export const white = '#fff';
export const black = '#000';
export const primaryBlue = '#5B8FDE';
export const oldBlue = '#3f6cb1';
export const secondaryBlue = '#EBEFF8';
const primaryYellow = '#ebba13';
export const primaryGreen = '#a1bf36';
export const inputOutlineColor = '#E0E6ED';
export const lightGrey = '#BBC4D3';
export const lightGrey200 = '#E0E6ED';
export const placeholderColor = '#92a0b6';
export const InputColor = '#324B72';
export const creamColor = '#F6F7FA';
export const redColor = '#FF7886';
export const darkBlue = '#154898';

const ratio = PixelRatio.getFontScale();
var correctFontScale = 1 + (1 - ratio);
var increaseSizes = 1;
var realFontScale = correctFontScale;
if (correctFontScale < 1) {
  increaseSizes = increaseSizes + (1 - correctFontScale) / 2;
  if (correctFontScale < 0) {
    increaseSizes = 1;
    var set = Math.abs(correctFontScale);
    if (set > 1) {
      set = Math.ceil(set) - set;
    }
    correctFontScale = set;
    realFontScale = set;
  } else {
    realFontScale = correctFontScale;
    correctFontScale = 1;
  }
}
if (correctFontScale > 1.3) {
  correctFontScale = 1.3;
  realFontScale = 1.3;
}

export const fontScale = realFontScale;
/**
 * Creates a global stylesheet used in the entire app
 * @todo check if there are still some colors or styles used inline instead of saving them here
 * @todo check if there are redundant styles defined
 */
export default StyleSheet.create({
  displayNone: {
    display: 'none',
  },
  listButton: {
    width: 80,
    height: 40,
    backgroundColor: primaryBlue,
    borderRadius: 5,
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 10,
  },
  listItemImage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 15,
    marginTop: 5,
  },
  buttonPrimary: {
    width: 270,
    height: 50,
    backgroundColor: primaryBlue,
    borderRadius: 7,
    justifyContent: 'center',
  },
  buttonTransparent: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 7,
    justifyContent: 'center',
  },
  buttonBig: {
    width: 270,
    height: 200,
    backgroundColor: primaryBlue,
    borderRadius: 7,
    marginTop: 10,
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    backgroundColor: white,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  containerPadding: {
    margin: 10,
    borderRadius: 7,
    padding: 10,
  },
  noticePadding: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    padding: 10,
  },
  noticeTitle: {
    fontSize: fontScale * 16,
    fontFamily: 'Roboto-Bold',
    color: '#3A5998',
  },
  containerSmallPadding: {
    borderRadius: 5,
    padding: 10,
  },
  parkobjectListItemText: {
    color: primaryBlue,
    fontFamily: 'Roboto-Bold',
    fontSize: correctFontScale * 16,
  },
  cityListItemText: {
    paddingLeft: 15,
    paddingTop: 15,
    color: primaryBlue,
    fontFamily: 'Roboto',
    fontSize: correctFontScale * 12,
  },
  parkobjectListItemSubText: {
    color: '#717171',
    fontSize: correctFontScale * 13,
    paddingTop: 2,
    fontFamily: 'Roboto',
  },
  parkobjectListItemNumber: {
    color: '#999999',
    fontSize: correctFontScale * 14,
    textAlign: 'right',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Roboto-Bold',
  },
  parkobjectListItemNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    width: 120,
  },
  parkobjectListItemMessage: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 5,
  },
  parkobjectListItemNumberWhiteText: {
    color: white,
    textAlign: 'center',
    marginRight: 0,
  },
  parkobjectListItemBook: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  numberBox: {
    width: 40 * increaseSizes,
    height: 20 * increaseSizes,
  },
  yellowBackground: {
    backgroundColor: primaryYellow,
  },
  roundedCorners: {
    borderRadius: 5,
  },
  buttonPrimaryText: {
    fontFamily: 'Roboto-Bold',
    color: white,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
  listButtonText: {
    fontSize: correctFontScale * 14,
  },
  whiteBackground: {
    backgroundColor: white,
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  segmentedControlTab: {
    backgroundColor: white,
    height: 50,
    elevation: 3,
    shadowColor: black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  keyboardAwareScrollViewCustomStyle: {
    flex: 1,
    backgroundColor: white,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
  },
  scrollView15: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  actionButton: {
    backgroundColor: primaryBlue,
    borderRadius: 30,
    padding: 10,
    margin: 10,
  },
  actionButtonText: {
    color: white,
    fontSize: 12,
    alignSelf: 'center',
    textAlign: 'center',
  },
  inputField: {
    backgroundColor: white,
    height: 41,
    width: '100%',
    marginVertical: 10,
    marginBottom: 20,
    paddingTop: 4,
    paddingBottom: 0,
    paddingHorizontal: 10,
  },
  inputFieldCustom: {
    backgroundColor: white,
    height: 36,
    width: '100%',
    marginTop: 4,
    paddingBottom: 0,
    paddingHorizontal: 10,
  },
  inputFieldText: {
    color: black,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  h1: {
    fontFamily: 'Roboto-Bold',
    color: primaryBlue,
    fontSize: correctFontScale * 18,
    paddingBottom: 10,
  },
  h2: {
    fontFamily: 'Roboto',
    color: primaryBlue,
    fontSize: correctFontScale * 14,
    paddingBottom: 5,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  parkhouseTitleTop: {
    fontSize: 22 * realFontScale,
  },
  parkhouseTitle: {
    color: white,
    fontFamily: 'Roboto-Bold',
  },
  parkhouseTitleBig: {
    fontSize: 50 * realFontScale,
  },
  parkhouseSubTitle: {
    color: white,
    fontSize: 12 * realFontScale,
    fontFamily: 'Roboto',
  },
  parkhouseSubTitle2: {
    color: '#5E5E5E',
    fontSize: 13 * correctFontScale,
    fontFamily: 'Roboto',
  },
  dateIcon: {
    position: 'absolute',
    right: 0,
    marginLeft: 0,
  },
  dateInput: {
    borderWidth: 0,
    borderColor: '#cccccc',
  },
  dateInputText: {
    position: 'absolute',
    fontFamily: 'Roboto-Bold',
    color: '#636363',
    left: 0,
  },
  datePicker: {
    borderBottomWidth: 0,
    borderColor: '#636363',
    width: '100%',
  },
  datePickerCustom: {
    borderBottomWidth: 2,
    borderColor: '#cccccc',
    width: '100%',
  },
  datePickerPersonalStyle: {
    padding: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexDirectionColumn: {
    flexDirection: 'column',
  },
  timeTxt: {
    color: white,
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  selectContainer: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 2,
    flex: 1,
    marginRight: 10,
  },
  selectStyle: {
    height: 36,
    flex: 1,
    opacity: 0,
  },
  selectText: {
    color: '#505050',
    position: 'absolute',
    left: 0,
    bottom: 2,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  timeInnerCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitCont: {
    borderRadius: 5,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleDigitCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitTxt: {
    color: white,
    fontFamily: 'Roboto-Bold',
  },
  statsOuterPill: {
    backgroundColor: '#e4e4e4',
    width: 40,
    marginLeft: 10,
    marginRight: 5,
    borderRadius: 5,
    height: 10,
    overflow: 'hidden',
  },
  statsOuterPillBig: {
    backgroundColor: '#DDDDDD',
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  statsInnerPill: {
    backgroundColor: primaryBlue,
    flex: 1,
  },
  headerStyle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    flex: 1,
    color: '#fff',
  },
  primaryBackgroundColor: {
    backgroundColor: primaryBlue,
  },
  secondaryBackgroundColor: {
    backgroundColor: secondaryBlue,
  },
  primaryGreenBackgroundColor: {
    backgroundColor: primaryGreen,
  },
  callout: {
    width: 180,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutAndroid: {
    padding: 10,
  },
  calloutTitle: {
    color: primaryBlue,
    fontSize: correctFontScale * 14,
    fontFamily: 'Roboto',
  },
  calloutSubTitle: {
    color: '#717171',
    fontSize: correctFontScale * 12,
    fontFamily: 'Roboto',
  },
  primaryTextColor: {
    color: primaryBlue,
  },
  primaryGreenTextColor: {
    color: primaryGreen,
  },
  activeTabStyle: {
    backgroundColor: white,
    borderColor: primaryBlue,
  },
  whiteFont: {
    color: white,
    fontFamily: 'Roboto',
  },
  bookingText: {
    fontSize: correctFontScale * 18,
    fontFamily: 'Roboto-Bold',
    color: '#505050',
  },
  bookingSmallText: {
    fontSize: correctFontScale * 14,
    fontFamily: 'Roboto-Bold',
    color: '#636363',
    paddingBottom: 3,
  },
  normal12: {
    fontSize: correctFontScale * 12,
  },
  normal14: {
    fontSize: correctFontScale * 14,
  },
  normal16: {
    fontSize: correctFontScale * 16,
  },
  bold12: {
    fontFamily: 'Roboto-Bold',
    fontSize: correctFontScale * 12,
  },
  bold14: {
    fontFamily: 'Roboto-Bold',
    fontSize: correctFontScale * 14,
  },
  bold16: {
    fontFamily: 'Roboto-Bold',
    fontSize: correctFontScale * 16,
  },
  crazyChartContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  crazyChartYInset: {
    marginTop: -30,
    marginHorizontal: 10,
    minWidth: 30,
  },
  crazyChartXInset: {
    marginHorizontal: -10,
    paddingRight: 15,
    paddingLeft: 5,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  crazyChartItem: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 1,
  },
  crazyChartStyle: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  pin: {
    width: 50,
    height: 50,
  },
  invoice: {
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    marginHorizontal: 10,
  },
  invoiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 10,
  },
  invoiceHeader: {
    fontFamily: 'Roboto-Bold',
    color: '#505050',
    fontSize: correctFontScale * 20,
    marginRight: 10,
    paddingTop: 3,
  },
  invoiceNumber: {
    fontFamily: 'Roboto',
    color: '#878787',
    fontSize: correctFontScale * 16,
  },
  invoiceIconPadding: {
    paddingLeft: 4,
  },
  serviceContainer: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderColor: '#e4e4e4',
  },
  serviceText: {
    color: '#5E5E5E',
    fontSize: 13 * correctFontScale,
    marginBottom: 5,
  },
  parkhouseHeading: {
    fontSize: 13 * correctFontScale,
    paddingBottom: 5,
    fontFamily: 'Roboto-Bold',
  },
  parkhouseText: {
    fontSize: 13 * correctFontScale,
    color: '#5E5E5E',
    fontFamily: 'Roboto',
  },
  iconButton: {
    fontSize: 13 * correctFontScale,
    fontFamily: 'Roboto',
  },
  tabStyle: {
    backgroundColor: white,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: white,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    borderBottomWidth: 2,
    flex: 0,
    flexGrow: 1,
  },
  datenContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  datenContainerLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  headerContentContainer: {
    flexDirection: 'row',
    flex: 1,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  animatedHeaderText: {
    width: '100%',
    paddingBottom: 10,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  animatedNumbers: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: primaryBlue,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    resizeMode: 'cover',
  },
  hoshiInputStyle: {
    left: 0,
    color: '#505050',
  },
  resetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resetPasswordButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cancelButtonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    borderTopWidth: hairlineWidth,
    borderColor: '#ccc',
    marginTop: 0,
  },
  buttonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    borderTopWidth: hairlineWidth,
    borderColor: '#ccc',
    marginTop: 0,
    marginBottom: 0,
  },
  noMarginTop: {
    marginTop: 0,
  },
  rabattContainer: {
    flex: 1,
    backgroundColor: white,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
  },
  parkhouseOpeningTimes: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: '#e4e4e4',
  },
  parkhouseChartContainer: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#e4e4e4',
    overflow: 'hidden',
  },
  parkhouseAxisPadding: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  parkhouseSection: {
    flex: 1,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: '#e4e4e4',
  },
  data: {
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 5,
    marginBottom: 15,
  },
  dataHeader: {
    fontFamily: 'Roboto-Bold',
    color: '#505050',
    fontSize: correctFontScale * 20,
    paddingBottom: 5,
  },
  dataNumber: {
    fontFamily: 'Roboto',
    color: '#878787',
    fontSize: correctFontScale * 16,
  },
  mb20: {
    marginBottom: 20,
  },
  m10: {
    margin: 10,
  },
  m20: {
    margin: 20,
  },
  mt10: {
    marginTop: 10,
  },
  mt20: {
    marginTop: 20,
  },
  mr10: {
    marginRight: 10,
  },
  mr5: {
    marginRight: 5,
  },
  pb10: {
    paddingBottom: 10,
  },
  pr10: {
    paddingRight: 10,
  },
  w100: {
    width: '100%',
  },
  h180: {
    height: 180,
  },
  ph5: {
    paddingHorizontal: 5,
  },
  ph15: {
    paddingHorizontal: 15,
  },
  p10: {
    padding: 10,
  },
  borderRadius5: {
    borderRadius: 5,
  },
  borderRadius7: {
    borderRadius: 7,
  },
  minHeight100: {
    minHeight: '100%',
  },
  fullWidthHeight: {
    height: '100%',
    width: 100,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  parkhouseNavigationButton: {
    marginRight: 10,
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 18,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerSaveButton: {
    marginVertical: 5,
    height: null,
    width: null,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 15,
  },
  logoutButton: {
    paddingLeft: 30,
    paddingRight: 15,
  },
  consentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  consentItemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#636363',
  },
  consentSwitch: {
    position: 'absolute',
    right: 10,
  },
  consentText: {
    color: '#636363',
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  consentStepTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 62,
    color: '#636363',
  },
  consentStepIcon: {
    fontFamily: 'Roboto-Bold',
    fontSize: 160,
    color: '#eee',
    transform: [{ rotate: '-7deg' }],
    position: 'absolute',
    left: -25,
    top: -60,
  },
  consentStepIconFont: {
    left: -15,
    top: -20,
  },
  consentStepText: {
    fontSize: 16,
    marginTop: 5,
  },
  consentStepLink: {
    color: '#636363',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  consentBulletText: {
    color: '#636363',
    fontSize: 16,
  },
  consentButton: {
    flex: 1,
    width: 'auto',
    height: 'auto',
  },
  consentButtonContainer: {
    height: 65,
    flexDirection: 'row',
  },
  consentAccept: {
    backgroundColor: '#a1bf36',
  },
  consentDecline: {
    backgroundColor: '#e41312',
  },
  consentMissing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  consentMissingText: {
    fontSize: 16,
    color: '#636363',
    textAlign: 'center',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  bullet: {
    width: 10,
    marginRight: 5,
  },
  chargeItem: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  chargeItemTitle: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginBottom: 5,
  },
  chargeItemSlot: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  chargeItemBubble: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  chargeItemBubbleText: {
    padding: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  chargeItemMax: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 10,
  },
  chargeItemMaxText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  chargeItemText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'right',
    fontFamily: 'Roboto',
  },
  title: {
    fontWeight: 'bold',
    color: '#324b72',
    fontSize: fontScale * 20,
  },
  signUpButton: {
    backgroundColor: primaryGreen,
    borderRadius: 7,
    paddingVertical: 2,
  },
  disableButton: {
    backgroundColor: lightGrey,
    borderRadius: 7,
    paddingVertical: 2,
  },
  signUpButtonLabel: {
    fontSize: fontScale * 18,
    fontWeight: 'bold',
    color: white,
  },
  signInButton: {
    marginTop: 10,
    backgroundColor: primaryBlue,
    borderRadius: 6,
    paddingVertical: 2,
  },
  signInButtonLabel: {
    fontSize: fontScale * 18,
    fontWeight: 'bold',
    color: white,
  },
  skipButton: {
    borderRadius: 6,
    paddingVertical: 2,
  },
  skipButtonLabel: {
    color: primaryBlue,
    fontSize: fontScale * 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    fontSize: fontScale * 14,
    fontFamily: 'Roboto',
  },
  stepContainer: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCircle: {
    marginTop: 10,
    fontSize: 12,
    paddingBottom: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#2E81D3',
    justifyContent: 'center',
    width: '85%',
    position: 'absolute',
    top: 35,
    marginHorizontal: 20,
  },
  circle: {
    borderWidth: 1,
    borderColor: '#2E81D3',
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    zIndex: 1,
  },
  circleTitle: {
    fontSize: 12,
    color: '#fff',
  },
  selectedcircleTitle: {
    fontSize: 12,
    color: '#2E81D3',
  },
  Shadow15: {
    borderRadius: 7,
    elevation: 15, // Controls the shadow effect (Android only)
    shadowOffset: { width: 1, height: 1 }, // Shadow offset (iOS only)
    shadowOpacity: 1, // Shadow opacity (iOS only)
    shadowRadius: 7, // Shadow blur radius (iOS only)
  },
  Shadow25: {
    borderRadius: 7,
    elevation: 15, // Controls the shadow effect (Android only)
    shadowOffset: { width: 1, height: 1 }, // Shadow offset (iOS only)
    shadowOpacity: 1, // Shadow opacity (iOS only)
    shadowRadius: 7, // Shadow blur radius (iOS only)
  },
  outlineStyle: { borderWidth: 2, borderRadius: 8 },
  textInputStyle: { backgroundColor: '#fff', marginBottom: 5 },
  stepperTitleStyle: {
    backgroundColor: primaryBlue,
    borderColor: primaryBlue,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  customChip: { flex: 1, borderColor: inputOutlineColor, paddingVertical: 12 },
});
