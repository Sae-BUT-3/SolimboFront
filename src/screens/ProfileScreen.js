import React, {useEffect, useState} from 'react';
import { Button, View, Text,Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import commonStyles from '../style/commonStyle';
import axiosInstance from '../api/axiosInstance';
import Profile from "../components/profile/Profile";
import ModifyProfile from "../components/profile/ModifyProfile";
import {breakpoint} from "../style/breakpoint";
import { StyleSheet,useWindowDimensions } from 'react-native';
function ProfileScreen() {
    const [data, setData] = useState([]);
    const { width } = useWindowDimensions();
    const { logout } = useAuth();
    const style = StyleSheet.create({
        container: {
            paddingTop: 30,
            paddingHorizontal: 10
        },
        subcontainer: {
            width: width> breakpoint.medium ? 1200 : "100%",
        }
    })
    useEffect(() => {
        const query = {
            page: 1,
            pageSize: 3,
            orderByLike: true,
        };
        const headers = {
            'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteS1zdWIiLCJ2YWx1ZSI6NTMsImF1ZCI6InVybjphdWRpZW5jZTp0ZXN0IiwiaXNzIjoidXJuOmlzc3Vlcjp0ZXN0IiwiaWF0IjoxNzEyMDU2MDY3LCJleHAiOjMzMjM4MDk4NDY3fQ.vHJbKGiwfghh3RdDWRrVy50IdJ3_Yib-HbyRCEe4fL4'}`
        };
        const queryString = new URLSearchParams(query).toString();
        axiosInstance.get(`/users/53/page?${queryString}`, {headers}).then(response => {
            console.log(response.data)
            setData(response.data)
        }).catch(error => {
            console.log("merde")
        })
    }, [])
    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer,style.container ]}>
            <View style={[style.subcontainer]}>
                <Profile user={data.user} isCurrent={data.isCurrent} relation={data.relation}></Profile>
            </View>
            <ModifyProfile user={data.user}></ModifyProfile>
        </SafeAreaView>
    )
}

export default ProfileScreen;