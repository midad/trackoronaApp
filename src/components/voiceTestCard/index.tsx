import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import React, {Component} from 'react';
import {Button} from '@ant-design/react-native';
import {mainBlue} from '../../../utils/globalStyles/colors';
import {secondaryFont, primaryFont} from '../../../utils/globalStyles/fonts';

interface State {
  isLoggingIn: boolean;
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

class VoiceTestCard extends Component<any, State> {
  private audioRecorderPlayer: AudioRecorderPlayer;

  constructor(props: any) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  public render() {
    return (
      <View
        style={{
          padding: 20,
          borderRadius: 25,
          backgroundColor: 'white',
          marginBottom: 40,
        }}>
        <Text
          style={{
            textAlign: 'right',
            marginBottom: 5,
            fontFamily: secondaryFont,
            lineHeight: 20,
          }}>
          {this.props.testText}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 20,
          }}>
          <Button
            type="warning"
            style={{marginRight: 12}}
            onPress={this.onStopRecord}>
            <Text style={{fontSize: 14, fontFamily: secondaryFont}}>
              وقف التسجيل
            </Text>
          </Button>
          <Button type="primary" onPress={this.onStartRecord}>
            <Text style={{fontSize: 14, fontFamily: secondaryFont}}>
              بداية التسجيل
            </Text>
          </Button>
        </View>
        <Text style={{textAlign: 'center'}}>{this.state.recordTime}</Text>
      </View>
    );
  }

  private onStatusPress = (e: any) => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);
    const playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (320 - 56);
    console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(this.state.currentPositionSec);
    console.log(`currentPosition: ${currentPosition}`);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      this.audioRecorderPlayer.seekToPlayer(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      this.audioRecorderPlayer.seekToPlayer(subSecs);
      console.log(`subSecs: ${subSecs}`);
    }
  };

  private onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    console.log('audioSet', audioSet);
    const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);
    this.audioRecorderPlayer.addRecordBackListener((e: any) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
    });
    console.log(`uri: ${uri}`);
  };

  private onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
    // const uriParts = 'file://sdcard/hello.mp4'.split('.');
    // const fileType = uriParts[uriParts.length - 1];

    // const formData: any = new FormData();
    // const audioFile: any = {
    //   uri: 'file:///sdcard/hello.mp4',
    //   name: `audio.${fileType}`,
    //   type: `audio/x-${fileType}`,
    // };
    // formData.append('file', audioFile);
    try {
      const data = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(data);
      //   const file = {
      //     uri: result, // e.g. 'file://sdcard/hello.mp4'
      //     name: 'hello.mp4', // e.g. 'image123.jpg',
      //     type: 'audio/mp4', // e.g. 'image/jpg'
      //   };
      //   const formData = new FormData();
      //   formData.append('file', file);
      var RNFS = require('react-native-fs');

      // create a path you want to write to
      // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
      // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
      var path = RNFS.DocumentDirectoryPath + '/test.txt';

      // write the file
      RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
        .then(success => {
          console.log(
            'FILE WRITTEN!',
            RNFS.DocumentDirectoryPath + '/test.txt',
          );
          var files = [
            {
              name: 'test',
              filename: 'test.txt',
              filepath: RNFS.DocumentDirectoryPath + '/test.txt',
              filetype: 'audio/x-m4a',
            },
          ];

          var uploadBegin = response => {
            var jobId = response.jobId;
            console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
          };

          var uploadProgress = response => {
            var percentage = Math.floor(
              (response.totalBytesSent / response.totalBytesExpectedToSend) *
                100,
            );
            console.log('UPLOAD IS ' + percentage + '% DONE!');
          };

          RNFS.uploadFiles({
            toUrl: `http://192.168.1.2:9000/users/uploadVoice/${
              userData.user.id
            }?access_token=${userData.token}`,
            files: files,
            method: 'POST',
            headers: {
              Accept: 'application/json',
            },
            fields: {
              hello: 'world',
            },
            begin: uploadBegin,
            progress: uploadProgress,
          })
            .promise.then(response => {
              if (response.statusCode == 200) {
                console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
              } else {
                console.log('SERVER ERROR');
              }
            })
            .catch(err => {
              if (err.description === 'cancelled') {
                // cancelled by user
              }
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err.message);
        });

      //   console.log({file, formData});
      //   const data = await AsyncStorage.getItem('userData');
      //   const userData = JSON.parse(data);
      //   api
      //     .upload(
      //       `/users/uploadVoice/${userData.user.id}?access_token=${
      //         userData.token
      //       }`,
      //       formData,
      //     )
      //     .then(res => console.log({res}));
    } catch (error) {
      console.log({error});
    }
  };

  private onStartPlay = async () => {
    console.log('onStartPlay');
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener((e: any) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
  };

  private onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  private onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
}

export default VoiceTestCard;

const styles = StyleSheet.create({
  container: {
    paddingTop: '7%',
    paddingBottom: 45,
    paddingHorizontal: '9%',
    direction: 'rtl',
    flex: 1,
    backgroundColor: mainBlue,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'right',
    fontFamily: secondaryFont,
    lineHeight: 20,
  },
  cardNumber: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FF6E3F',
    backgroundColor: '#FFE9E2',
    borderRadius: 15,
    marginTop: 15,
  },
  cardNumberConfinement: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FF6E3F',
    backgroundColor: '#FFE9E2',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#ff6e3f',
    marginTop: 15,
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
  },
  bigCard: {
    height: 360,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
  },
  smallCard: {
    height: 150,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  mapContainer: {
    // ...StyleSheet.absoluteFillObject,
    height: 400,
    width: '100%',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  error: {
    fontFamily: secondaryFont,
    fontSize: 16,
    color: 'red',
  },
});
