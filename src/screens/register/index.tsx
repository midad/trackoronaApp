/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Switch,
  AsyncStorage,
  TextInput,
} from 'react-native';
import Header from '../../components/header';
import {
  WhiteSpace,
  Flex,
  Button,
} from '@ant-design/react-native';
import BleManager from 'react-native-ble-manager';
import auth from '@react-native-firebase/auth';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  mainBlue,
  mainBlack,
  mainGrey,
} from '../../../utils/globalStyles/colors';
import {primaryFont, secondaryFont} from '../../../utils/globalStyles/fonts';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Register extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isBluetoothEnabled: false,
      isGpsEnabled: false,
      confirmResult: null,
      phone: '',
      isSending: false,
      error: '',
    };
  }

  getDistanceFromRSSIandTxPower(rssi, txpower) {
    return Math.pow(10, (txpower - rssi) / 20);
  }

  enableBluetooth() {
    BleManager.start().then(() => {
      // Success code
      console.log('Module initialized');
      BleManager.enableBluetooth()
        .then(() => {
          // Success code
          console.log('The bluetooth is already enabled or the user confirm');
          this.setState({
            isBluetoothEnabled: true,
          });
        })
        .catch(error => {
          // Failure code
          console.log('The user refuse to enable bluetooth');
        });
    });
  }

  componentDidMount() {
    this.enableBluetooth();

    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
              console.log({result});
            });
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            this.setState({isGpsEnabled: true});
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log({error});
      });
  }

  onRegister = async () => {
    const {phone} = this.state;

    try {
      this.setState({isSending: true});
      const confirmation = await auth().signInWithPhoneNumber(phone);
      this.setState({confirmResult: confirmation, isSending: false});
      console.log({confirmResult: this.state.confirmResult, phone});

      this.props.navigation.navigate('CodeVerification', {
        confirmResult: this.state.confirmResult,
        phone: this.state.phone,
      });
    } catch (error) {
      this.setState({isSending: false});
      console.log({error});
      this.setState({error: error.toString()})
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="position">
        <Spinner visible={this.state.isSending} />
        <Header />
        <Text style={styles.welcomeText}>مرحبا بكم</Text>
        <Text style={styles.detailsText}>
          المرجو إدخال رقم الهاتف وتفعيل البلوثوث ونظام تحديد الموقع GPS
          للاستفادة الكاملة من خدمات التطبيق
        </Text>
        <TextInput
          style={styles.input}
          placeholder="رقم الهاتف"
          onChangeText={val =>
            this.setState({
              phone: val.toString(),
            })
          }
        />
        <Flex justify="between">
          <Flex justify="between" style={styles.radioContainer}>
            <Switch thumbColor={mainBlue} value={this.state.isGpsEnabled} />
            <Text style={styles.radioText}>تفعيل GPS</Text>
          </Flex>
          <Flex
            justify="between"
            style={{marginRight: 'auto', marginLeft: 'auto', width: 150}}>
            <Switch
              thumbColor={mainBlue}
              value={this.state.isBluetoothEnabled}
              onValueChange={checked => checked && this.enableBluetooth()}
            />
            <Text style={styles.radioText}>تفعيل البلوثوث</Text>
          </Flex>
        </Flex>
        <WhiteSpace size="xl" />
        <WhiteSpace size="lg" />
        <Button
          disabled={this.state.phone.length === 0}
          type="primary"
          style={styles.button}
          onPress={() => {
            if (this.state.phone.length !== 0) {
              Keyboard.dismiss();
              console.log({sss: this.state.phone});
              this.onRegister();
            }
          }}>
          <Text style={styles.textButton}>تسجيل</Text>
        </Button>
        <Text style={{color: 'red'}}>{this.state?.error}</Text>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    paddingRight: 40,
    paddingLeft: 40,
    direction: 'rtl',
    flex: 1,
    backgroundColor: 'white',
  },
  welcomeText: {
    fontSize: 30,
    textAlign: 'right',
    fontFamily: primaryFont,
    color: mainBlack,
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 18,
    textAlign: 'right',
    fontFamily: secondaryFont,
    marginBottom: 35,
    lineHeight: 30,
    color: mainBlack,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  radioContainer: {
    width: '40%',
  },
  radioText: {
    fontSize: 18,
    fontFamily: secondaryFont,
  },
  input: {
    backgroundColor: mainGrey,
    borderRadius: 7,
    height: 56,
    width: '100%',
    textAlign: 'center',
    fontSize: 19,
    marginBottom: 37,
    fontFamily: secondaryFont,
  },
  button: {
    width: '100%',
    borderRadius: 7,
    height: 56,
    backgroundColor: mainBlue,
    color: 'white',
  },
  textButton: {
    fontSize: 24,
    fontFamily: secondaryFont,
  },
});
