/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {useState, useLayoutEffect, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  NativeAppEventEmitter,
  AsyncStorage,
  ImageBackground,
  PushNotificationIOS,
} from 'react-native';
import {
  Flex,
} from '@ant-design/react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Navbar from '../../components/navbar';
import BleManager from 'react-native-ble-manager';
import api from '../../../utils/api';
import {primaryFont, secondaryFont} from '../../../utils/globalStyles/fonts';
import {calculateHoursFromDate, handleHours, getCurrentCoordinates} from '../../../utils/helpers';
import PushNotification from 'react-native-push-notification';
import { UserContext } from '../../context/UserContext';

const bgRed = require('../../../assets/img/bg-red.png');
const bgGray = require('../../../assets/img/bg-gray.png');
const bgOrange = require('../../../assets/img/bg-orange.png');
const mouvment = require('../../../assets/img/mouvment.png');
const location = require('../../../assets/img/location.png');
const testCovid = require('../../../assets/img/testCovid.png');
const mask = require('../../../assets/img/mask.png');

const Home: (navigation) => React$Node = ({navigation}) => {
  const [stats, setStats] = useState<{
    Confirmed: string;
    Deaths: string;
    Recovered: string;
    Date: string;
  }>({
    Confirmed: '...',
    Deaths: '...',
    Recovered: '...',
    Date: new Date().toDateString(),
  });

  const [nearbyDevices, setNearbyDevices] = useState([]);
  const {userData, setUserDataAndSyncStore} = useContext(UserContext);

  useEffect(() => {
    BleManager.start().then(() => {
      // Success code
      console.log('Module initialized');
      BleManager.enableBluetooth()
        .then(() => {
          // Success code
          console.log('The bluetooth is already enabled or the user confirm');
          BleManager.scan([], 10)
            .then(res => {
              console.log('scan started' + res);
            })
            .catch(error => {
              console.log('error scan : ' + error);
            });
        })
        .catch(error => {
          // Failure code
          console.log('The user refuse to enable bluetooth');
        });
    });

    NativeAppEventEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      async args => {
        const temp = [];
        console.log({nearbyDevices});
        if (!nearbyDevices.includes(args.id) && args.rssi > -80) {
          console.log('approximate device found', args, {
            rssi: args.rssi,
            name: args.name,
            id: args.id,
          }, nearbyDevices);
          temp.push(args.id);
          console.log({temp});
          setNearbyDevices(temp);
          // const data = await AsyncStorage.getItem('userData');
          // const userData = JSON.parse(data);
          // console.log({id: userData.user.id});
          PushNotification.localNotification({
            /* Android Only Properties */
            // id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            // ticker: 'My Notification Ticker', // (optional)
            // autoCancel: true, // (optional) default: true
            // largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            // smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            // bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
            // subText: 'This is a subText', // (optional) default: none
            color: 'red', // (optional) default: system default
            // vibrate: true, // (optional) default: true
            // vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            // tag: 'some_tag', // (optional) add tag to message
            // group: 'group', // (optional) add group to message
            // ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: 'max', // (optional) set notification priority, default: high
            visibility: 'public', // (optional) set notification visibility, default: private
            // importance: 'max', // (optional) set notification importance, default: high
            // allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            // ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      
            /* iOS only properties */
            alertAction: 'view', // (optional) default: view
            category: '', // (optional) default: empty string
            userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      
            /* iOS and Android properties */
            title: 'تنبيه!!!', // (optional)
            message: 'لقد تم اكتشاف شخص ما بقربك، حافحظ على مسافة الأمان!', // (required)
            // playSound: false, // (optional) default: true
            soundName: 'alert.mp3', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
          });
          const res = await api.put(`/users/updateContactedPeople/${userData.user.id}`, {
            contactedPeople: {
              deviceId: args.id,
              rssi: args.rssi,
              location: 'here',
            },
          });
          setUserDataAndSyncStore(res.json());
        }
      },
    );
  }, []);

  useEffect(() => {
    getCurrentCoordinates(userData, setUserDataAndSyncStore);
  }, []);

  const getStats = () => {
    try {
      return api.getStats();
    } catch (err) {
      console.log({err});
    }
  };

  useEffect(() => {
    getStats()
      .then(res => res.json())
      .then(resJson => {
        const {tested_pos, day: date, hour, dead, healed} = resJson[0];
        const [day, month, year] = date.trim().split('-');
        const constructDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour.replace('H', '').trim()),
        );
        setStats({
          Confirmed: tested_pos,
          Date: new Date(constructDate).toISOString(),
          Deaths: dead,
          Recovered: healed,
        });
      });
  }, [stats.Date]);

  // PushNotification.configure({
  //   onRegister: function(token) {
  //     console.log('TOKEN:', token);
  //   },

  //   onNotification: function(notification) {
  //     console.log('NOTIFICATION:', notification);
  //     notification.finish(PushNotificationIOS.FetchResult.NoData);
  //   },

  //   // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  //   // senderID: "YOUR GCM (OR FCM) SENDER ID",

  //   // IOS ONLY (optional): default: all - Permissions to register.
  //   permissions: {
  //     alert: true,
  //     badge: true,
  //     sound: true,
  //   },

  //   // Should the initial notification be popped automatically
  //   // default: true
  //   popInitialNotification: true,

  //   /**
  //    * (optional) default: true
  //    * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //    * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //    */
  //   requestPermissions: true,
  // });
