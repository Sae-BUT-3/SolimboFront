import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {VERSION} from "axios";
import Svg, {Path} from "react-native-svg";
const styles = StyleSheet.create({
    textContainer: {
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        backgroundColor: "transparent",
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderRadius:"20",
        borderColor: "#404040",
        borderWidth: "1px",
    },
    text : {
        color:"#B3B3B3"
    },
    clicked: {
        backgroundColor: "#206F3E"
    },

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
                <Svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width="20"
                height="20"
                viewBox="0 0 25 25"
                strokeWidth={2}
                stroke="#B3B3B3"
                className="w-6 h-6"
                >
                    <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </Svg> : null}

        </Text>
    );
}

export default Filter;
