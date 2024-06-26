import React, {useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Image} from 'react-native';
import { Colors } from '../../style/color';
import PointTrait from '../common/PointTrait';
import {useNavigation} from '@react-navigation/native'
import {Rating} from 'react-native-ratings';

const toCapitalCase = (mot) => {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

const Item = ({data}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigation = useNavigation();

    const handlePress = () => {
        console.log("handlePressItem",data);
        switch(data.type){
            case 'single':
            case 'album':
            case 'compilation':
                navigation.navigate('oeuvre', {type: 'album', id : data.id });
                break;
            default:
                navigation.navigate('oeuvre', {type: data.type, id : data.id });
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (data != null ?
        <Pressable
            onPress={handlePress}
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
                  style={{ width:  Platform.OS == 'web' ? 164 : 150,   height: Platform.OS == 'web' ? 164 : 150, borderRadius: 9 }}
                />
                { Platform.OS == 'web' ?
                   <View>
                        <View>
                            {data.name ? <Text style={{color: Colors.White, maxWidth: 150}} numberOfLines={1}  ellipsizeMode='tail'>{toCapitalCase(data.name)}</Text> : null}
                        </View>
                        <View style={{display: 'flex',flexDirection: 'row', alignItems: 'center'}}>
                            <Rating
                                type="custom"
                                ratingCount={5}
                                imageSize={25}
                                ratingColor={Colors.DarkSpringGreen}
                                tintColor={Colors.Jet}
                                ratingBackgroundColor={Colors.Licorice}
                                startingValue={data.rating || 0}
                                readonly
                            />
                            <PointTrait point={true}/> 
                            <Text style={{color: Colors.White}}>{data.reviewCount > 0 ? data.reviewCount : 0}</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row',alignItems: 'center', gap: 10}}>
                            <Text style={{color: Colors.White}}>{data.release_date.substring(0, 4)}</Text>
                            <PointTrait point={true}/>
                            <Text style={{color: Colors.White}}>{toCapitalCase(data.type)}</Text>
                        </View>
                    </View> :
                    <View style={{display: 'flex', alignItems: 'flex-start', gap: 10}}>
                         {data.name ? <Text style={{color: Colors.White, maxWidth: 180, fontSize: Platform.OS  === 'web' ? 20 : 17 , fontWeight: '600'}} numberOfLines={1}  ellipsizeMode='tail'>{toCapitalCase(data.name)}</Text> : null}
                        <View style={{display: 'flex',flexDirection: 'row', alignItems: 'center', gap: 5}}>
                            <Rating
                                type="custom"
                                ratingCount={5}
                                imageSize={25}
                                ratingColor={Colors.DarkSpringGreen}
                                tintColor={Colors.Jet}
                                ratingBackgroundColor={Colors.Licorice}
                                startingValue={data.rating || 0}
                                readonly
                            />
                            <PointTrait point={true}/> 
                            <Text style={{color: Colors.White, fontSize: 18}}>{data.reviewCount ? data.reviewCount : 0}</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            {data.release_date ? <Text style={{color: Colors.White, fontSize: 17}}>{data.release_date.substring(0, 4)}</Text> : null}
                            <PointTrait point={true}/>
                            {data.type ? <Text style={{color: Colors.White, fontSize: 17}}>{toCapitalCase(data.type)}</Text> : null}
                        </View>
                    </View>
                }
            </View>
        </Pressable> : null
    )
}
const styles = StyleSheet.create({
    container: { 
        backgroundColor: Colors.Jet,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginLeft: Platform.OS == 'web' ? 20 : 10,
        marginRight: Platform.OS == 'web' ? 20 : 10,
        borderRadius: 15,
        maxWidth: Platform.OS === 'web' ? 200 : null,
        width: Platform.OS !== 'web' ? 390 : null,
        transition: 'background-color 0.3s ease',
        marginBottom: Platform.OS == 'web' ? 30 : 20,
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
    item: {
        display:'flex',
        flexDirection: Platform.OS == 'web' ? 'columns' : 'row',
        gap: 15,
        alignItems: 'flex-start',
        color: Colors.White,
    },
    itemHovered: {
        backgroundColor: Colors.Onyx, // Fond avec effet de fondu
    },
});

export default Item