console.log({userData})
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Navbar />
        <Text style={styles.headline}>إحصائيات الوباء في المغرب</Text>
        <Text style={{...styles.subHeadline, marginBottom: 10}}>
          آخر تحديث: قبل {handleHours(calculateHoursFromDate(stats.Date))}
        </Text>
        <Flex justify="between" style={{marginBottom: 30}}>
          <View style={styles.statCard}>
            <ImageBackground source={bgRed} style={styles.bgStatsCard}>
              <Text style={{...styles.textStatCard, fontSize: 20}}>
                {stats.Deaths}
              </Text>
              <Text style={styles.textStatCard}>وفاة</Text>
            </ImageBackground>
          </View>
          <View style={styles.statCard}>
            <ImageBackground source={bgGray} style={styles.bgStatsCard}>
              <Text style={{...styles.textStatCard, fontSize: 20}}>
                {stats.Recovered}
              </Text>
              <Text style={styles.textStatCard}>حالة شفاء</Text>
            </ImageBackground>
          </View>
          <View style={styles.statCard}>
            <ImageBackground source={bgOrange} style={styles.bgStatsCard}>
              <Text style={{...styles.textStatCard, fontSize: 20}}>
                {stats.Confirmed}
              </Text>
              <Text style={styles.textStatCard}>حالة مؤكدة</Text>
            </ImageBackground>
          </View>
        </Flex>

        <Text style={styles.headline}>القائمة</Text>
        <Flex justify="between" style={{marginTop: 20}}>
          <View>
            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('Analytics')}>
              <ImageBackground source={mouvment} style={styles.bgMenuCard}>
                <Text style={styles.textMenuCard}>تحركاتك</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.menuCard, marginTop: -5}}
              onPress={() => navigation.navigate('Midad')}>
              <ImageBackground source={mask} style={styles.bgMenuCard}>
                <Text style={{...styles.textMenuCard, fontSize: 26}}>
                  معطيات مداد
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('Test')}>
              <ImageBackground source={testCovid} style={styles.bgMenuCard}>
                <Text style={styles.textMenuCard}>اختبار الإصابة</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.menuCard, marginTop: -5}}
              onPress={() => navigation.navigate('Distribution')}>
              <ImageBackground source={location} style={styles.bgMenuCard}>
                <Text style={{...styles.textMenuCard, fontSize: 26}}>
                  توزيع الإصابات
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </Flex>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingTop: '7%',
    paddingHorizontal: '9%',
    direction: 'rtl',
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: 10,
    width: 180,
    height: 180,
    backgroundColor: '#CF516C',
    borderWidth: 2,
    borderColor: '#1F1424',
  },
  cardImg: {
    width: 60,
    height: 110,
  },
  cardText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1F1424',
    textAlign: 'center',
    fontFamily: 'JannaLT-Regular',
  },
  statisticsText: {
    textAlign: 'center',
    fontSize: 16,
  },
  statisticsNumbers: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  headline: {
    fontFamily: primaryFont,
    fontSize: 31,
    textAlign: 'right',
  },
  subHeadline: {
    fontFamily: secondaryFont,
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 30,
  },
  statCard: {
    width: 90,
    height: 90,
    shadowOffset: {width: 25, height: 25},
    shadowColor: 'black',
    shadowOpacity: 0.5,
    backgroundColor: '#0000',
    elevation: 20,
  },
  bgStatsCard: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  textStatCard: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontFamily: secondaryFont,
  },
  mouvementCard: {
    width: 170,
    height: 320,
    justifyContent: 'flex-end',
  },
  menuCard: {
    width: 150,
    height: 150,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  bgMenuCard: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    padding: 10,
  },
  textMenuCard: {
    fontSize: 30,
    fontFamily: secondaryFont,
    color: 'white',
  },
});
