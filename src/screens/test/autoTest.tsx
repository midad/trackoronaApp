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
  Linking,
  SafeAreaView,
  Platform,
  AsyncStorage,
  Image,
} from 'react-native';
import {
  WhiteSpace,
  Button,
  SegmentedControl,
  Flex,
  Modal,
  Provider,
} from '@ant-design/react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Navbar from '../../components/navbar';
import {Badge} from 'react-native-elements';
import * as Progress from 'react-native-progress';
import Share from 'react-native-share';
import VoiceTest from './voiceTest';
import api from '../../../utils/api';
import {primaryFont, secondaryFont} from '../../../utils/globalStyles/fonts';
import {mainBlue, mainBlack} from '../../../utils/globalStyles/colors';
import {getUserData, replaceObject} from '../../../utils/helpers';
import {UserContext} from '../../context/UserContext';

const startingScore = (gender, age, diabetes, cardio, pneumo) => {
  let sum = 0;

  if (gender === 'male') {
    sum = 2;
  }
  if (parseInt(age) > 43) {
    sum += 2;
  }
  if (diabetes) {
    sum += 6;
  }
  if (cardio) {
    sum += 6;
  }
  if (pneumo) {
    sum += 6;
  }

  return sum;
};

// const getData = async () => {
//   const data = await AsyncStorage.getItem('userData');
//   const parsedData = JSON.parse(data);
//   const {
//     user: {gender, age, diabetes, cardio, pneumo, id, illnessScore},
//     token,
//   } = parsedData;
//   console.log({parsedData, age});
//   return {
//     gender,
//     age,
//     diabetes,
//     cardio,
//     pneumo,
//     id,
//     illnessScore,
//     token,
//   };
// };

