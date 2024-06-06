import React from 'react';
import { Button, Text } from 'react-native-paper';
import { Linking, StyleSheet, View } from 'react-native';
import { CustomActionSheet } from '../ActionSheet';
import Notice from '../notice';
import GlobalStyle, { fontScale, primaryBlue, primaryGreen } from '../../style';

export const CardDetails = ({ onClose, onAction }) => {
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
            title="Einbindung von externem Kartenmaterial und Nutzung von Standortdaten"
            texts={[
              'Innerhalb der APAG App gibt es die Möglichkeit unsere Parkobjekte auf einer Karte darstellen zu lassen.',
              'Wir rufen über unsere App Kartenmaterial von Google Maps und Apple Maps APIs auf. Damit die Karte angezeigt werden kann, werden Ihre IP-Adresse und Ihr Standort an Google Maps übermittelt.',
              'Die Einbindung erfolgt auf Grundlage des Art. 6 Abs. 1 S. 1 lit. f DSGVO. Sie erfolgt, um unsere App nutzerfreundlicher zu gestalten. Darin ist ein berechtigtes Interesse im Sinne der vorgenannten Vorschrift zu sehen.',
              'Die Informationen zum Datenschutz von Google Maps bzw. Apple Maps finden Sie hier:',
            ]}
            style={GlobalStyle.consentStepText}
          />
          <Text
            style={[GlobalStyle.normal12, GlobalStyle.consentStepLink]}
            onPress={() => {
              Linking.openURL('https://policies.google.com/privacy');
            }}>
            Google Maps: policies.google.com/privacy
          </Text>
          <Text
            style={[GlobalStyle.normal12, GlobalStyle.consentStepLink]}
            onPress={() => {
              Linking.openURL('https://www.apple.com/de/privacy');
            }}>
            Apple Maps: www.apple.com/de/privacy
          </Text>
          <Notice
            texts={[
              'Der Zugriff auf den von Ihnen genutzten Kartendienst erfolgt erst nach Einverständnis.',
              'Eine Erhebung, Verarbeitung und Weitergabe von personenbezogenen Daten kommt darüber hinaus allenfalls in Betracht, wenn Sie gem. Art. 6 Abs. 1 S. 1 lit. a DSGVO Ihre ausdrückliche Einwilligung dazu erteilt haben, sowie für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht.',
              'Diese Einstellungen können Sie zu jeder Zeit nachträglich anpassen.',
              'Die Standortfunktion wird benötigt, damit der User ermitteln kann, wo er sich im Verhältnis zu den Parkhäusern befindet. Die Standortdaten des Parkhauses werden auf Aufforderung (iOS bzw. bei Android ab Version 6) des Users an Google Maps, Apple Maps oder an einen anderen Kartendienstleister Ihrer Wahl übermittelt. Der von Ihnen gewählte Kartenanbieter ermittelt dann Ihren Standort, um eine Route zu dem ausgewählten Parkhaus zu ermitteln.',
              'Zur Nutzung der Standortdienste müssen diese in Ihrem mobilen Betriebssystem aktiviert sein. Sobald diese aktiviert sind und die App zum ersten Mal gestartet wird, wird der Zugriff auf die Standortinformationen abgefragt. Die Bestätigung führt dazu, dass der App der Zugriff auf Ihre Standortinformationen gestattet ist. Sie können den Zugriff der jeweiligen App auf Ihren Standort jederzeit in den entsprechenden Einstellungen Ihres mobilen Endgeräts deaktivieren.',
            ]}
            style={GlobalStyle.consentStepText}
          />
        </>
      }>
      <View style={CardDetailsStyle.bottomContainer}>
        <Button
          style={CardDetailsStyle.acceptButton}
          labelStyle={CardDetailsStyle.acceptButtonLabel}
          mode="contained"
          onPress={() => handleAction(true)}>
          Einverstanden
        </Button>
        <Button
          style={CardDetailsStyle.declineButton}
          labelStyle={CardDetailsStyle.declineButtonLabel}
          mode="text"
          onPress={() => handleAction(false)}>
          Nicht einverstanden
        </Button>
      </View>
    </CustomActionSheet>
  );
};

const CardDetailsStyle = StyleSheet.create({
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
