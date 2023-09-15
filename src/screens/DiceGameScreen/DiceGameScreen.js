import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  RefreshControl,
} from 'react-native';
import CustomInput from '../../components/CustomInput/CustomInput';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { Auth, Amplify, graphqlOperation, API } from 'aws-amplify';
import awsmobile from '../../aws-exports';
import { getUserList, listUserLists } from '../../graphql/queries';
import { updateUserList } from '../../graphql/mutations';
import { ActivityIndicator } from 'react-native';
Amplify.configure(awsmobile);

const diceImages = {
  1: require('/Users/uyiag/MobileApplication/assets/1.png'),
  2: require('/Users/uyiag/MobileApplication/assets/2.png'),
  3: require('/Users/uyiag/MobileApplication/assets/3.png'),
  4: require('/Users/uyiag/MobileApplication/assets/4.png'),
  5: require('/Users/uyiag/MobileApplication/assets/5.png'),
  6: require('/Users/uyiag/MobileApplication/assets/6.png'),
};

const bgImages = {
  1: require('/Users/uyiag/MobileApplication/assets/purple.avif'),
  2: require('/Users/uyiag/MobileApplication/assets/2.jpg'),
  3: require('/Users/uyiag/MobileApplication/assets/3.jpg'),
};

export default function DiceGameScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUsername, setcurrentUsername] = useState('');
  const [currentUserPoints, setCurrentUserPoints] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const navigation = useNavigation();

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    fetchUserData(); 
    setIsRefreshing(false);
  };

  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setcurrentUsername(user.username);

      const userData = await API.graphql(graphqlOperation(listUserLists));
      const uList = userData.data.listUserLists.items;

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
  
  useEffect(() => {
    fetchUserData();
  }, []);



  const fetchUsername = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setcurrentUsername(user.username);
    } catch (error) {
      console.error('Error fetching username', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const userData = await API.graphql(graphqlOperation(listUserLists));
      const uList = userData.data.listUserLists.items;
      console.log('user list', uList);
      setUsers(uList);

      const currentUser = uList.find((user) => user.username === currentUsername);
      if (currentUser) {
        setCurrentUserPoints(currentUser.points);
        setCurrentUserId(currentUser.id);
      } else {
        console.log('User not found in the database.'); 
      }
      setIsDataLoaded(true); 
    } catch (error) {
      console.log('error on fetching user', error);
    }
  };

  const [firstDice, setFirstDice] = React.useState(2);
  const [bgImg, setBGImg] = React.useState(1);

  const randomNum = (min = 1, max = 6) => Math.floor(Math.random() * (max - min + 1)) + min;

  const getDiceNum = () => {
    let num = randomNum();
    return num;
  };

  function handleInputChange(text) {
    setTextInputValue(text);
  }

  const rollDiceOnTap = async () => {
    if (currentUserPoints === 0) {
      alert('You do not have enough points to roll the dice.Top up your balance by Purchasing points.');
      return;
    }
  
    const inputValue = parseInt(textInputValue);
  
    if (isNaN(inputValue) || inputValue < 1 || inputValue > 6) {
      alert('Please enter a valid number between 1 and 6.');
    } else {
      const newDiceValue = getDiceNum();
      setFirstDice(newDiceValue);
      setBGImg(1);
  
      try {
        await updatePointsAndDisplayAlert(newDiceValue, inputValue, currentUserId);
  
        await fetchUsers();
      } catch (error) {
        console.error('Error updating points and displaying alert:', error);
      }
    }
  
    setTextInputValue('');
  };

  const updatePointsAndDisplayAlert = async (newDiceValue, inputValue, userId) => {
    try {
      const updatedPoints = inputValue === newDiceValue ? currentUserPoints * 2 : currentUserPoints - 10;

      try {
        const input = { id: currentUserId, points: updatedPoints };
        await API.graphql(graphqlOperation(updateUserList, { input }));
        console.log('UserList updated');
      } catch (error) {
        console.error('Error updating UserList:', error);
      }

      if (inputValue === newDiceValue) {
        alert(`Congratulations! You guessed the correct number: ${newDiceValue}`);
      } else {
        alert(`Oops! Try again. The correct number was: ${newDiceValue}`);
      }

      setCurrentUserPoints(updatedPoints);
    } catch (error) {
      console.error('Error updating points:', error);
    }

    setTextInputValue('');
  };

  return (
    <ScrollView
    contentContainerStyle={styles.container2}
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
    {/* <View style={styles.container2}> */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>
          {isDataLoaded ? currentUserPoints : 'Loading...'}
        </Text>
        <Text style={styles.pointsLabelText}>Points</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.diceContainer}>
          <Image style={styles.diceImage} source={diceImages[firstDice]} />
        </View>
        <Pressable onPress={rollDiceOnTap}>
          <Text style={styles.rollDiceBtnText} selectable={false}>
            Roll the dice
          </Text>
        </Pressable>

        <TextInput
          style={styles.inputValue}
          onChangeText={handleInputChange}
          value={textInputValue}
          keyboardType="numeric"
          maxLength={1}
          placeholder="1-6"
          placeholderTextColor="white"
        />
      </View>
    {/* </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    elevation: 2,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
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
    paddingHorizontal: 40,
    color: 'white', 
    backgroundColor: 'grey', 
    borderRadius: 25, 
    fontSize: 16, 
  },
  pointsContainer: {
    position: "absolute",
    top: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  pointsLabelText: {
    fontSize: 14,
    color: "#777",
  },
});
   










