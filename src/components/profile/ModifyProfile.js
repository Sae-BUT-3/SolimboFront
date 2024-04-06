import React, {useState,useEffect} from 'react';
import {View, Text, Image, StyleSheet, useWindowDimensions, Platform,TouchableOpacity} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {Colors} from "../../style/color";
import {breakpoint} from "../../style/breakpoint";
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '../../api/axiosInstance';
import FormatImageURL from '../../utils/FormatImageURL';
function ModifyProfile({user, isCurrent, relation}) {
    const {height, width} = useWindowDimensions();
    const [isHovered, setIsHovered] = useState(false);
    const [image, setImage] = useState('');
    const [uri, setUri] = useState('');
    useEffect(() => {
        console.log(FormatImageURL(user?.photo))
        setUri(FormatImageURL(user?.photo) || "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg")
    
      }, [user]);
    const handleImagePickerPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        })
        if(!result.canceled){
            setImage(result.assets[0]);
            setUri(result.assets[0].uri);
            const formData = new FormData();
            var binaryImg = atob(result.assets[0].base64);
            // Convert binary to Blob
            var blob = new Blob([new Uint8Array(Array.prototype.map.call(binaryImg, function (c) {
                return c.charCodeAt(0)
            }))], { type: 'image/jpeg' });

            formData.append('photo', blob, 'image.jpeg'); // 'image' is the key where you'll access this image in your backend

            const headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteS1zdWIiLCJ2YWx1ZSI6NTMsImF1ZCI6InVybjphdWRpZW5jZTp0ZXN0IiwiaXNzIjoidXJuOmlzc3Vlcjp0ZXN0IiwiaWF0IjoxNzEyMDU2MDY3LCJleHAiOjMzMjM4MDk4NDY3fQ.vHJbKGiwfghh3RdDWRrVy50IdJ3_Yib-HbyRCEe4fL4'}`
            };
            await axiosInstance.post('/users/modify', formData,{headers});
        }
    }
    const getButtonText = () => {
        // if(relation.are)
    }
    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };
    const styles = StyleSheet.create({
        container : {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: Colors.Jet,
            opacity: 0.4
        },
        formContainer : {
            top:'50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            backgroundColor: Colors.Licorice,
            width: breakpoint.mobile,
            height: width> breakpoint.mobile ? '70%' :'100%',
            borderRadius: 10,
        },
        image: {
            width: 200,
            height: 200,
            borderRadius: "50%"
        }
    
    })

    return (
        
        <div style={styles.container}>
            
            <div style={styles.formContainer}>
                {uri && <Image style={styles.image} source={{uri: uri}} />}
                <TouchableOpacity onPress={handleImagePickerPress}>tdazdazdazdest</TouchableOpacity>
                <input></input>
                <textarea id="bio" name="bop" rows="5" cols="33">
                It was a dark and stormy night...
                </textarea>
            </div>
            <Text>Modify profile</Text>
        </div>
    );

    
}

export default ModifyProfile
