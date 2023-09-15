import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { Auth, API, graphqlOperation, Amplify } from 'aws-amplify';
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import UserListScreen from "../screens/UserListScreen/UserListScreen";

const CustomDrawerContent = (props) => {
    const signOut = async () => {
        try {
          await Auth.signOut();
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>

      <View style={styles.header}>
  
      </View>


      <DrawerItem
        label="Home"
        onPress={() => {
          props.navigation.navigate('Home');
        }}
      />
      <DrawerItem
        label="Current Users"
        onPress={() => {
          props.navigation.navigate('Current Users');
        }}
      />

      {/* Add the sign-out button */}
      <DrawerItem
        label="Sign Out"
        onPress={signOut}
      />
    </DrawerContentScrollView>
  );
};


const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "grey", // Background color of the drawer
  },
  header: {
    // Add styles for your custom header or logo
  },
  drawerItemText: {
    color: "white", // Text color of the drawer items
  },
});

export default CustomDrawerContent;