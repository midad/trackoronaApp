import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class App extends Component {
  constructor(props) {
    super(props);

    const dataSource = new FlatList.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.devices = [];
    this.state = {
      dataSource: dataSource.cloneWithRows(this.devices),
    };
  }

  componentDidMount() {
    console.log('bluetooth scanner mounted');

    NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', data => {
      let device = 'device found: ' + data.name + '(' + data.id + ')';

      if (this.devices.indexOf(device) == -1) {
        this.devices.push(device);
      }

      let newState = this.state;
      newState.dataSource = newState.dataSource.cloneWithRows(this.devices);
      this.setState(newState);
    });

    BleManager.start({showAlert: false}).then(() => {
      // Success code
      console.log('Module initialized');
    });
  }

  startScanning() {
    console.log('start scanning');
    BleManager.scan([], 120);
  }

  render() {
    return (
      <View style={{padding: 50}}>
        <Text>Bluetooth scanner</Text>
        <Button onPress={() => this.startScanning()} title="Start scanning" />

        <FlatList
          dataSource={this.state.dataSource}
          renderRow={rowData => <Text>{rowData}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10,
  },
});
