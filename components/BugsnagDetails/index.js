import React from 'react';
import { Text, Button } from 'react-native-paper';
import { StyleSheet, ScrollView, View } from 'react-native';
import { CustomActionSheet } from '../ActionSheet';
import Notice from '../notice';
import GlobalStyle, { fontScale, primaryBlue, primaryGreen } from '../../style';

export const BugnsnagInfo = ({ onClose, onAction }) => {
  const handleAction = value => {
    onAction(value);
    onClose();
  };

  return (
    <CustomActionSheet
      showClose
      onClose={onClose}
      style={{ paddingBottom: 50 }}
      content={
        <>
          <Notice
            title="Einbindung von externem Diensten zur Fehleranalyse"
            texts={[
              'Unsere App nutzt den Analysedienst Bugsnag (Bugsnag Inc., 939 Harrison Street, San Francisco, California 94107, USA.) Bugsnag ist ein Dienst, mit dem Programmfehler bspw. Abstürze, der von uns angebotenen Dienste, an uns gemeldet und von uns analysiert werden können. Diese Daten werden auf den Servern von Bugsnag (USA) gespeichert.',
              'Die Verarbeitung Ihrer Daten erfolgt auf der Rechtsgrundlage des Art. 6 Abs. 1 (1) f DSGVO und in unserem Interesse, um anhand von Fehlern unsere Dienste für Sie anzupassen und zu optimieren. Die Verarbeitung geschieht auf Basis der Standard Contractual Clauses (SCC) der EU für Datenübertragungen zwischen EU und Nicht-EU Ländern.',
              'Es werden unter anderem folgende Daten erhoben:',
            ]}
            style={GlobalStyle.consentStepText}
          />
          <Text style={[GlobalStyle.normal12, GlobalStyle.consentStepLink]}>
            IP-Adresse des Endgeräts;
          </Text>
          <Text style={[GlobalStyle.normal12, GlobalStyle.consentStepLink]}>
            Bildschirmauflösung des Endgeräts;
          </Text>
          <Text style={[GlobalStyle.normal12, GlobalStyle.consentStepLink]}>
            Endgerätetyp, Betriebssystem und Browsertyp;
          </Text>
          <Text style={[GlobalStyle.normal12, GlobalStyle.consentStepLink]}>
            Standort;
          </Text>
          <Text style={[GlobalStyle.normal12, GlobalStyle.consentStepLink]}>
            Sprache
          </Text>
          <Notice
            texts={[
              'Zusätzlich werden noch eine anonyme User-ID zu Ihrem Profil an Bugsnag gesendet. Diese User-ID kann Ihrer Person nicht zugeordnet werden. Eine Übermittlung weiterer Daten zu Ihrer Person erfolgt nicht. Die oben genannten Daten werden ausschließlich im Falle eines Fehlers an Bugsnag gesendet und werden von uns nur zur Fehlerbehebung genutzt.',
            ]}
            style={GlobalStyle.consentStepText}
          />
        </>
      }>
      <View style={BugsnagDetailsStyle.bottomContainer}>
        <Button
          style={BugsnagDetailsStyle.acceptButton}
          labelStyle={BugsnagDetailsStyle.acceptButtonLabel}
          mode="contained"
          onPress={() => handleAction(true)}>
          Einverstanden
        </Button>
        <Button
          style={BugsnagDetailsStyle.declineButton}
          labelStyle={BugsnagDetailsStyle.declineButtonLabel}
          mode="text"
          onPress={() => handleAction(false)}>
          Nicht einverstanden
        </Button>
      </View>
    </CustomActionSheet>
  );
};

const BugsnagDetailsStyle = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  acceptButton: {
    marginTop: 10,
    backgroundColor: primaryGreen,
    borderRadius: 6,
    paddingVertical: 2,
  },
  acceptButtonLabel: {
    fontSize: fontScale * 18,
    fontWeight: 'bold',
  },
  declineButton: {
    marginTop: 10,
    borderRadius: 6,
  },
  declineButtonLabel: {
    fontSize: fontScale * 18,
    fontWeight: 'bold',
    color: primaryBlue,
  },
});
