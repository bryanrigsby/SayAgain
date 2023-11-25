import { StyleSheet, Text, View, Pressable, SafeAreaView, useWindowDimensions, Modal, Linking, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import DropDownPicker from 'react-native-dropdown-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';



export default function HomeScreen({navigation}) {

    const microphonePermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
    const speechRecognitionPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.SPEECH_RECOGNITION : PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION;
    const cameraPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const [isMicrophonePermissionGranted, setIsMicrophonePermissionGranted] = useState(false);
    const [isSpeechRecognitionPermissionGranted, setIsSpeechRecognitionPermissionGranted] = useState(false);
    const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false);
    const [currentScreenOrientation, setCurrentScreenOrientation] = useState(null);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [language, setLanguage] = useState('')
    const [languages, setLanguages] = useState([
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
        {label: 'Spanish (Spain)',  value: 'es-ES'},
    ])
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    useEffect(() => {
      requestPermissions()
        const unsubscribe = navigation.addListener('focus', () => { setLanguage('') });
        checkOrientation();
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        return () => {
            ScreenOrientation.unlockAsync()
            unsubscribe;
        }
    },[])

    const requestPermissions = async () => {
      let microphonePermissionResult = await request(microphonePermission);
      if(microphonePermissionResult && microphonePermissionResult == RESULTS.GRANTED){
        setIsMicrophonePermissionGranted(true)
      }
      else{
        //alert that is required for app to function properly
        Alert.alert(
          'Microphone is required for app to function properly',
          '',
          [
            {
              text: 'Settings',
              onPress: () => {
                Linking.openSettings();
              }
            },
            {
              text: `Don't Allow`,
              onPress: () => {}
            }
          ]
        )
      }

      let speechRecognitionPermissionResult = await request(speechRecognitionPermission);
      if(speechRecognitionPermissionResult && speechRecognitionPermissionResult == RESULTS.GRANTED){
        setIsSpeechRecognitionPermissionGranted(true)
      }
      else{
        //alert that is required for app to function properly
        Alert.alert(
          'Speech Recognition is required for app to function properly',
          '',
          [
            {
              text: 'Settings',
              onPress: () => {
                Linking.openSettings();
              }
            },
            {
              text: `Don't Allow`,
              onPress: () => {}
            }
          ]
        )
      }

      let cameraPermissionResult = await request(cameraPermission);
      if(cameraPermissionResult && cameraPermissionResult == RESULTS.GRANTED){
        setIsCameraPermissionGranted(true)
      }
      else{
        Alert.alert(
          'Camera is not required but will provide a better experience',
          '',
          [
            {
              text: 'Settings',
              onPress: () => {
                Linking.openSettings();
              }
            },
            {
              text: `Don't Allow`,
              onPress: () => {}
            }
          ]
        )
      }
    }

    const checkPermissionsAndOpenLanguageModal = async () => {
      let micPerms = await check(microphonePermission);
      let speechPerms = await check(speechRecognitionPermission);
      if(micPerms && micPerms == RESULTS.GRANTED && speechPerms && speechPerms == RESULTS.GRANTED){
        setShowLanguageModal(true)
      }
      else{
        Alert.alert(
          'Microphone and Speech Recognition are required',
          '',
          [
            {
              text: 'Settings',
              onPress: () => {
                Linking.openSettings();
              }
            },
            {
              text: 'Deny Permission',
              onPress: () => {}
            }
          ]
        )
      }
    }

    const checkOrientation = async () => {
        const orientation = await ScreenOrientation.getOrientationAsync();
        setCurrentScreenOrientation(orientation);
      };

    const handleSetLanguageAndNavigate = (e) => {
        setShowLanguageModal(false);
        navigation.navigate('Camera', {language: e});
    }
     
  return (
    <SafeAreaView style={styles.container}>
        <Modal
          animationType='none'
          transparent={true}
          visible={showLanguageModal}
          onRequestClose={() => {
            setShowLanguageModal(false)
          }}
        >
        <View style={{marginTop: '100%', marginHorizontal: 30}}>
            <View style={{marginBottom: 20, width: '100%'}}>
                <DropDownPicker
                    textStyle={{fontSize: 20}}
                    open={isPickerOpen}
                    value={language}
                    items={languages}
                    setOpen={setIsPickerOpen}
                    setValue={setLanguage}
                    setItems={setLanguages}
                    onChangeValue={(e) => {
                        handleSetLanguageAndNavigate(e);
                    }}
                />
            </View>
          </View>
        
        </Modal>
        <View style={Platform.OS === 'android' ? [styles.titleContainer, {marginTop: 50}] : styles.titleContainer}>
            <Text style={[styles.text, styles.title]}>Say Again</Text>
        </View>
        <View style={!showLanguageModal ? styles.descriptionContainer : {display: 'none'}}>
            <Text style={[styles.text, styles.description]}>Live Closed Captions!</Text>
            <Text style={[styles.text, styles.disclaimer]}>[not a translation app]</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, {width: (screenWidth * 80)/100, height: (screenHeight * 8)/100}]} onPress={() => checkPermissionsAndOpenLanguageModal()}>
                <Text style={[styles.text, styles.buttonText]}>Choose Language</Text>
            </Pressable>
        </View>
    </SafeAreaView>
  )
  
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
        color: 'aliceblue',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: ''
    },
    titleContainer: {
        flex: 2,
        justifyContent: 'flex-start',
    },
    descriptionContainer: {
        flex: 2,
        justifyContent: 'center',
    },
    description: {
        fontSize: 30,
    },
    disclaimer: {
      textAlign: 'center',
      paddingTop: 10,
    },
    buttonContainer: {
      marginBottom: 10,
      flex: 2,
      justifyContent: 'flex-end',
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
    },

  });