import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Image } from 'react-native';
import { Button, Portal, Provider, Appbar } from 'react-native-paper';
import WebView from 'react-native-webview';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { updateUserList } from '../../graphql/mutations';
import { listUserLists } from '../../graphql/queries';

const BuyPointsScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserPoints, setCurrentUserPoints] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userData = await API.graphql(graphqlOperation(listUserLists));
      const uList = userData.data.listUserLists.items;

      setCurrentUsername(user.username);

      const currentUser = uList.find((user) => user.username === user.username);

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

  const handleResponse = async (data) => {
    if (data.title === 'success') {
      try {
        const userData = await API.graphql(graphqlOperation(listUserLists));
        const uList = userData.data.listUserLists.items;
        const currentUser = uList.find((user) => user.username === currentUsername);

        if (currentUser) {
          
          const newPoints = currentUser.points + 100;

          
          const input = {
            id: currentUser.id,
            points: newPoints,
          };

          
          const updatedUser = await API.graphql(graphqlOperation(updateUserList, { input }));

          console.log("User's points updated:", updatedUser);

          setShowModal(false);
          setStatus('Complete');
        } else {
          console.error('Current user data not available.');
        }
      } catch (error) {
        console.error("Error updating user's points:", error);
      }
    } else if (data.title === 'cancel') {
      setShowModal(false);
      setStatus('Cancelled');
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Buy Points" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <Portal>
          <Modal visible={showModal} onRequestClose={() => setShowModal(false)}>
            <WebView
              source={{ uri: 'http://192.168.0.19:3000' }}
              onNavigationStateChange={(data) => handleResponse(data)}
              injectedJavaScript={`document.f1.submit()`}
            />
          </Modal>
        </Portal>
        <Pressable
          onPress={() => setShowModal(true)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text style={styles.label}>100 Points</Text>
          <Image style={styles.image} source={require('../../../assets/coins3.jpg')} />
          <Text style={styles.label}>Purchase for £100</Text>
        </Pressable>
        <Button mode="contained" style={styles.payButton} onPress={() => setShowModal(true)}>
          Pay with Paypal
        </Button>
        <Text style={styles.paymentStatus}>Payment Status: {status}</Text>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  header: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: 'white', 
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  payButton: {
    width: 150,
    height: 40,
    alignSelf: 'center',
    marginVertical: 20,
  },
  paymentStatus: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
});

export default BuyPointsScreen;