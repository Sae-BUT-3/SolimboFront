import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/search/SearchScreen';
import { Colors } from '../style/color';
import { TouchableOpacity } from 'react-native';
import ActivityScreen from '../screens/AcvityScreen';
import AddButtonScreen from '../screens/AddButtonScreen';
import ModalPostReview from '../components/ModalPostReview';
import GestureRecognizer from 'react-native-swipe-gestures';

const Tab = createBottomTabNavigator();

function TabNavigator() {
    const [modalVisible, setModalVisible] = useState(false);

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
            initialRouteName='Search'
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                    title: 'Solimbo - Réseau social de partage de musique',
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'home' : 'home'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Search" 
                component={SearchScreen} 
                options={{
                    title: 'Solimbo - Rechercher',
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'search' : 'search'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="AddButton" 
                component={AddButtonScreen}
                options={{
                    title: 'Solimbo - Commenter une oeuvre',
                    tabBarIcon: ({ color, size }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(true);
                            }}
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                backgroundColor: Colors.SeaGreen,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome5 name="plus" size={24} color={Colors.Jet} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen 
                name="Activity" 
                component={ActivityScreen} 
                options={{
                    title: 'Solimbo - Activité utilisateur ',
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'bell' : 'bell'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{
                    title: 'Solimbo - Profil utlisateur',
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'user' : 'user'} size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>

        <GestureRecognizer
        // style={{flex: 1}}
        // onSwipeUp={ () => setModalVisible(true) }
        onSwipeDown={ () => setModalVisible(false) }
        >
            <ModalPostReview visible={modalVisible} onClose={() => setModalVisible(false)} />
        </GestureRecognizer>

        </>
    );
}

export default TabNavigator;