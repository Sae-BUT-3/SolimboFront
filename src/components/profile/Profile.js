import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, useWindowDimensions, Platform,Pressable} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {Colors} from "../../style/color";
import {breakpoint} from "../../style/breakpoint";
import FormatImageURL from "../../utils/FormatImageURL";

function SearchBar({user, isCurrent, relation}) {
    const {height, width} = useWindowDimensions();
    const [isHovered, setIsHovered] = useState(false);
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
            display:"flex",
            flexDirection: "row",
            width: "100%",
            gap: 10,
            alignItems: 'center'
        },
        diplayContainer: {
            // display: "flex",
            // flexDirection: "row",
            // width: "100%",
            // alignItems: "center"
        },
        image: {
            width:  width < breakpoint.medium ? 70 : 80,
            height: width < breakpoint.medium ? 70 : 80,
            borderRadius: "50%",
        },
        imageContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        },

        infoContainer: {
            flex: 1,
            display:"flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%"
        },
        numberContainer: {
            display:"flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: width< breakpoint.mobile ? "space-between" : "space-around",
        },
        followText: {
            fontSize: 12,
            fontWeight: '600',
            fontStyle: 5,
            textAlign: 'center',
            color:Colors.Silver,
        },
        followButton: {
            backgroundColor: Colors.Onyx, 
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 20,
            marginTop: 10,
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' , 
            transition: 'background-color 0.3s ease'
        },
        btnHovered: {
            backgroundColor: Colors.Jet, 
        },
        aliasText: {
            fontSize: 35,
            fontWeight: "500",
            color: Colors.Celadon,
        },
        pseudoText: {
            color: Colors.CalPolyGreen,
            fontSize: 12,
            fontWeight: '600',
            
        },
        numberText: {
            fontSize: 12,
            color: Colors.Silver
        },
        reviewText: {
            display: width < 300 ? "none" : "block",
        },
        numberValue: {
            fontWeight: 'bold',
        },
        bioText: {
            color: Colors.Silver
        }
    
    })

    return (
        <View style={[styles.container]} > 
            <View style={[styles.imageContainer]}>
                <Image
                    style={styles.image}
                    source={{
                        uri: FormatImageURL(user?.photo) || ""
                    }}
                />
                {
                    isCurrent 
                        ? null 
                        : 
                        <Pressable style={[styles.followButton, isHovered ? styles.btnHovered : null]}
                        activeOpacity={1}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        // onPress={followUser}
                        >
                            {!false ? <Text style={styles.followText}>+ Suivre</Text> : <Text style={styles.followText}>Suivi</Text>}
                        </Pressable >
                }
                
            </View>
            <View style={[styles.infoContainer]}>
                <View>
                    <Text style={[styles.aliasText]}>{user?.alias}</Text>
                    <Text style={[styles.pseudoText]}>@{user?.pseudo}</Text>
                    <Text style={[styles.bioText]}>{user?.bio}</Text>
                </View>
                <View style={[styles.numberContainer]}>
                    <Text style={[styles.numberText,styles.reviewText]}><Text style={[styles.numberValue]}>{user?.review_count}</Text> <Text style={[styles.numberLabel]}>reviews</Text></Text>
                    <Text style={[styles.numberText]}><Text style={[styles.numberValue]}>{user?.follower_count}</Text> <Text style={[styles.numberLabel]}>followers</Text></Text>
                    <Text style={[styles.numberText]}><Text style={[styles.numberValue]}>{user?.following_count}</Text> <Text style={[styles.numberLabel]}>suivi(e)s</Text></Text>
                </View>
            </View>
            <View></View>
        </View>
    );

    
}

export default SearchBar;
