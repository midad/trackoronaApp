/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import { Flex } from '@ant-design/react-native';

const Navbar: () => React$Node = () => {
  return (
    <Image
      source={require('../../../assets/img/trackorona.png')}
      style={styles.logo}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 136,
    height: 14,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 40,
    resizeMode: 'stretch',
  },
  logoText: {
    marginLeft: 5,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  highlighted: {
    color: 'white',
  },
});

export default Navbar;
