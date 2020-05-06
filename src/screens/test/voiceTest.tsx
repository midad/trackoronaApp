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
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';
import React, {Component, Fragment} from 'react';
import {Button, Flex, WhiteSpace} from '@ant-design/react-native';
import {mainBlue} from '../../../utils/globalStyles/colors';
import {secondaryFont} from '../../../utils/globalStyles/fonts';
import api from '../../../utils/api';

interface State {
  isLoggingIn: boolean;
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

const voiceTestSentences = [
  'سجل قولك حرف الألف الممدودة بنفس واحد ودون انقطاع على قدر تحملك : "آآآآآآآآآآآآآآآآآآآآآ...."',
  'قم بإحصاء الأرقام من 27 إلى 60 بنفس واحد ودون انقطاع',
  'اقرأ النص التالي بنفس واحد ودون انقطاع: "قلِّل من خطر إصابتك بالعدوى من خلال المواظبة على غسل اليدين بالماء والصابون أو فركهما بمُطهِّر كحولي، وتغطية الفم ....."',
];

class VoiceTest extends Component<any, State> {
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
      <>
        {voiceTestSentences.map((sentence, index) => (
          <View
            key={index}
            style={{
              padding: 10,
              borderRadius: 25,
              backgroundColor: mainBlue,
              marginBottom: 15,
            }}>
            <Text
              style={{
                textAlign: 'right',
                marginBottom: 5,
                fontFamily: secondaryFont,
                lineHeight: 20,
                color: 'white',
              }}>
              {sentence}
            </Text>
            <Flex justify="between">
              <Text style={{color: 'white'}}>{this.state.recordTime}</Text>
              <View style={{flexDirection: 'row'}}>
                <Button
                  type="warning"
                  style={{marginRight: 12}}
                  onPress={this.onStopRecord}>
                  <Text style={{fontSize: 14, fontFamily: secondaryFont}}>
                    وقف التسجيل
                  </Text>
                </Button>
                <Button onPress={this.onStartRecord}>
                  <Text style={{fontSize: 14, fontFamily: secondaryFont}}>
                    بداية التسجيل
                  </Text>
                </Button>
              </View>
            </Flex>
          </View>
        ))}
      </>
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

    const file = {
      uri: 'file://hello.mp4', // e.g. 'file:///path/to/file/image123.jpg'
      name: 'test001', // e.g. 'image123.jpg',
      type: 'audio/mp3', // e.g. 'image/jpg'
    };
    const formData = new FormData();
    formData.append('file', file);

    console.log({formData});
    const data = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(data);
    api
      .put(`/users/uploadVoice/${userData.user.id}`, formData)
      .then(res => console.log({res}));
    console.log(result);
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

export default VoiceTest;
