import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlobalStyle from '../style';
import Wrapper from '../components/Wrapper';
import InvoiceFormPrivate from '../components/InvoiceFormPrivate';
import ContactDetailsPrivate from '../components/ContactDetailsPrivate';
import InvoiceFormCompany from '../components/InvoiceFormCompany';
import ContactDetailsCompany from '../components/ContactDetailsCompany';
import TabButton from '../components/TabButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  hasSeenLaunchLoginScreen,
  setIsInLaunchFlow,
} from '../store/actions/settings';

/**
 * Displays the Invoice screen to Meine APAG.
 *
 * @class InvoiceScreen
 * @extends {Component}
 */
const Invoice = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const type = useSelector(state => state.registration.type);

  const onClose = () => {
    dispatch(setIsInLaunchFlow(false));
    dispatch(hasSeenLaunchLoginScreen(true));
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <Wrapper
      style={{ paddingHorizontal: 20 }}
      addPadding={true}
      showClose={true}
      onClose={onClose}
      showinvoicebtn={props.route.name === 'Invoice' ? true : false}>
      <View style={[GlobalStyle.noMarginTop]}>
        <Text
          variant="headlineSmall"
          style={[GlobalStyle.title, { paddingTop: 20, fontWeight: '400' }]}>
          {'Geben Sie Ihre'}{' '}
          <Text style={[GlobalStyle.title, { alignSelf: 'center' }]}>
            persönlichen Daten{' '}
          </Text>
          {'zwecks Ausstellung einer Rechnung an.'}
        </Text>
      </View>
      <TabButton />
      {type === 'private' && (
        <>
          <InvoiceFormPrivate />
          <ContactDetailsPrivate />
        </>
      )}
      {type === 'company' && (
        <>
          <InvoiceFormCompany />
          <ContactDetailsCompany />
        </>
      )}
    </Wrapper>
  );
};

export default Invoice;
