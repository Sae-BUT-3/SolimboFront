import React, {useState} from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity, Platform} from 'react-native';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { Colors } from '../../style/color';
import PointTrait from './PointTrait';
import {useNavigation} from '@react-navigation/native'

const toCapitalCase = (mot) => {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

const Item = ({data}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigation = useNavigation();

    const handlePress = (_id, type) => {
        if(_id && type){
            switch(type){
                case 'single':
                case 'album':
                case 'compliation':
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
            <View key={data.id} style={styles.item}>
                <Avatar src={data.image} sx={{ width: 164, height: 164, borderRadius: 2, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} variant='square' />
                { Platform.OS == 'web' ?
                   <View>
                        <View><Text style={{color: Colors.White, maxWidth:  Platform.OS == 'web' ? 150 : null, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{toCapitalCase(data.name)}</Text></View>
                        <View style={{display: 'flex',flexDirection: 'row', alignItems: 'center', fontWeight: 'normal'}}>
                            <Rating value={data.rating} precision={0.5}  style={{color: Colors.DarkSpringGreen}} emptyIcon={<StarIcon style={{ opacity: 0.5, color: Colors.Licorice }} fontSize="inherit" />} readOnly />
                            <PointTrait point={true}/> <Text style={{color: Colors.White}}>{data.reviewCount}</Text> 
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row',alignItems: 'center', fontWeight: 'normal', gap: 10}}>
                            <Text style={{color: Colors.White}}>{data.release_date.substring(0, 4)}</Text>
                            <PointTrait point={true}/>
                            <Text style={{color: Colors.White}}>{toCapitalCase(data.type)}</Text>
                        </View> 
                    </View> :
                    <View style={{display: 'flex', flexDirection: 'row',alignItems: 'center', fontWeight: 'normal', gap: 5}}>
                        <View><Text style={{color: Colors.White, maxHeight: 25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',}}>{toCapitalCase(data.name)}</Text></View>
                        <View style={{display: 'flex',flexDirection: 'row', alignItems: 'center', fontWeight: 'normal'}}>
                            <Rating value={data.rating} precision={0.5}  style={{color: Colors.DarkSpringGreen}} emptyIcon={<StarIcon style={{ opacity: 0.5, color: Colors.Licorice }} fontSize="inherit" />} readOnly />
                            <PointTrait point={true}/> <Text style={{color: Colors.White}}>{data.reviewCount ? data.reviewCount : 0}</Text> 
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row',alignItems: 'center', fontWeight: 'normal', gap: 10}}>
                            <Text style={{color: Colors.White}}>{data.release_date.substring(0, 4)}</Text>
                            <PointTrait point={true}/>
                            <Text style={{color: Colors.White}}>{toCapitalCase(data.type)}</Text>
                        </View>
                    </View> 
                }
            </View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    container: { 
        backgroundColor: Colors.Jet,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginLeft: Platform.OS == 'web' ? 30 : 20,
        marginRight: Platform.OS == 'web' ? 0 : 20,
        borderRadius: 15,
        maxWidth: 200,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' ,
        transition: 'background-color 0.3s ease',
        marginBottom: 30
    },
    item: {
        display:'flex',
        flexDirection: Platform.OS == 'web' ? 'columns' : 'row',
        overflow: 'hidden',
        gap: 5,
        alignItems: 'center',
        color: Colors.White,
        fontWeight: 'normal',
        
    },
    itemHovered: {
        backgroundColor: Colors.Onyx, // Fond avec effet de fondu
    },
 
});
export default Item