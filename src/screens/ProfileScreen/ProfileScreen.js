import { View, Text,ImageBackground,Image } from 'react-native'
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
const bgImages = {
    1: require('../../../assets/back2.png'),
  };

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (

    <ImageBackground source={require('../../../assets/back3.png')}
    style={{height:"100%",width:"100%"}}>
    <View style={{flexDirection:'row',marginTop:40,alignItems:'center',
    paddingHorizontal:40}}>
      <MaterialIcons name='menu' color='white' size={40} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
    </View>
    <View style={{
      width:'100%',
      marginTop:50,
      marginBottom:20,
      justifyContent:'center',
      alignItems:'center'}}>
      <View style={{
        width:100,
        height:80,
        borderRadius:50,
        backgroundColor:'#facdb',
        justifyContent: 'center',
        alignItems:'center'        
      }}>
      <MaterialIcons name='account-circle' color='white' size={80}/>
      <Text></Text>

      </View>
    </View>
    </ImageBackground>

  )
}

export default ProfileScreen