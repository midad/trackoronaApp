/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Flex,
} from '@ant-design/react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {primaryFont, secondaryFont} from '../../../utils/globalStyles/fonts';
import {mainBlack} from '../../../utils/globalStyles/colors';
import api from '../../../utils/api';
import Spinner from 'react-native-loading-spinner-overlay';

const Distribution: (navigation) => React$Node = ({navigation}) => {
  const [regionsStats, setRegionsStats] = useState([]);

  const getRegionsStats = () => {
    try {
      return api.getRegionsStats();
    } catch (err) {
      console.log({err});
    }
  };

  useEffect(() => {
    getRegionsStats()
      .then(res => res.json())
      .then(resJson => {
        setRegionsStats(resJson);
      });
  }, []);

  if (Object.keys(regionsStats).length === 0) {
    return <Spinner visible={true} />;
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
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
        <Text style={styles.headline}>توزيع الإصابات</Text>
        <Text style={styles.subHeadline}>الحالة الوبائية حسب الجهات</Text>
        {regionsStats.map((region, index) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{region.region_name_ar}</Text>
            <Flex justify="between">
              <View>
                <Text style={styles.tagText}>الوفايات</Text>
                <Text style={{...styles.tagNumber, color: '#ff6e35'}}>
                  {region.deaths}
                </Text>
              </View>
              <View>
                <Text style={styles.tagText}>حالات الشفاء</Text>
                <Text style={{...styles.tagNumber, color: '#00c976'}}>
                  {region.recovered}
                </Text>
              </View>
              <View>
                <Text style={styles.tagText}>الحالات المؤكدة</Text>
                <Text style={{...styles.tagNumber, color: '#ff4b4b'}}>
                  {region.confirmed}
                </Text>
              </View>
            </Flex>
          </View>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Distribution;

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    direction: 'rtl',
    flex: 1,
    backgroundColor: '#8f5ed9',
    paddingHorizontal: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,
  },
  cardImg: {
    width: 415,
    height: 270,
  },
  cardText: {
    fontSize: 18,
    marginBottom: 18,
    color: mainBlack,
    textAlign: 'right',
    fontFamily: 'JannaLT-Regular',
  },
  headline: {
    fontFamily: primaryFont,
    fontSize: 31,
    textAlign: 'right',
    marginTop: 42,
    color: 'white',
  },
  subHeadline: {
    fontFamily: secondaryFont,
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 30,
    color: 'white',
  },
  tagText: {
    fontFamily: secondaryFont,
    textAlign: 'center',
  },
  tagNumber: {
    fontFamily: primaryFont,
    fontSize: 36,
    textAlign: 'center',
  },
});
