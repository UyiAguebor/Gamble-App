import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackNavigator, GameStackNavigator } from "./StackNavigator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={ ({
 
        headerShown:false,
        tabBarStyle:{
          backgroundColor:'#212121'
        }
          
        
      })}
    >
      <Tab.Screen
        name="Home2"
        component={StackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={'white'} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Games"
        component={GameStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Games',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="games" size={30} color="white" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;