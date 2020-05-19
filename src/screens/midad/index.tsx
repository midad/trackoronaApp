import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {Flex} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {primaryFont, secondaryFont} from '../../../utils/globalStyles/fonts';
import Chart from '../../components/Chart';

export default function Monitor() {
  const navigation = useNavigation();
  const [mode, setMode] = useState('auto');
  const [temp, setTemp] = useState(37);
  const [humidity, setHumidity] = useState(60);
  const [pression, setPression] = useState(766);

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTemp(Math.floor(Math.random() * 5) + 35);
      setHumidity(Math.floor(Math.random() * 15) + 70);
      setPression(Math.floor(Math.random() * 112) + 888);
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  });

  return (
    <ScrollView>
      <SafeAreaView style={s.container}>
        <Flex justify="between">
          <Image
            source={require('../../../assets/img/trackoronaWhite.png')}
            style={{
              width: 136,
              height: 14,
              resizeMode: 'stretch',
            }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                fontFamily: primaryFont,
                borderBottomWidth: 1,
                borderBottomColor: 'white',
              }}>
              القائمة
            </Text>
          </TouchableOpacity>
        </Flex>
        <Text style={s.headline}>لوحة التحكم</Text>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={s.kpiContainer}>
              <View style={s.kpiTop}>
                <Text style={{...s.kpiValue, color: '#fb7e18'}}>{temp}</Text>
                <Text style={{...s.kpiUnit, color: '#fb7e18'}}>°C</Text>
              </View>
              <Text style={{...s.kpiName, color: '#fb7e18'}}>T. exp</Text>
            </View>
            <View style={s.kpiContainer}>
              <View style={s.kpiTop}>
                <Text style={{...s.kpiValue, color: '#00b598'}}>{humidity}</Text>
                <Text style={{...s.kpiUnit, color: '#00b598'}}>%</Text>
              </View>
              <Text style={{...s.kpiName, color: '#00b598'}}>Humidité</Text>
            </View>
            <View style={s.kpiContainer}>
              <View style={s.kpiTop}>
                <Text style={{...s.kpiValue, color: '#00b598'}}>{pression}</Text>
                <Text style={{...s.kpiUnit, color: '#00b598'}}>mBar</Text>
              </View>
              <Text style={{...s.kpiName, color: '#00b598'}}>Pression</Text>
            </View>
          </View>
          {/*<View style={s.chartContainer}>*/}
          {/*<Chart*/}
          {/*  name="Pression de l'air insuflé"*/}
          {/*  unit="cmH2O"*/}
          {/*  min={-80}*/}
          {/*  max={80}*/}
          {/*/>*/}
          {/*</View>*/}
          <View style={s.chartContainer}>
            <Chart name="Température" unit="°C" min={9} max={60} instantValue={temp} />
          </View>
          <View style={s.chartContainer}>
            <Chart name="Humidité" unit="%" min={0} max={100} instantValue={humidity} />
          </View>
          <View style={s.chartContainer}>
            <Chart name="Pression" unit="mBar" min={500} max={1060} instantValue={pression} />
          </View>
          {/* <View style={s.overlay}>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: '50%',
                fontSize: 18,
                fontFamily: secondaryFont,
                color: 'white',
                lineHeight: 30,
              }}>
              المرجو ربط قناع مداد بالتطبيق لتتبع المؤشرات الحيوية الخاصة بك
            </Text>
          </View> */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: {
    paddingVertical: '6%',
    backgroundColor: '#2755bf',
    flex: 1,
    paddingHorizontal: '9%',
    // paddingBottom: 34,
  },
  kpiContainer: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '30%',
  },
  title: {color: 'white', fontSize: 31, marginBottom: 43},
  kpiTop: {flexDirection: 'row', alignItems: 'flex-end'},
  kpiValue: {fontSize: 28, fontWeight: 'bold'},
  kpiUnit: {fontSize: 18, top: -3},
  kpiName: {fontSize: 16},
  headline: {
    fontFamily: primaryFont,
    fontSize: 31,
    textAlign: 'right',
    color: 'white',
    marginVertical: 40,
  },
  subHeadline: {
    fontFamily: secondaryFont,
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 30,
    lineHeight: 22,
  },
  chartContainer: {
    height: 230,
    width: '100%',
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  overlay: {
    position: 'absolute',
    top: -30,
    bottom: 0,
    left: '-15%',
    right: '-15%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 40,
    // borderRadius: 25,
  },
});
