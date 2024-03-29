import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/search/SearchScreen';
import { Colors } from '../style/color';
import { TouchableOpacity } from 'react-native';
import ActivityScreen from '../screens/AcvityScreen';
import AddButtonScreen from '../screens/AddButtonScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
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
                name="Search" 
                component={SearchScreen} 
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'search' : 'search'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'home' : 'home'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="AddButton" 
                component={AddButtonScreen}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                        e.preventDefault(); // Empêche le changement de route par défaut
                        // Ajoutez ici votre logique pour le bouton central
                    },
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <TouchableOpacity
                            onPress={() => {
                                // Ajoutez ici votre logique pour le bouton central
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
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'bell' : 'bell'} size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name={focused ? 'user' : 'user'} size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default TabNavigator;