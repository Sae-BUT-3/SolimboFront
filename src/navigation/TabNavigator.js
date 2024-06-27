import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/search/SearchScreen';
import { Colors } from '../style/color';
import { Pressable, Platform, Image, View, StyleSheet, Text } from 'react-native';
import ActivityScreen from '../screens/AcvityScreen';
import AddButtonScreen from '../screens/AddButtonScreen';
import ModalPostReview from '../components/ModalPostReview';
import GestureRecognizer from 'react-native-swipe-gestures';
import Toast, { BaseToast } from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import Tokenizer from '../utils/Tokenizer';
import { Avatar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const baseImageURL = "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg";
function CustomDrawerContent(props) {
  const [currentUser, setCurrentUser] = useState({});
  const { t } = useTranslation();
  useEffect(() => {
    const getCurrentUser = async () => {
      setCurrentUser(await Tokenizer.getCurrentUser());
    };
    getCurrentUser();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20, backgroundColor: Colors.Jet, alignItems: 'center' }}>
        <Image
          source={require('../assets/images/main_logo_v1_500x500.png')}
          style={{ width: 165, height: 165, marginBottom: 10, opacity: 0.3  }}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function TabNavigator() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setUser] = useState({});
  const navigation = useNavigation();

  const getData = async () => {
    setUser(await Tokenizer.getCurrentUser());
  };

  useEffect(() => {
    getData();
  }, []);

  const toastConfig = {
    success: (props) => (
      <BaseToast {...props} style={{ backgroundColor: Colors.Jet }} />
    ),
    error: (props) => (
      <BaseToast {...props} style={{ backgroundColor: Colors.Jet }} />
    ),
  };

  if (Platform.OS === 'web') {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          header: ({ navigation, route, options }) => {
          
            return (
              <View style={options.headerStyle}>
                  <FontAwesome name='navicon' size={30} onPress={() => navigation.toggleDrawer()} color={Colors.Onyx}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                          source={require('../assets/images/main_logo_no_bg.png')}
                          style={{ width: 45, height: 45, borderRadius: 5 }}
                      />
                      <Text style={styles.name}>SOLIMBO</Text>
                  </View>
                  <Text/>
            </View>)
          },
          headerStyle: { 
            backgroundColor: Colors.Jet,
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: Colors.Onyx,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
          },
          drawerStyle: {
            backgroundColor: Colors.Jet,
          },
          drawerActiveTintColor: Colors.SeaGreen,
          drawerInactiveTintColor: Colors.CalPolyGreen,
          drawerLabelStyle: {
            fontSize: 20,
            color: Colors.White,
          },
        }}
        initialRouteName="Home"
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t("common.home"),
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome5 name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: t("common.search"),
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome5 name="search" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="AddButton"
          component={AddButtonScreen}
          options={{
            title: t("comment.comment"),
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="plus" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            title: t("activity.title"),
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome5 name="bell" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: t("common.profile"),
            drawerIcon: ({ focused, color, size }) => (
              <Pressable onPress={() => {
                setPage(1);
                setReviews([]);
                navigation.navigate('Profile');
              }}>
                <Avatar.Image source={{ uri: currentUser?.photo || baseImageURL }} size={size} />
              </Pressable>
            ),
          }}
        />
      </Drawer.Navigator>
    );
  } else {
    return (
      <>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              backgroundColor: Colors.Jet,
              borderBlockColor: Colors.Jet,
            },
            tabBarActiveTintColor: Colors.SeaGreen,
            tabBarInactiveTintColor: Colors.CalPolyGreen,
            tabBarShowLabel: false,
          })}
          initialRouteName="Home"
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: t("common.maintitle"),
              tabBarIcon: ({ focused, color, size }) => (
                <FontAwesome5 name={focused ? 'home' : 'home'} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              title: t("solimbo.search"),
              tabBarIcon: ({ focused, color, size }) => (
                <FontAwesome5 name={focused ? 'search' : 'search'} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="AddButton"
            component={AddButtonScreen}
            options={{
              title: t("solimbo.comment"),
              tabBarIcon: ({ color, size }) => (
                <Pressable
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: Colors.SeaGreen,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <FontAwesome5 name="plus" size={24} color={Colors.Jet} />
                </Pressable>
              ),
            }}
          />
          <Tab.Screen
            name="Activity"
            component={ActivityScreen}
            options={{
              title: t("solimbo.useractivity"),
              tabBarIcon: ({ focused, color, size }) => (
                <FontAwesome5 name={focused ? 'bell' : 'bell'} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: t("solimbo.userprofile"),
              tabBarIcon: ({ focused, color, size }) => (
                <FontAwesome5 name={focused ? 'user' : 'user'} size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        <GestureRecognizer onSwipeDown={() => setModalVisible(false)}>
          <ModalPostReview visible={modalVisible} onClose={() => setModalVisible(false)} />
        </GestureRecognizer>
        <Toast config={toastConfig} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  name: {
      fontSize: Platform.OS === 'web' ? 30 : 20,
      color: Colors.Celadon,
      fontWeight: 'bold',
      marginBottom: 10,
      textTransform: 'uppercase',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
  },
});

export default TabNavigator;