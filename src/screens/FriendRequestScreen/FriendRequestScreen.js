import React from 'react';
import { 
  Text, 
  View, 
  Image, 
  ImageBackground,
  Pressable, 
  StyleSheet, 
  TextInput
} from 'react-native';
import CustomInput from '../../components/CustomInput/CustomInput';
import {useForm} from 'react-hook-form';
import CustomButton from '../../components/CustomButton/CustomButton';

const bgImages = {
    1: require('/Users/uyiag/MobileApplication/assets/red.avif'),
  };

const FriendRequestScreen = () => {

    const {control, handleSubmit, watch} = useForm();
    const Fname = watch('Friend');

    const OnSendPress = () => {
        navigation.navigate('ConfirmEmail');
      };


  return (
    <ImageBackground style={styles.imageWrap} source={bgImages[1]}>
    <View flex={1}>
      <Text style={styles.title}>Send a Friend Request!</Text>
    </View>
    <View flex={3}>
    <Text> Enter Username</Text>
    <CustomInput
        name="Friend"
          control={control}
          placeholder="Username"
    />
        <CustomButton
          text="Send"
          onPress={handleSubmit(OnSendPress)}
        />
    
   
    </View>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
    container: {
      // paddingHorizontal: 20,
      // paddingVertical: 40, 
      // marginHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'rgba(255, 255, 255, 0.8)',
      // borderRadius: 15,
      // elevation: 2
    }, 
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#051C60',
      margin: 10,
      top: 0
    },
  
    imageWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    diceContainer: {
      margin: 20,
      flexDirection: 'row', 
      justifyContent: 'space-evenly', 
    },
    diceImage: {
      marginHorizontal: 10,
      width: 125,
      height: 125
    },
    lite: {
      opacity: 0.95,
    },
    rollDiceBtnText: {
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderWidth: 2,
      borderRadius: 8,
      borderColor: '#E5E0FF',
      fontSize: 16,
      color: '#fff',
      fontWeight: '700',
      textTransform: 'uppercase',
      backgroundColor: '#333'
    },
    inputValue: {
      paddingVertical: 10,
      paddingHorizontal:40,
      color: '#fff',
      backgroundColor: '#0000FF',
      
  
    },
    image: {
      height:200,
      width:200,
    },
  });

export default FriendRequestScreen;