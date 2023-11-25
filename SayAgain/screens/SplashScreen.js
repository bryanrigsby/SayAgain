import { StyleSheet, Image, View } from 'react-native'
import React, {useEffect} from 'react'
import splash from '../assets/splash.png'
import {timeout } from '../util/utils'

const SplashScreen = ({navigation}) => {

  useEffect(() => {
    const loader = async () => {
        await timeout(1000)
        navigation.navigate("Home")
      }
  
      loader() 

  }, [])
    

  return (
    <View style={styles.container}>
      <Image
        source={splash}
        style={{flex: 1, justifyContent: 'center', width: '80%'}}
      >
      </Image>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    }
})