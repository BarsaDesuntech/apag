import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { lightGrey, primaryBlue, white } from '../style';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { resetFormDate } from '../store/actions/registration';

const AntragFlowStepper = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();

  useMemo(() => {
    if (['EmailVerification'].includes(children)) {
      setCurrentStep(1);
    } else if (
      [
        'EmailVerificationSuccess',
        'Invoice',
        'PaymentMode',
        'DirectDebit',
        'CreditCard',
      ].includes(children)
    ) {
      setCurrentStep(2);
    } else if (['AddVehicle'].includes(children)) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  }, [children]);

  return (
    <View style={[StepperStyle.stepperContainer]}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 40,
          backgroundColor: primaryBlue,
        }}>
        <View style={StepperStyle.stepperRow}>
          {Array.apply(null, Array(4))?.map((label, i) => (
            <View key={i} style={StepperStyle.stepperView}>
              {i > currentStep && i != currentStep /* Not selected */ && (
                <View
                  style={[
                    StepperStyle.stepperCircle,
                    { borderColor: lightGrey },
                  ]}>
                  <Text
                    style={[StepperStyle.stepperFont, { color: lightGrey }]}>
                    {i + 1}
                  </Text>
                  {i !== 3 && <View style={[StepperStyle.stepperBorder]} />}
                </View>
              )}
              {i < currentStep /* Checked */ && (
                <View
                  style={[
                    StepperStyle.stepperCircle,
                    StepperStyle.stepperActive,
                  ]}>
                  <Icon name="checkmark" size={20} color={primaryBlue} />
                  {i !== 3 && (
                    <View
                      style={[
                        StepperStyle.stepperBorder,
                        { borderColor: white },
                      ]}
                    />
                  )}
                </View>
              )}
              {i == currentStep /* Selected */ && (
                <View style={[StepperStyle.stepperCircle]}>
                  <Text style={[StepperStyle.stepperFont]}>{i + 1}</Text>
                  {i !== 3 && <View style={[StepperStyle.stepperBorder]} />}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default AntragFlowStepper;

const StepperStyle = StyleSheet.create({
  stepperContainer: {
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: primaryBlue,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 370,
    backgroundColor: primaryBlue,
  },
  stepperView: {
    alignItems: 'center',
    width: 70,
  },
  stepperActive: {
    backgroundColor: white,
  },
  stepperCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    backgroundColor: primaryBlue,
    borderWidth: 2,
    borderColor: white,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 3,
    color: white,
    zIndex: 1200,
    position: 'relative',
  },
  stepperFont: {
    fontSize: 12,
    color: white,
    zIndex: 1200,
  },
  stepperBorder: {
    position: 'absolute',
    borderColor: lightGrey,
    borderWidth: 1,
    width: 90,
    top: 10,
    left: 22.8,
    zIndex: -1,
  },
});
