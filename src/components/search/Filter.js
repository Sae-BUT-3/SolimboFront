import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {Colors} from "../../style/color";
const styles = StyleSheet.create({
    textContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight:  10,
        borderRadius:20,
        borderColor: Colors.Jet,
        borderWidth: 1,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' ,
    },
    text : {
        color:Colors.Silver,
        fontSize: 16,
        padding: 2
    },
    clicked: {
        backgroundColor: Colors.DarkSpringGreen
    },
    svgWrapper: {
       paddingLeft: 5
    },
    btnHovered: {
        backgroundColor: Colors.Onyx,
    },

})
function Filter({onPressHandler, text}) {
    const [isClicked, setIsClicked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };

    function handleKeyPress(){
        setIsClicked(!isClicked);
        onPressHandler()
    }
    return (
        <Pressable
            style={[styles.textContainer, isClicked ? styles.clicked : null, isHovered ? styles.btnHovered : null]}
            onPress={handleKeyPress}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Text
                style={styles.text}
            >
                {text}
            </Text>
            {isClicked ?
                <View
                    style={styles.svgWrapper}
                >
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width={15}
                        height={15}
                        viewBox="2 2 20 20"
                        strokeWidth={2}
                        stroke={Colors.Silver}
                        className="w-6 h-6"
                    >
                        <Path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </Svg>
                </View> : null}

        </Pressable>
    );
}

export default Filter;
