import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,RefreshControl,ScrollView } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Auth, API, graphqlOperation, Amplify } from 'aws-amplify';
import awsmobile from '../../aws-exports';
import { listUserLists } from '../../graphql/queries';
import { createUserList } from '../../graphql/mutations';
import { MaterialIcons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { views1 } from './UpcomingView';
Amplify.configure(awsmobile);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserPoints, setCurrentUserPoints] = useState(null);
  const defaultPoints = 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUserData(); 
    setIsRefreshing(false);
  };
 
  const renderItem1 = ({ item }) => {
    return (
      <View style={styles.renderItem1_parentView}>
        <Image source={{ uri: item.imgUrl }} style={styles.renderItem1_img} />
        <View style={styles.renderItem1_view2}>
          <Text style={styles.renderItem1_text2}>{item.title}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCurrentUsername(user.username);
      fetchUserPoints(user.username);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };
  

  const fetchUserPoints = async (username) => {
    try {
      const userData = await API.graphql(graphqlOperation(listUserLists));
      const uList = userData.data.listUserLists.items;
      const currentUser = uList.find((user) => user.username === username);
  
      if (currentUser) {
        setCurrentUserPoints(currentUser.points);
      } else {
        await createUser(username, defaultPoints);
        setCurrentUserPoints(defaultPoints);
      }
    } catch (error) {
      console.log('Error fetching user data', error);
    }
  }; 

  const createUser = async (username, points) => {
    const input = {
      username: username,
      points: points,
    };
  
    try {
      const response = await API.graphql(graphqlOperation(createUserList, { input }));
      console.log('UserList created:', response.data.createUserList);
      setCurrentUserPoints(points); 
    } catch (error) {
      console.error('Error creating UserList:', error);
    }
  };

  const handleBuyPoints = () => {
    navigation.navigate('BuyPointsScreen'); 
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile'); 
  };
 
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
      <Text style={styles.comingText2}>Welcome {currentUsername}!</Text>

      <View style={styles.carouselContainer}>
        <Text style={styles.comingText}>Coming Soon!</Text>
        <Carousel
          layout={'default'}
          data={views1}
          renderItem={renderItem1}
          sliderWidth={300}
          itemWidth={300}
          loop={true}
          autoplay={true}
        />
      </View>

      <View style={styles.middleContent}>
        <Text style={styles.comingText}>Low on Points!?</Text>
        <TouchableOpacity style={styles.btn} onPress={handleBuyPoints}>
          <Text style={styles.detail}>Buy Points</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.adviceContainer}>
        <Text style={styles.adviceText}>
          Gambling Advice: Enjoy your time on this platform responsibly. Gambling can be exciting and entertaining,
          but it's important to set limits on your spending and time spent gambling. Only wager what you can afford
          to lose and avoid chasing losses. If you find that gambling is causing any negative impacts on your life,
          consider seeking help and support. Remember, the goal is to have fun and stay in control of your choices.
        </Text>
      </View>
    {/* </View> */}
    </ScrollView>
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
  userInfo: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    marginRight: 20, 
    marginTop:30
  },
  userData: {
    flexDirection: 'column',
    marginTop:30 
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  carouselImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  carouselTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  middleContent: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -500, 
  },
  btn: {
    backgroundColor: 'orange',
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 30,
  },
  detail: {
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  adviceContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 0.0001,
    borderRadius: 5,
  },
  adviceText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  renderItem1_parentView: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    height: 200,
    width: 300,
    justifyContent: "space-around",
    alignItems: "center",
    overflow: "hidden",
 },
 renderItem1_view1: {
    width: 80,
    position: "absolute",
    fontSize: 20,
    top: 10,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    alignItems: "center",
 },
 renderItem1_view2: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-around",
 },
 renderItem1_img: {
    width: 350,
    height: 250,
 },
 renderItem1_text1: {
    fontWeight: "700",
    color: "#000000",
 },
 renderItem1_text2: {
    marginVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
 },
 renderItem1_text3: {
    marginVertical: 12,
    color: "blue",
    fontWeight: "bold",
 },
 comingText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  marginTop: -60, 
},
comingText2: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  paddingBottom:-50,
  marginTop:40
},
});  

export default HomeScreen;