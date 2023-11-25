import { StyleSheet, Text, View, Button, Pressable, SafeAreaView, useWindowDimensions, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

const languageTitle = [
  {label: 'Select a language', value: ''},
  {label: 'Arabic',  value: 'ar-SA'},
  {label: 'Chinese (Mandarin)',  value: 'cmn-Hans-CN'},
  {label: 'English (Australia)',  value: 'en-AU'},
  {label: 'English (Canada)',  value: 'en-CA'},
  {label: 'English (UK)',  value: 'en-GB'},
  {label: 'English (US)',  value: 'en-US'},
  {label: 'French (Canada)',  value: 'fr-CA'},
  {label: 'French (France)',  value: 'fr-FR'},
  {label: 'German',  value: 'de-DE'},
  {label: 'Hindi',  value: 'hi-IN'},
  {label: 'Italian',  value: 'it-IT'},
  {label: 'Japanese',  value: 'ja-JP'},
  {label: 'Korean',  value: 'ko-KR'},
  {label: 'Portuguese (Brazil)',  value: 'pt-BR'},
  {label: 'Portuguese (Portugal)',  value: 'pt-PT'},
  {label: 'Russian',  value: 'ru-RU'},
  {label: 'Spanish (Latin America)',  value: 'es-MX'},
  {label: 'Spanish (Spain)',  value: 'es-ES'}
]

export default function CameraScreen({route, navigation}) {

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { language } = route.params;
  const options = { EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000}; // Adjust the value as needed 

  const [partialResults, setPartialResults] = useState(['Listening...']);
  
  //if camera permission is denied will just have black screen. this is ok.
  const [permission, requestPermission] = Camera.useCameraPermissions();


  const [currentScreenOrientation, setCurrentScreenOrientation] = useState(null);
  
  useEffect(() => {
    ScreenOrientation.unlockAsync()
    checkOrientation();
    const orientationSubsciption = ScreenOrientation.addOrientationChangeListener(handleOrientationChange)
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    startSpeechToText()
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      ScreenOrientation.removeOrientationChangeListeners(orientationSubsciption);
    }
  }, [])
  
  const checkOrientation = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    setCurrentScreenOrientation(orientation);
  };

  const handleOrientationChange = (o) => {
    setCurrentScreenOrientation(o.orientationInfo.orientation);
  };

  const startSpeechToText = async () => {
    await Voice.start(language, options);
  }

  const stopSpeechToText = async () => {
    await Voice.stop();
  }

  const onSpeechPartialResults = (partial) => {
    setPartialResults(partial.value);
  };  

  const onSpeechError = (error) => {
    console.log(error);
  }

  const handlePageExit = async () => {
    await stopSpeechToText()
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    navigation.goBack()
  }

  const getResults = () => {
    let results = partialResults.join(' ');
    if(results && results.length > 0){
      if(currentScreenOrientation === ScreenOrientation.Orientation.PORTRAIT_UP || currentScreenOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN){
        if(results.length >= 30){
          results = results.slice(-29);
        }
      }
      else{
        if(results.length >= 70){
          results = results.slice(-69);
        }
      }
    }
    return results;
  }

  return (
    <SafeAreaView style={styles.container}>
        <Camera style={styles.camera}>
            {currentScreenOrientation === ''}
            <View style={Platform.OS === 'android' ? [styles.titleContainer, {marginTop: 20, fontFamily:"Roboto"}] : styles.titleContainer}>
                <Text style={[styles.text, styles.title]}>Say Again</Text>
                <Text style={[styles.text, styles.languageText]}>[ {languageTitle.find(f => f.value === language).label} ]</Text>
            </View>

            <View style={styles.resultContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.text, styles.resultText, {width: (screenWidth * 80)/100}]}>
                {getResults()}
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={currentScreenOrientation === ScreenOrientation.Orientation.PORTRAIT_UP || currentScreenOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN ? [styles.button, {width: (screenWidth * 80)/100, height: (screenHeight * 8)/100}] : [styles.button, {width: (screenWidth * 20)/100, height: (screenHeight * 15)/100}]} onPress={() => handlePageExit()}>
                    <Text style={[styles.text, styles.buttonText]}>Back</Text>
                </Pressable>
            </View>
        </Camera>
    </SafeAreaView>

    
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000'
    },
    camera: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
        color: 'aliceblue',
    },
    titleContainer: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: ''
    },
    languageText: {
        marginTop: 10
    },
    resultContainer: {
        flex: 4,
        justifyContent: 'flex-end',
    },
    resultText: {
        fontSize: 25
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 10,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    button: {
        borderWidth: 3,
        borderColor: 'aliceblue',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'aliceblue'
    }
  });