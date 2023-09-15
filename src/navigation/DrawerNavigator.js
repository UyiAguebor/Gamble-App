import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./TabGamesNavigator";
import UserListScreen from "../screens/UserListScreen/UserListScreen";
import CustomDrawerContent from "./CustomDrawerContent";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Home"
        component={BottomTabNavigator}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Current Users"
        component={UserListScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;