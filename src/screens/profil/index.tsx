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
  Picker,
  TextInput,
  AsyncStorage,
  CheckBox,
} from 'react-native';
import {Button, Flex} from '@ant-design/react-native';
import api from '../../../utils/api';
import {secondaryFont} from '../../../utils/globalStyles/fonts';
import {mainGrey, mainBlue} from '../../../utils/globalStyles/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from '../../components/header';
import {replaceObject, getUserData} from '../../../utils/helpers';

const Profil: (navigation) => React$Node = ({navigation}) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [profil, setProfil] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    age: '12',
    cardio: false,
    diabetes: false,
    pneumo: false,
  });

  const onSubmit = async () => {
    setIsSending(true);
    try {
      const userData = await getUserData();
      const {
        user: {id},
      } = userData;
      const {
        firstName,
        lastName,
        gender,
        age,
        diabetes,
        cardio,
        pneumo,
      } = profil;

      return api
        .put(`/users/updateProfil/${id}`, {
          firstName,
          lastName,
          gender,
          age,
          diabetes,
          cardio,
          pneumo,
        })
        .then(resp => resp.json())
        .then(async resJson => {
          const newUserDataJson = await replaceObject(
            await getUserData(),
            'user',
            resJson,
          );
          console.log({newUserDataJson});
          if (newUserDataJson.token) {
            await AsyncStorage.setItem(
              'userData',
              JSON.stringify(newUserDataJson),
            );
            navigation.navigate('Home');
          }
        });
    } catch (error) {
      console.log({error});
      setError(error[0]);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="position">
      <Header />
      <Spinner visible={isSending} />
      <Text style={styles.detailsText}>
        المرجو إدخال المعطيات التالية لتتبع دقيق لوضعيتك
      </Text>

      <TextInput
        style={styles.input}
        placeholder="الاسم"
        onChangeText={val => setProfil({...profil, firstName: val})}
      />
      <TextInput
        style={styles.input}
        placeholder="النسب"
        onChangeText={val => setProfil({...profil, lastName: val})}
      />
      <Flex justify="between">
        <Picker
          style={styles.miniInput}
          mode="dropdown"
          selectedValue={profil.gender}
          onValueChange={(itemValue, itemIndex) =>
            setProfil({...profil, gender: itemValue})
          }>
          <Picker.Item label="الجنس" value="" />
          <Picker.Item label="أنثى" value="female" />
          <Picker.Item label="ذكر" value="male" />
        </Picker>
        <TextInput
          style={styles.miniInput}
          placeholder="السن"
          keyboardType="numeric"
          onChangeText={val => setProfil({...profil, age: val})}
        />
      </Flex>
      <Text style={styles.detailsText}>
        ما هي الأمراض المزمنة التي تعاني منها؟
      </Text>
      <Flex style={styles.checkboxContainer}>
        <Text style={styles.textCheckbox}>داء السكري</Text>
        <CheckBox
          value={profil.diabetes}
          onValueChange={val => setProfil({...profil, diabetes: val})}
        />
      </Flex>
      <Flex style={styles.checkboxContainer}>
        <Text style={styles.textCheckbox}>مرض القلب</Text>
        <CheckBox
          value={profil.cardio}
          onValueChange={val => setProfil({...profil, cardio: val})}
        />
      </Flex>
      <Flex style={styles.checkboxContainer}>
        <Text style={styles.textCheckbox}>ضيق التنفس</Text>
        <CheckBox
          style={styles.checkbox}
          value={profil.pneumo}
          onValueChange={val => setProfil({...profil, pneumo: val})}
        />
      </Flex>
      <Button
        type="primary"
        style={styles.button}
        onPress={() => {
          onSubmit();
          Keyboard.dismiss();
        }}>
        <Text style={styles.textButton}>حفظ</Text>
      </Button>
    </KeyboardAvoidingView>
  );
};

export default Profil;

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingRight: 40,
    paddingLeft: 40,
    direction: 'rtl',
    flex: 1,
    backgroundColor: 'white',
  },
  detailsText: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: secondaryFont,
    marginBottom: 15,
  },
  input: {
    backgroundColor: mainGrey,
    borderRadius: 7,
    height: 56,
    width: '100%',
    marginBottom: 30,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: secondaryFont,
  },
  miniInput: {
    backgroundColor: mainGrey,
    borderRadius: 7,
    height: 56,
    width: '45%',
    marginBottom: 30,
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
    marginTop: 20,
  },
  textButton: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: secondaryFont,
    color: 'white',
  },
  checkboxContainer: {
    marginLeft: 20,
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  textCheckbox: {
    fontFamily: secondaryFont,
    fontSize: 16,
  },
  checkbox: {
    alignSelf: 'center',
  },
});
