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
import AutoTest from './src/screens/test/autoTest';
import VoiceTest from './src/screens/test/voiceTest';
import {AsyncStorage} from 'react-native';
import api from './utils/api';
import {mainBlack} from './utils/globalStyles/colors';
import {primaryFont} from './utils/globalStyles/fonts';
import Profil from './src/screens/profil';
import {replaceObject, getUserData} from './utils/helpers';
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotification from 'react-native-push-notification';
import Midad from './src/screens/midad';
import {UserContext} from './src/context/UserContext';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

const App: () => React$Node = () => {
  console.disableYellowBox = true;
  const [isLogged, setIsLogged] = useState(false);
  const [isProfilFilled, setIsProfilFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});

  // const getUserData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await AsyncStorage.getItem('userData');
  //     const parsedData = JSON.parse(data);

  //     if (parsedData.token && parsedData.user) {
  //       setIsLogged(true);
  //     }
  //     if (parsedData.user.age && parsedData.user.gender) {
  //       setIsProfilFilled(true);
  //     }
  //     return parsedData;
  //   } catch (error) {
  //     console.log({error});
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const setUserDataAndSyncStore = async newUserData => {
    try {
      console.log({newUserData}, '_______+++++');
      const newUserDataJson = await replaceObject(
        await getUserData(),
        'user',
        newUserData,
      );
      setUserData(newUserDataJson);
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.setItem('userData', JSON.stringify(newUserDataJson));
      return true;
    } catch (err) {
      console.log({err});
    }
  };

  useEffect(() => {
    getUserData().then(res => {
      console.log({res});

      if (!!res.token && !!res.user) {
        setIsLogged(true);
      }
      if (res?.user?.age) {
        setIsProfilFilled(true);
      }
      setUserData(res);
    });
    // console.log()
    // async function execute() {
    //   await getUserData();
    // }

    // execute();
    // console.log({res})
    // setUserData(res);
  }, []);

  // useEffect(() => {
  //   console.log({userData}, '******')
  //   if (userData.token && userData.user) {
  //     setIsLogged(true);
  //   }
  //   if (userData?.user?.age && userData?.user?.gender) {
  //     setIsProfilFilled(true);
  //   }
  // });

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
  console.log({MMMMMMMMMMMMM: isLogged && isProfilFilled});
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
    <UserContext.Provider
      value={{
        userData: userData,
        setUserDataAndSyncStore: setUserDataAndSyncStore,
      }}>
      <NavigationContainer>
        <Navigator
          initialRouteName={isLogged && isProfilFilled ? 'Home' : 'Register'}>
          {isLogged && isProfilFilled ? (
            <>
              <Screen
                name="Home"
                component={Home}
                options={{headerShown: false}}
              />
              <Screen
                name="Analytics"
                component={Analytics}
                options={{headerShown: false}}
              />
              <Screen
                name="Test"
                component={Test}
                options={{headerShown: false}}
              />
              <Screen
                name="AutoTest"
                component={AutoTest}
                options={{headerShown: false}}
              />
              <Screen
                name="VoiceTest"
                component={VoiceTest}
                options={{headerShown: false}}
              />
              <Screen
                name="Distribution"
                component={Distribution}
                options={{headerShown: false}}
              />
              <Screen
                name="Midad"
                component={Midad}
                options={{headerShown: false}}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

export default App;
