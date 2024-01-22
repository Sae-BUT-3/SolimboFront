import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import Search from "../screens/search/Search";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    
    const { user } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
        {user == null ? (
            <>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
            ) : (
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
        )}
        </Stack.Navigator>
    );
};

export default MainNavigator;