import React, { useState } from "react";
import { View, Image, StyleSheet, Text, Modal, TouchableOpacity, ScrollView,Button } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

const GameScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showDiceInfo, setShowDiceInfo] = useState(false);
  const [showCrashInfo, setShowCrashInfo] = useState(false);

  const onDicePress = () => {
    navigation.navigate('Dice');
  };

  const onCrashPress = () => {
    navigation.navigate('Crash');
  };

  const toggleDiceInfo = () => {
    setShowDiceInfo(!showDiceInfo);
  };

  const toggleCrashInfo = () => {
    setShowCrashInfo(!showCrashInfo);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.encouragement}>Select a game:</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={handleSubmit(onDicePress)}
          style={styles.gameButton}
        >
          <Image
            style={styles.image}
            source={require("../../../assets/dice1.png")}
          />
          <Text style={styles.label}>Dice Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDiceInfo} style={styles.infoButton}>
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={handleSubmit(onCrashPress)}
          style={styles.gameButton}
        >
          <Image
            style={styles.image}
            source={require("../../../assets/crash3.jpg")}
          />
          <Text style={styles.label}>Crash Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCrashInfo} style={styles.infoButton}>
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
      </View>


      <Modal
        visible={showDiceInfo}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Dice Game Explanation:</Text>
          <Text>Welcome to the Dice Roll Challenge! Your goal is to predict the outcome of a roll of a standard six-sided die, guessing numbers from 1 to 6. Be strategic, as odds vary with your choice of specific numbers or number ranges. If you win your points are doubled if you lose 10 points are subtracted from your account.Remember that this game is all about testing your luck and having fun!</Text>
          <Button title="Close" onPress={toggleDiceInfo} />
        </View>
      </Modal>

      <Modal
        visible={showCrashInfo}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Crash Game Explanation:</Text>
          <Text>
           The Crash Game is an exciting gambling experience where you can test your luck and strategy. Here's how it works: You start by placing a bet and watching as a multiplier increases rapidly. The goal is to cash out your bet at just the right moment before the game crashes. If you cash out in time, you'll win points based on the current multiplier. However, if you wait too long, and the game crashes before you cash out, you'll lose your bet. It's all about timing and risk-taking. Are you ready to play and see if fortune favors you? Good luck!</Text>
          <Button title="Close" onPress={toggleCrashInfo} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#212121',
    alignItems: "center",
    justifyContent: "center", 
    paddingBottom: 20,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 20,
  },
  separator: {
    height: 60,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  encouragement: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20, 
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gameButton: {
    flex: 1,
    alignItems: "center",
  },
  infoButton: {
    backgroundColor: "gray",
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    left:-60,
    bottom:15
  },
  infoButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default GameScreen;