/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  AsyncStorage,
} from 'react-native';
import {
  Button,
} from '@ant-design/react-native';
import {getUniqueId} from 'react-native-device-info';
import api from '../../../utils/api';
import {secondaryFont} from '../../../utils/globalStyles/fonts';
import {mainGrey, mainBlue} from '../../../utils/globalStyles/colors';
import {TextInput} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

const CodeVerification: (navigation, route) => React$Node = ({
  navigation,
  route,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('')
  const {confirmResult} = route.params;

  const onVerificationCode = async () => {
    setIsSending(true);
    try {
      const data = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(data);
      let deviceId = getUniqueId();
      const {phone, gender, age, diabetes, cardio, pneumo} = userData;

      console.log({phone, verificationCode})
      confirmResult.confirm(verificationCode).then(async respFirebase => {
        console.log({respFirebase, phone});
        if (respFirebase.phoneNumber === phone && respFirebase.uid) {
          return api
            .post('/users', {
              phone,
              deviceId,
              firebaseUid: respFirebase.uid,
            })
            .then(resp => resp.json())
            .then(async resJson => {
              console.log({resJson});
              if (resJson.token) {
                await AsyncStorage.setItem('userData', JSON.stringify(resJson));
                navigation.navigate('Profil');
              }
            });
        }
      });
    } catch (error) {
      console.log({error});
      setError(error[0])
    } finally {
      setIsSending(false);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="position">
      <Spinner visible={isSending} />
      <Text style={styles.detailsText}>المرجو إدخال الكود الذي توصلت به</Text>

      <TextInput
        style={styles.input}
        placeholder="الكود"
        keyboardType="numeric"
        onChangeText={val => setVerificationCode(val)}
      />
      <Button
        disabled={verificationCode.length === 0}
        type="primary"
        style={styles.button}
        onPress={() => {
          if (verificationCode.length !== 0) {
            onVerificationCode();
            Keyboard.dismiss();
          }
        }}>
        <Text style={styles.textButton}>تفعيل</Text>
      </Button>
    </KeyboardAvoidingView>
  );
};

export default CodeVerification;

const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    paddingRight: 40,
    paddingLeft: 40,
    direction: 'rtl',
    flex: 1,
    backgroundColor: 'white'
  },
  detailsText: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: secondaryFont,
    marginBottom: 35,
  },
  input: {
    backgroundColor: mainGrey,
    borderRadius: 7,
    height: 56,
    width: '100%',
    marginBottom: 50,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: secondaryFont,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 7,
    backgroundColor: mainBlue,
    textAlign: 'center',
    fontFamily: secondaryFont,
  },
  textButton: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: secondaryFont,
    color: 'white',
  }
});
