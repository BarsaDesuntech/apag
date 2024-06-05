import React from 'react';
import { Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { CustomActionSheet } from '../ActionSheet';
import Notice from '../notice';
import GlobalStyle, { fontScale, primaryBlue, primaryGreen } from '../../style';

export const PushDetails = ({ onClose, onAction }) => {
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
            title="Nutzung von Push-Services"
            texts={[
              'Die App nutzt auch Push-Services der Betriebssystemhersteller. Dies sind Mitteilungen, die mit Einwilligung des Nutzers auf dessen Display angezeigt werden und mit denen aktive Benachrichtigungen erhalten werden können. Im Fall der Nutzung der Push-Services wird ein Device-Token von Apple oder eine Registration-ID von Google zugeteilt.',
              'Dies geschieht zur Erbringung des Push-Services. Es handelt sich hierbei nur um verschlüsselte, anonymisierte Geräte-IDs. Es ist jederzeit möglich dies wieder rückgängig zu machen.',
              'Die Erhebung und Verarbeitung gerätespezifischer Informationen erfolgt auf der Grundlage des Art. 6 Abs. 1 S. 1 lit. b DSGVO zum Zwecke der Abwicklung von Vertragsverhältnissen mit Ihnen oder Art. 6 Abs. 1 lit. f DSGVO wenn und soweit dies zur Wahrung unserer Interessen oder der Dritter erforderlich ist. Hierzu kann insbesondere die Weitergabe an Hosting- bzw. Cloud-Computing-Anbieter zum Zwecke der Optimierung der Dienste und Steigerung der Gebrauchstauglichkeit und Nutzerfreundlichkeit gehören. Weitergegebenen Daten dürfen von den Dritten ausschließlich zu den genannten Zwecken verwendet werden.',
              'Eine Erhebung und Verarbeitung von personenbezogenen Daten kommt darüber hinaus allenfalls in Betracht, wenn',
            ]}
            style={GlobalStyle.consentStepText}
          />
          <View style={GlobalStyle.bulletRow}>
            <View style={GlobalStyle.bullet}>
              <Text
                style={[GlobalStyle.normal12, GlobalStyle.consentBulletText]}>
                {'\u2022' + ' '}
              </Text>
            </View>
            <View style={GlobalStyle.container}>
              <Text
                style={[GlobalStyle.normal12, GlobalStyle.consentBulletText]}>
                {
                  'Sie gem. Art. 6 Abs. 1 S. 1 lit. a DSGVO Ihre ausdrückliche Einwilligung dazu erteilt haben, sowie'
                }
              </Text>
            </View>
          </View>
          <View style={GlobalStyle.bulletRow}>
            <View style={GlobalStyle.bullet}>
              <Text
                style={[GlobalStyle.normal12, GlobalStyle.consentBulletText]}>
                {'\u2022' + ' '}
              </Text>
            </View>
            <View style={GlobalStyle.container}>
              <Text
                style={[GlobalStyle.normal12, GlobalStyle.consentBulletText]}>
                {
                  'für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht.'
                }
              </Text>
            </View>
          </View>
        </>
      }>
      <View style={PushDetailsStyle.bottomContainer}>
        <Button
          style={PushDetailsStyle.acceptButton}
          labelStyle={PushDetailsStyle.acceptButtonLabel}
          mode="contained"
          onPress={() => handleAction(true)}>
          Einverstanden
        </Button>
        <Button
          style={PushDetailsStyle.declineButton}
          labelStyle={PushDetailsStyle.declineButtonLabel}
          mode="text"
          onPress={() => handleAction(false)}>
          Nicht einverstanden
        </Button>
      </View>
    </CustomActionSheet>
  );
};

const PushDetailsStyle = StyleSheet.create({
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
