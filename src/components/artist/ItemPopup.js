import React, {useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Image} from 'react-native';
import { Colors } from '../../style/color';
import PointTrait from '../common/PointTrait';
import {useNavigation} from '@react-navigation/native'

const toCapitalCase = (mot) => {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

const ItemPopup = ({data}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigation = useNavigation();

    const handlePress = (_id, type) => {
        if(_id && type){
            switch(type){
                case 'single':
                case 'album':
                case 'compliation':
                    navigation.navigate('Oeuvre', {type: 'album', id : data.id });
                    break;
            }
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Pressable
            onPress={() => handlePress(data.id, data.type)}
            activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={[
            styles.container,
            isHovered ? styles.itemHovered : null
            ]}
        >
            <View style={styles.item}>
                <Image
                  source={{ uri: data.image }}
                  style={{ width:  Platform.OS == 'web' ? 164 : 150, height:  Platform.OS == 'web' ? 164 : 150, borderRadius: 9}}
                />                
                <View>
                    {data.name ? <Text style={{color: Colors.White, maxWidth: 150, fontSize: 16}} numberOfLines={1}  ellipsizeMode='tail'>{toCapitalCase(data.name)}</Text> : null}
                    <View style={{display: 'flex', flexDirection: 'row' ,alignItems: 'center', gap: 10}}>
                        <Text style={{color: Colors.White, fontSize: 16}}>{data.release_date.substring(0, 4)}</Text>
                        <PointTrait point={true}/>
                        <Text style={{color: Colors.White, fontSize: 16}}>{toCapitalCase(data.type)}</Text>
                    </View> 
                </View>
            </View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    container: { 
        backgroundColor: Colors.Jet,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginLeft: Platform.OS == 'web' ? 30 : 0,
        marginRight: Platform.OS == 'web' ? 30 : 0,
        borderRadius: 15,
        maxWidth: Platform.OS === 'web' ? 200 : 395,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
        transition: 'background-color 0.3s ease',
        marginBottom: Platform.OS == 'web' ? 30 : 20,
    },
    item: {
        display:'flex',
        flexDirection: Platform.OS == 'web' ? 'column' : 'row',
        overflow: 'hidden',
        gap: 10,
        alignItems:  Platform.OS == 'web' ? 'flex-start' : 'center',
    },
    itemHovered: {
        backgroundColor: Colors.Onyx, // Fond avec effet de fondu
    },
 
});
export default ItemPopup