import React, {useMemo} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';

export default function UserCard({
  name,
  state,
  testedDate,
  age,
  extended,
  gender,
  height,
  weight,
}) {
  const navigation = useNavigation();
  const idealBodyWeight = useMemo(() => {
    if (gender === 'male') {
      return (50 + 0.91 * (height * 100 - 152.4)).toFixed(2);
    }
    if (gender === 'female') {
      return (45.5 + 0.91 * (height * 100 - 152.4)).toFixed(2);
    }
  }, []);
  const renderExtendedItems = () => {
    if (extended) {
      return (
        <>
          <View style={s.textItemsContainer}>
            <View style={s.textItemLeftContainer}>
              <Image
                style={s.textIcon}
                source={require('../assets/gender.png')}
              />
              <Text style={s.textItem}>Sexe:</Text>
            </View>
            <Text style={s.textItem}>{gender}</Text>
          </View>
          <View style={s.textItemsContainer}>
            <View style={s.textItemLeftContainer}>
              <Image
                style={s.textIcon}
                source={require('../assets/height.png')}
              />
              <Text style={s.textItem}>Hauteur:</Text>
            </View>
            <Text style={s.textItem}>{`${height}m`}</Text>
          </View>
          <View style={s.textItemsContainer}>
            <View style={s.textItemLeftContainer}>
              <Image
                style={s.textIcon}
                source={require('../assets/weight.png')}
              />
              <Text style={s.textItem}>Poids:</Text>
            </View>
            <Text style={s.textItem}>{weight}</Text>
          </View>
          <View style={s.textItemsContainer}>
            <View style={s.textItemLeftContainer}>
              <Image
                style={s.textIcon}
                source={require('../assets/weight.png')}
              />
              <Text style={{...s.textItem, fontWeight: 'bold'}}>
                Poids idéal (ARDSnet):
              </Text>
            </View>
            <Text
              style={{
                ...s.textItem,
                fontWeight: 'bold',
              }}>{`${idealBodyWeight}Kg`}</Text>
          </View>
        </>
      );
    }
    return null;
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (state === 'unconfigured') {
          navigation.navigate('Doctor/Configuration');
        } else {
          navigation.navigate('Doctor/Monitor');
        }
      }}>
      <View style={s.container}>
        <View style={s.topContainer}>
          <Image source={require('../assets/avatar.png')} style={s.avatar} />
          <View style={s.detailsContainer}>
            <Text style={s.name}>{name}</Text>
            <View style={s.statusIndicatorContainer}>
              <StatusIndicator state={state} />
            </View>
          </View>
        </View>
        <View style={s.bottomContainer}>
          <View style={s.textItemsContainer}>
            <View style={s.textItemLeftContainer}>
              <Image
                style={s.textIcon}
                source={require('../assets/clock.png')}
              />
              <Text style={s.textItem}>Positif depuis:</Text>
            </View>
            <Text style={s.textItem}>{testedDate}</Text>
          </View>
          <View style={s.textItemsContainer}>
            <View style={s.textItemLeftContainer}>
              <Image
                style={s.textIcon}
                source={require('../assets/calendar.png')}
              />
              <Text style={s.textItem}>Age:</Text>
            </View>
            <Text style={s.textItem}>{`${age} ans`}</Text>
          </View>
          {renderExtendedItems()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
function StatusIndicator({state}) {
  if (state === 'stable') {
    return [
      <View key="dot" style={{...s.dot, backgroundColor: '#14c879'}} />,
      <Text key="txt" style={s.stableText}>
        Etat Stable
      </Text>,
    ];
  }
  if (state === 'unstable') {
    return [
      <View key="dot" style={{...s.dot, backgroundColor: 'red'}} />,
      <Text key="txt" style={s.unstableText}>
        Etat Instable
      </Text>,
    ];
  }
  if (state === 'unconfigured') {
    return (
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View key="dot" style={{...s.dot, backgroundColor: '#faad14'}} />
          <Text key="txt" style={s.unconfiguredText}>
            Insuflatteur non configuré
          </Text>
        </View>
        <Image
          source={require('../assets/configure.png')}
          style={{width: 15, height: 15}}
        />
      </View>
    );
  }
  return null;
}
const s = StyleSheet.create({
  container: {
    borderRadius: 25,
    backgroundColor: '#ffffff',
    marginBottom: 24,
  },
  topContainer: {
    padding: 26,
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 19,
    width: 53,
    height: 53,
    backgroundColor: '#e1eaff',
    borderRadius: 4,
  },
  detailsContainer: {},
  name: {
    fontSize: 16,
    fontFamily: 'SFPraDisplay',
    fontWeight: '700',
    color: '#3b3838',
    marginBottom: 10,
  },
  state: {fontFamily: 'SFPraDisplay', fontSize: 14, color: '#99aabb'},
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 4,
  },
  redDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 4,
    backgroundColor: 'red',
  },
  orangeDot: {
    width: 14,
    height: 14,
  },
  stableText: {color: '#99aabb'},
  unconfiguredText: {color: '#faad14'},
  bottomContainer: {
    backgroundColor: '#eef3ff',
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  unstableText: {color: 'red'},
  textItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  textItem: {color: '#4373e0', fontSize: 13},
  statusIndicatorContainer: {flexDirection: 'row', alignItems: 'center'},
  textItemLeftContainer: {flexDirection: 'row', alignItems: 'center'},
  textIcon: {width: 14, height: 14, marginRight: 8},
});