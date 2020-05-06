/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {Platform, StyleSheet, Text, View, Image} from 'react-native';

const Header: () => React$Node = () => {
  return (
    <>
      <Image
        source={require('../../../assets/img/trackorona.png')}
        style={styles.logo}
      />
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 198,
    height: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    color: '#1D3DC8',
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  highlighted: {
    color: '#EE4D5B',
  },
});

export default Header;