const Test: (navigation) => React$Node = ({navigation}) => {
  const [total, setTotal] = useState(0);
  const [totalHistory, setTotalHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  // const [userData, setUserData] = useState({});
  // const {userData, setUserData} = route.params;
  const {userData, setUserDataAndSyncStore} = useContext(UserContext);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {backgroundColor: '#6ABA74'},
      headerRight: () => (
        <Button
          style={{height: 30, marginRight: 10}}
          onPress={() => navigation.navigate('Home')}>
          القائمة
        </Button>
      ),
      headerLeft: () => <Navbar />,
    });
  });

  useEffect(() => {
    const {
      user: {gender, age, diabetes, cardio, pneumo},
    } = userData;
    setTotal(startingScore(gender, age, diabetes, cardio, pneumo));
  }, []);

  const YesNoLittleSometimesTestQuestions = [
    'هل لديك إرتفاع في الحرارة ؟',
    'هل تعاني من سعال (كحة) جاف ؟',
    'هل تعاني من أوجاع وآلام ؟ (على سبيل المثال آلام في العضلات)',
    'هل يوجد لديك صداع ؟',
  ];
  const YesNoLittleTestQuestions = [
    'هل تشعر بإجهاد (عياء) عام ؟',
    'هل تعاني من العطس ؟',
    'هل تعاني هذه الأيام من صعوبة في التنفس ؟',
  ];
  const YesNoTestQuestions = [
    'هل تعاني من سيلان الأنف ؟',
    'هل تعاني من إلتهاب في الحلق ؟',
    'هل تعاني من الإسهال ؟',
    'هل كان لديك اتصال مع شخص معروف إصابته بفايروس كورونا؟',
  ];

  const calculateTotal = (value: number, question: number) => {
    const multiplier = question === 0 ? 6 : question === 10 ? 18 : 1;
    const existantAnswer = totalHistory.find(elm => elm.question === question);
    if (!!existantAnswer) {
      let oldValue = null;
      oldValue = existantAnswer.value * multiplier;
      existantAnswer.value = value;
      setTotal(total - oldValue + value * multiplier);
    } else {
      const newTotalHistory = totalHistory.concat({
        question,
        value,
      });
      setTotalHistory(newTotalHistory);
      setTotal(total + value * multiplier);
    }
  };

  const totalInPercentage = Math.ceil((total * 100) / 77);

  const canSeeResult =
    totalHistory.length ===
    YesNoTestQuestions.length +
      YesNoLittleTestQuestions.length +
      YesNoLittleSometimesTestQuestions.length;

  console.log({total, totalInPercentage});
  const adviceWhenRisk = () => (
    <>
      <Text
        style={{
          textAlign: 'center',
          color: 'red',
          fontFamily: secondaryFont,
          fontSize: 18,
          lineHeight: 25,
          marginBottom: 30,
        }}>
        أنقذ نفسك وأسرتك ومن حولك، ننصحك بالاتصال عاجلا بمصالح اليقظة الوبائية
        لإجراء المزيد من الفحوصات؛ اضغط على:
      </Text>
      <View>
        <Flex justify="around">
          <Button
            style={{
              backgroundColor: '#14c879',
              borderRadius: 15,
              height: 50,
              minWidth: 100,
            }}
            onPress={() => Linking.openURL(`tel:141`)}>
            <Text style={{color: 'white'}}>141</Text>
          </Button>
          <Button
            style={{backgroundColor: '#14c879', borderRadius: 15, height: 50}}
            onPress={() => Linking.openURL(`tel:0801004747`)}>
            <Text style={{color: 'white'}}>0801004747</Text>
          </Button>
        </Flex>
      </View>
    </>
  );

  const adviceWhenOk = () => (
    <Text
      style={{
        textAlign: 'center',
        color: 'green',
        fontFamily: secondaryFont,
        fontSize: 25,
        lineHeight: 30,
      }}>
      حالتك مستقرة، غالبا أنت تعاني من نزلة برد عادية، ننصحك بالاتصال بطبيبك
      ليتتبع حالتك، كما ننصحك بالتزام الحجر المنزلي والحفاظ على تدابير الوقاية،
      فالوقاية خير من العلاج!
    </Text>
  );

  const shareMessage = `لقد أجريت اختبار الإصابة بفايروس كورونا، احتمال إصابتي هو ${totalInPercentage} % ... أدعوك إلى اجتياز نفس الاختبار`;
  const shareUrl = 'https://midad-covid.com/';
  const shareTitle = 'اختباري ...';

  const shareOptions = Platform.select({
    ios: {
      activityItemSources: [
        {
          placeholderItem: {type: 'url', content: shareUrl},
          item: {
            default: {type: 'url', content: shareUrl},
          },
          subject: {
            default: shareTitle,
          },
          linkMetadata: {originalUrl: shareUrl, shareUrl, shareTitle},
        },
        {
          placeholderItem: {type: 'text', content: shareMessage},
          item: {
            default: {type: 'text', content: shareMessage},
            message: null, // Specify no text to share via Messages app.
          },
        },
      ],
    },
    default: {
      shareTitle,
      subject: shareTitle,
      message: `${shareMessage} ${shareUrl}`,
    },
  });

  const updateScore = async () => {
    console.log('heere', userData.user.id);
    setIsSending(true);
    try {
      api
        .put(`/users/updateScore/${userData.user.id}`, {
          illnessScore: totalInPercentage,
        })
        .then(resp => resp.json())
        .then(respJson => {
          console.log({respJson});
          if (respJson.illnessScore) {
            // const newUserDataJson = replaceObject(userData, 'user', respJson);
            // console.log({newUserDataJson});
            setUserDataAndSyncStore(respJson);
          }
        });
    } catch (error) {
      console.log({error});
      setError(error.toString());
    } finally {
      setIsSending(false);
    }
  };
  console.log({isSending});
  return (
    <Provider>
      <Flex
        justify="between"
        style={{
          backgroundColor: mainBlue,
          paddingTop: 35,
          paddingHorizontal: 40,
        }}>
        <Image
          source={require('../../../assets/img/trackoronaWhite.png')}
          style={{
            width: 136,
            height: 14,
            resizeMode: 'stretch',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
            canSeeResult && updateScore();
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontFamily: primaryFont,
              borderBottomWidth: 1,
              borderBottomColor: 'white',
            }}>
            النتيجة
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Test')}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontFamily: primaryFont,
              borderBottomWidth: 1,
              borderBottomColor: 'white',
            }}>
            رجوع
          </Text>
        </TouchableOpacity>
      </Flex>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <Text
            style={{...styles.headline, color: 'white', marginVertical: 45}}>
            الاختبار التفاعلي
          </Text>
          {YesNoLittleSometimesTestQuestions.map((question, index) => (
            <>
              <Text
                style={{...styles.cardText, color: 'white', marginBottom: 12}}>
                السؤال رقم {index + 1}
              </Text>
              <View style={styles.card} key={index}>
                <Text style={styles.cardText}>{question}</Text>
                <SegmentedControl
                  style={{height: 40}}
                  values={[
                    <Text style={styles.segment}>لا</Text>,
                    <Text style={styles.segment}>أحيانا</Text>,
                    <Text style={styles.segment}>قليلا</Text>,
                    <Text style={styles.segment}>نعم</Text>,
                  ]}
                  selectedIndex={-1}
                  onChange={e =>
                    calculateTotal(e.nativeEvent.selectedSegmentIndex, index)
                  }
                />
              </View>
            </>
          ))}
          {YesNoLittleTestQuestions.map((question, index) => (
            <>
              <Text
                style={{...styles.cardText, color: 'white', marginBottom: 12}}>
                السؤال رقم{' '}
                {index + YesNoLittleSometimesTestQuestions.length + 1}
              </Text>
              <View
                style={styles.card}
                key={index + YesNoLittleSometimesTestQuestions.length}>
                <Text style={styles.cardText}>{question}</Text>
                <SegmentedControl
                  style={{height: 40}}
                  values={[
                    <Text style={styles.segment}>لا</Text>,
                    <Text style={styles.segment}>قليلا</Text>,
                    <Text style={styles.segment}>نعم</Text>,
                  ]}
                  selectedIndex={-1}
                  onChange={e =>
                    calculateTotal(
                      e.nativeEvent.selectedSegmentIndex,
                      index + YesNoLittleSometimesTestQuestions.length,
                    )
                  }
                />
              </View>
            </>
          ))}
          {YesNoTestQuestions.map((question, index) => (
            <>
              <Text
                style={{...styles.cardText, color: 'white', marginBottom: 12}}>
                السؤال رقم{' '}
                {index +
                  YesNoLittleSometimesTestQuestions.length +
                  YesNoLittleTestQuestions.length +
                  1}
              </Text>
              <View
                style={styles.card}
                key={
                  index +
                  YesNoLittleSometimesTestQuestions.length +
                  YesNoLittleTestQuestions.length
                }>
                <Text style={styles.cardText}>{question}</Text>
                <SegmentedControl
                  style={{height: 40}}
                  values={[
                    <Text style={styles.segment}>لا</Text>,
                    <Text style={styles.segment}>نعم</Text>,
                  ]}
                  selectedIndex={-1}
                  onChange={e =>
                    calculateTotal(
                      e.nativeEvent.selectedSegmentIndex,
                      index +
                        YesNoLittleSometimesTestQuestions.length +
                        YesNoLittleTestQuestions.length,
                    )
                  }
                />
              </View>
            </>
          ))}
        </SafeAreaView>
      </ScrollView>
      <Modal
        popup
        visible={showModal}
        animationType="slide-up"
        onClose={() => setShowModal(false)}>
        {!canSeeResult ? (
          <View
            style={{
              padding: 40,
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              marginRight: 'auto',
              marginLeft: 'auto',
            }}>
            <View
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 30,
              }}>
              <Progress.Circle
                progress={
                  totalHistory.length /
                  (YesNoTestQuestions.length +
                    YesNoLittleTestQuestions.length +
                    YesNoLittleSometimesTestQuestions.length)
                }
                size={75}
                showsText
                textStyle={{fontSize: 14, fontWeight: 'bold'}}
              />
            </View>
            <Text style={styles.subHeadline}>يجب الإجابة عن جميع الأسئلة</Text>
            <Button
              type="primary"
              style={{width: 170}}
              onPress={() => setShowModal(false)}>
              رجوع
            </Button>
          </View>
        ) : (
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 40,
              backgroundColor: 'white',
            }}>
            <Text style={{...styles.subHeadline, textAlign: 'center'}}>
              لقد أتممت الاختبار بنجاح ...
            </Text>
            <Text
              style={{
                ...styles.subHeadline,
                textAlign: 'center',
                marginBottom: 10,
              }}>
              بناء على ما أدخلته من معطيات، فاحتمال إصابتك بالفايروس هو:
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 80,
                fontWeight: 'bold',
                color: totalInPercentage > 55 ? 'red' : 'green',
              }}>
              {totalInPercentage}%
            </Text>
            {totalInPercentage > 55 ? adviceWhenRisk() : adviceWhenOk()}
            <WhiteSpace size="xl" />
            <Text
              style={{
                fontFamily: secondaryFont,
                textAlign: 'center',
                fontSize: 18,
              }}>
              شارك نتيحة الاختبار مع أقربائك وأصدقائك وحثهم على إجراء نفس
              الاختبار
            </Text>
            <WhiteSpace size="xl" />
            <Button type="primary" onPress={() => Share.open(shareOptions)}>
              <Text style={styles.textButton}>شارك</Text>
            </Button>
            <WhiteSpace size="lg" />
            <Button onPress={() => setShowModal(false)}>
              <Text style={styles.textButton}>إغلاق</Text>
            </Button>
          </View>
        )}
      </Modal>
    </Provider>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingBottom: 80,
    direction: 'rtl',
    flex: 1,
    backgroundColor: mainBlue,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,
  },
  segment: {
    height: 30,
    fontSize: 16,
    fontFamily: secondaryFont,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 24,
    color: mainBlack,
    fontFamily: secondaryFont,
    lineHeight: 30,
  },
  cardNumber: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    color: 'red',
  },
  probability: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 80,
    color: 'red',
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
    lineHeight: 22,
  },
  textButton: {
    fontFamily: secondaryFont,
  },
  error: {
    fontFamily: secondaryFont,
    fontSize: 16,
    color: 'red',
  },
});
