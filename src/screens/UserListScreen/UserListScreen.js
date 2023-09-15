import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Auth, API, graphqlOperation, Amplify } from 'aws-amplify';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { listUserLists } from '../../graphql/queries';
import { updateUserList } from '../../graphql/mutations';
import { MaterialIcons } from '@expo/vector-icons';
import awsmobile from '../../aws-exports';

Amplify.configure(awsmobile);

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');

  const navigation = useNavigation();

  const handleTransferPoints = async (receiverUsername) => {
    if (!transferAmount || isNaN(transferAmount) || +transferAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to transfer.');
      return;
    }

    try {
      const senderUser = await API.graphql(
        graphqlOperation(listUserLists, { filter: { username: { eq: currentUsername } } })
      );

      if (!senderUser.data.listUserLists.items.length) {
        console.log('Sender user not found.');
        return;
      }

      const sender = senderUser.data.listUserLists.items[0];
      const amountToTransfer = +transferAmount;

      if (sender.points < amountToTransfer) {
        console.log('Insufficient Points');
        Alert.alert('Insufficient Points', 'You do not have enough points to transfer.');
        return;
      }

      const receiverUser = await API.graphql(
        graphqlOperation(listUserLists, { filter: { username: { eq: receiverUsername } } })
      );

      if (!receiverUser.data.listUserLists.items.length) {
        console.log('Receiver user not found.');
        return;
      }

      const receiver = receiverUser.data.listUserLists.items[0];


      const updatedSender = {
        id: sender.id, 
        points: sender.points - amountToTransfer,
      };

      const updatedReceiver = {
        id: receiver.id,
        points: receiver.points + amountToTransfer,
      };

      await API.graphql(graphqlOperation(updateUserList, { input: updatedSender }));
      await API.graphql(graphqlOperation(updateUserList, { input: updatedReceiver }));

      setTransferAmount('');

      console.log('Points transferred successfully');
    } catch (error) {
      console.log('Error transferring points', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await API.graphql(graphqlOperation(listUserLists));
        const uList = userData.data.listUserLists.items;

        const user = await Auth.currentAuthenticatedUser();
        setCurrentUsername(user.username);
        setCurrentUserPoints(user.points);

        const currentUser = uList.find((u) => u.username === user.username);
        if (currentUser) {
          setCurrentUserPoints(currentUser.points);
          setCurrentUserId(currentUser.id);
        } else {
          console.log('User not found in the database.');
        }

        const filteredUsers = uList.filter((u) => u.username !== currentUsername);

        setUsers(filteredUsers);
        setIsDataLoaded(true);
      } catch (error) {
        console.log('error on fetching user', error);
      }
    };

    fetchUsers();
  }, [currentUsername]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>
          Username: {item.username} 
        </Text>
        {/* <Text style={styles.userInfoText}>
        Points: {item.points}
        </Text> */}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleTransferPoints(item.username)}>
          <Text style={styles.transferButton}>Transfer Points</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleProfilePress = () => {
    navigation.navigate('Profile'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginLeft: 20,marginTop:30 }} 
        >
          <MaterialIcons name="menu" size={40} color="#212121" />
        </TouchableOpacity>
        <View style={styles.accountInfo}>
          <View style={styles.userData}>
            <Text style={{ color: 'black' }}>{currentUserPoints}</Text>
          </View>
          <View style={styles.circle}>
            <MaterialIcons name="account-circle" size={40} color="#212121" onPress={handleProfilePress} />
          </View>
        </View>
      </View>

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={currentUserId}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={transferAmount}
          onChangeText={(text) => setTransferAmount(text)}
          keyboardType="numeric"
          placeholderTextColor="white"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: '#ECEFF1', 
    paddingHorizontal: 20, 
    width: '100%', 
    height: 90, 
  },

  userData: {
    flexDirection: 'column',
    marginTop:30 
  },

  menuIconContainer: {
    marginRight: 20,
  },

  accountInfo: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  circle: {
    marginRight: 20, 
    marginTop:30
  },
  balanceIcon: {
    marginLeft: 230,
  },
  balanceText: {
    color: 'white',
  },
  itemContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  userInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferButton: {
    color: 'white',
    padding: 10,
    borderRadius: 20,
  },
  inputContainer: {
    alignItems: 'center',
    padding: 20,
  },
  input: {
    backgroundColor: 'grey',
    width: 150,
    padding: 5,
    borderRadius: 25,
    textAlign: 'center',
    color: 'black',
  },
});

export default UserListScreen;