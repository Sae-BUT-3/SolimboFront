import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
            // initialRouteName='Home'
            // backBehavior='initialRoute'
        >
            <Tab.Screen 
                name="Search" 
                component={SearchScreen}
                options={{
                    tapBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default TabNavigator;