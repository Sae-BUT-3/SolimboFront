import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
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
        borderColor: Colors.Onyx,
        borderWidth: 1,
    },
    text : {
        color:Colors.Silver,
    },
    clicked: {
        backgroundColor: Colors.DarkSpringGreen
    },
    svgWrapper: {
       paddingLeft: 5
    }

})
function Filter({onPressHandler, text}) {
    const [isClicked, setIsClicked] = useState(false);
    const clickedStyle = isClicked ? styles.clicked : {};
    function handleKeyPress(){
        setIsClicked(!isClicked);
        onPressHandler()
    }
    return (
        <Text
            style={[styles.textContainer, clickedStyle]}
            onPress={handleKeyPress}
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
                        width={10}
                        height={10}
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

        </Text>
    );
}

export default Filter;
