import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import DiceGameScreen from '../screens/DiceGameScreen/DiceGameScreen';
import FriendRequestScreen from '../screens/FriendRequestScreen/FriendRequestScreen';
import GameScreen from '../screens/GameScreen/GameScreen';
import { createStackNavigator } from '@react-navigation/stack';
import CrashGameScreen from '../screens/CrashGameScreen/CrashGameScreen';
import BuyPointsScreen from '../screens/BuyPointsScreen/BuyPointsScreen';
import UserListScreen from '../screens/UserListScreen/UserListScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
const Stack = createStackNavigator();



const StackNavigator = () => {
    return (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
          <Stack.Screen name="Dice" component={DiceGameScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Add a Friend" component={FriendRequestScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Crash" component={CrashGameScreen} options={{headerShown:false}}/>
          <Stack.Screen name="BuyPointsScreen" component={BuyPointsScreen} options={{headerShown:false}}/>
          <Stack.Screen name="User" component={UserListScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}}/>

          
        </Stack.Navigator>
      );
    }

    const GameStackNavigator = () => {
        return (
          <Stack.Navigator>
            <Stack.Screen name="Choose a game!" component={GameScreen} options={{headerShown:false}}/>
          </Stack.Navigator>
        );
      } 

      const SocialStackNavigator = () => {
        return (
          <Stack.Navigator>
            <Stack.Screen name="Add a Friend" component={FriendRequestScreen} />
          </Stack.Navigator>
        );
      }

export {StackNavigator,GameStackNavigator,SocialStackNavigator};