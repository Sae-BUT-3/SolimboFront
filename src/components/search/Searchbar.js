import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Filter from "./Filter";
import Svg, { Path } from 'react-native-svg';

const styles = StyleSheet.create({
    diplayContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: "10px",
        alignItems: "center"
    },
    SearchBarContainer: {
        paddingBottom: "10px",
        display:"flex",
        justifyContent: "space-between"
    },
    SearchBar: {
        display: "flex",
        flexDirection: "row",
        width: "70%",
        backgroundColor: "#2B2B2B",
        paddingTop: "10px",
        paddingBottom: "10px",
        borderRadius:"10",
        color: "#FFFFFF",
        boxSizing:" border-box",
        paddingLeft: "15px",
        outlineStyle: 'none',
    },
    filters: {
        gap: "5px",
        overflowY: "scroll"
    },
    cancelText: {
        color:"#B3B3B3",

    },

})
function SearchBar({keyPressHandler, filters}) {
    const allFilters = filters.map(item => item.id)
    const [filterArray, setFilterArray] = useState([])
    const [inputValue, setInputValue] = useState('');

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
        <View>
            <View
                style={[styles.diplayContainer, styles.SearchBarContainer]}
            >

                <Svg
                    height="20"
                    width="20"
                >
                    <Path fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#B3B3B3" className="w-6 h-6" strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </Svg>

                <TextInput
                    style={styles.SearchBar}
                    placeholder="Chercher"
                    value={inputValue}
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
