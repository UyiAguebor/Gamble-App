import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Auth, API,graphqlOperation } from 'aws-amplify';
import { getUserList, listUserLists } from '../../graphql/queries';
import { updateUserList } from '../../graphql/mutations';


const CrashGameScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [betInput, setBetInput] = useState('');
  const [timerId, setTimerId] = useState(null);
  const [currentUsername, setcurrentUsername] = useState("");
  const [currentUserPoints, setCurrentUserPoints] = useState(null);
  const [currentUserId,setCurrentUserId]= useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUserData(); 
    setIsRefreshing(false);
  };
 
  useEffect(() => {
    if (!isPlaying) {
      clearInterval(timerId);
    }
  }, [isPlaying]); 

  const gameCrash = async (betAmount, crashMultiplier) => {
    setIsPlaying(false);
    clearInterval(timerId);
  
    try {
      const updatedPoints = currentUserPoints - betAmount; 
      await API.graphql(
        graphqlOperation(updateUserList, {
          input: { id: currentUserId, points: updatedPoints },
        })
      );
  
      setCurrentUserPoints(updatedPoints);
      console.log(`User points updated: ${currentUserPoints} -> ${updatedPoints}`);
  
      alert(`Game crashed at ${crashMultiplier.toFixed(2)}x. You lost ${betAmount} points.`);
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };

  const startGame = () => {
    const betAmount = parseFloat(betInput);
  
    
    if (isNaN(betAmount) || betAmount <= 0) {
      alert('Please enter a valid bet amount.');
      return;
    }
  
    
    if (currentUserPoints <= 0 || betAmount > currentUserPoints) {
      alert('You do not have enough points to place this bet.Top up your balance by Purchasing points.');
      return;
    }
  
    setIsPlaying(true);
  
    let currentMultiplier = 1.0; 
    const id = setInterval(() => {
      currentMultiplier += 0.03; // big = fast
  
      const crashChance = calculateCrashChance(currentMultiplier);
      setMultiplier(currentMultiplier); 
      if (Math.random() < crashChance) {
        clearInterval(id);
        gameCrash(betAmount, currentMultiplier); 
      }
    }, 100); 
  
    setTimerId(id);
  };

  const calculateCrashChance = (currentMultiplier) => {
    return Math.min(0.5, currentMultiplier / 50);
  };

  const cashOut = async () => {
    setIsPlaying(false);
    clearInterval(timerId);
  
    const payout = parseFloat(betInput) * multiplier;
    const newPoints = currentUserPoints + payout;
  
    try {
      const updatedPoints = parseInt(newPoints); 
      await API.graphql(
        graphqlOperation(updateUserList, {
          input: { id: currentUserId, points: updatedPoints },
        })
      ); 
  
      setCurrentUserPoints(updatedPoints);
      console.log(`User points updated: ${currentUserPoints} -> ${updatedPoints}`);
  
      alert(`You cashed out at ${multiplier.toFixed(2)}x. You won ${payout.toFixed(2)} points!`);
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };
 
  useEffect(() => {
    fetchUserData();
  }, []);



  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userData = await API.graphql(graphqlOperation(listUserLists));
      const uList = userData.data.listUserLists.items;

      setcurrentUsername(user.username);

      const currentUser = uList.find((user) => user.username === currentUsername);

      if (currentUser) {
        setCurrentUserPoints(currentUser.points);
        setCurrentUserId(currentUser.id);
      } else {
        console.log('User not found in the database.');
      }

      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };



  if (!isDataLoaded) {
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }


  return (
    <ScrollView
    contentContainerStyle={styles.container}
    refreshControl={
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        tintColor="#000" 
        title="Refreshing..." 
        titleColor="#000" 
      />
    }
  >
    {/* <View style={styles.container}> */}
      <View style={styles.crashContainer}>
        <Text style={styles.crashTitle}>CRASH!!</Text>
      </View>
      <Text style={styles.pointsText}>Points: {currentUserPoints}</Text>
      <Text style={styles.multiplierText}>Multiplier: {multiplier.toFixed(2)}x</Text>
      {isPlaying ? (
        <View>
          <Text style={{ color: 'white' }}>Bet Placed: {betInput}</Text>
          <TouchableOpacity onPress={cashOut} style={styles.button}>
            <Text>Cash Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your bet"
            value={betInput}
            onChangeText={(text) => setBetInput(text)}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={startGame} style={styles.button}>
            <Text>Start Game</Text>
          </TouchableOpacity>
        </View>
      )}
    {/* </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#212121'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  crashContainer: {
    backgroundColor: 'red',
    borderRadius: 100,
    padding: 20,
    marginBottom: 20,
  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    marginTop:16
  },
  multiplierText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 200,
    backgroundColor: 'lightgrey',
  },
  button: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  betText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  multiplierText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  refreshButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
});

export default CrashGameScreen;