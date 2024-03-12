import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, useWindowDimensions, Platform} from 'react-native';
import Filter from "./Filter";
import Svg, { Path } from 'react-native-svg';
import {Colors} from "../../style/color";
import {breakpoint} from "../../style/breakpoint";

function SearchBar({keyPressHandler, filters}) {
    const {height, width} = useWindowDimensions();
    const allFilters = filters.map(item => item.id)
    const [filterArray, setFilterArray] = useState([])
    const [inputValue, setInputValue] = useState('');

    const styles = StyleSheet.create({
        container : {

        },
        diplayContainer: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center"
        },
        SearchBarContainer: {
            paddingBottom: 10,
            display:"flex",
            justifyContent : "center"
        },
        SearchBar: {
            display: "flex",
            flexDirection: "row",
            width: Platform.OS === "web" ? "90%" : "75%",
            backgroundColor: Colors.Jet,
            paddingTop: 10,
            paddingLeft: 10,
            paddingBottom: 10,
            borderRadius:10,
            color: Colors.Silver,
            marginHorizontal : 10
        },
        filters: {
            gap: 10,
            overflowY: width < breakpoint.mobile && Platform.OS !== "web" ? "scroll" : "none",
            flexWrap: Platform.OS === "web" ? "wrap" : "nowrap"
        },
        cancelText: {
            color:Colors.Silver,
        },
    })

    function triggerSearch(text,filter){
        const query =  {}
        query.text = text.trim()
        query.filters = filter.length > 0 ? filter : allFilters
        keyPressHandler(query)
    }
    function handleInputKeypress(text){
        setInputValue((text))
        triggerSearch(text,filterArray)
    }
    function handleCancel() {
        setInputValue('')
        triggerSearch('',filterArray)
    }

    function handleFilterClick(id){
        let newArray = []
        if(filterArray.includes(id)){
            newArray = filterArray.filter(item => item !== id)
            setFilterArray(newArray)
        }
        else {
            filterArray.push(id)
            newArray = filterArray
        }
        triggerSearch(inputValue, newArray)
    }

    return (
        <View style={[styles.container]} > 
            <View
                style={[styles.diplayContainer, styles.SearchBarContainer]}
            >

                <Svg
                    height="20"
                    width="20"
                >
                    <Path fill="none" viewBox="0 0 20 20" strokeWidth="2" stroke={Colors.Silver} className="w-6 h-6" strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </Svg>

                <TextInput
                    style={styles.SearchBar}
                    placeholder="Chercher"
                    value={inputValue}
                    placeholderTextColor="#B3B3B3"
                    onChangeText={text => handleInputKeypress(text)}
                />

                <Text
                    style={styles.cancelText}
                    onPress={handleCancel}
                >Annuler</Text>
            </View>

            <View
                style={[styles.diplayContainer, styles.filters]}
            >
                {filters.map((item, index) => (
                    <Filter
                        key={index}
                        onPressHandler={()=>handleFilterClick(item.id)}
                        text={item.label}
                    />
                ))
                }
            </View>

        </View>
    );
}

export default SearchBar;
