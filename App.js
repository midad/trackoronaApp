/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useState, useEffect, useLayoutEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackground} from '@react-navigation/stack';

import Register from './src/screens/register';
import CodeVerification from './src/screens/codeVerification';
import Home from './src/screens/home';
import Analytics from './src/screens/analytics';
import Distribution from './src/screens/distribution';
import Test from './src/screens/test';
import {AsyncStorage} from 'react-native';
import api from './utils/api';
import {mainBlack} from './utils/globalStyles/colors';
import {primaryFont} from './utils/globalStyles/fonts';
import Profil from './src/screens/profil';
import {replaceObject} from './utils/helpers';
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotification from 'react-native-push-notification';



const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const App: () => React$Node = () => {
  console.disableYellowBox = true;
  const [isLogged, setIsLogged] = useState(false);
  const [isProfilFilled, setIsProfilFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const data = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(data);

      console.log({parsedData});
      if (parsedData.token && parsedData.user) {
        setIsLogged(true);
      }
      if (parsedData.user.age && parsedData.user.gender) {
        setIsProfilFilled(true);
      }
      return parsedData;
    } catch (error) {
      console.log({error});
    }
    finally {
      setIsLoading(false);
    }
  };

  const getUpdatedUserData = async () => {
    const {token} = await getUserData();
    try {
      const data = await (await api.get(
        `/users/me?access_token=${token}`,
      )).json();
      console.log({data});
      return data;
    } catch (error) {
      console.log({error});
    }
  };

  const setUserData = async () => {
    try {
      const newUserDataJson = await replaceObject(
        await getUserData(),
        'user',
        await getUpdatedUserData(),
      );
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.setItem('userData', JSON.stringify(newUserDataJson));
      return true;
    } catch (err) {
      console.log({err});
    }
  };

  useEffect(() => {
    async function execute() {
      await setUserData();
    }

    execute();
  }, []);

  // useEffect(async () => {
  //   AsyncStorage.getItem('userData')
  //     .then(res => JSON.parse(res))
  //     .then(resJson => {
  //       console.log({resJson});
  //       if (resJson.token) {
  //         api
  //           .get(`/users/me?access_token=${resJson.token}`)
  //           .then(apiRes => apiRes.json())
  //           .then(apiJson => {
  //           });
  //       }
  //     });
  // });

  // useEffect(() => {
  //   console.log({isLogged, isProfilFilled});
  // }, [isLogged, isProfilFilled]);

  if (isLoading) {
    return <Spinner visible={true} />;
  }

  // if (isLogged && isProfilFilled) {
  //   return (
  //     <NavigationContainer>
  //       <Navigator initialRouteName="Home">
  //       </Navigator>
  //     </NavigationContainer>
  //   );
  // }

  return (
    <NavigationContainer>
      <Navigator initialRouteName={isLogged && isProfilFilled ? 'Home' : 'Register'}>
        <Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Screen
          name="CodeVerification"
          component={CodeVerification}
          options={{
            headerTitle: 'التحقق من الهوية',
            headerTitleAlign: 'center',
            headerTintColor: mainBlack,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 26,
              color: mainBlack,
              fontFamily: primaryFont,
            },
          }}
        />
        <Screen
          name="Profil"
          component={Profil}
          options={{headerShown: false}}
        />
        <Screen name="Home" component={Home} options={{headerShown: false}} />
        <Screen
          name="Analytics"
          component={Analytics}
          options={{headerShown: false}}
        />
        <Screen name="Test" component={Test} options={{headerShown: false}} />
        <Screen
          name="Distribution"
          component={Distribution}
          options={{headerShown: false}}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default App;
