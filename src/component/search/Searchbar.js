import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
const styles = StyleSheet.create({
    diplayContainer: {
        display: "flex",
        flexDirection: "row"
    }
})
function SearchBar({keyPressHandler, filters}) {
    const allFilters = filters.map(item => item.id)
    let filterArray = []
    function handleInputKeypress(text){
        const query = {}
        query.text = text.trim()
        query.filters = filterArray.length > 0 ? filterArray : allFilters
        return query
    }

    function handleFilterClick(id){

        if(filterArray.includes(id)){
            filterArray = filterArray.filter(item => item !== id)
            return
        }
        filterArray.push(id)
    }

    return (
        <View>
            <TextInput
                placeholder="Chercher"
                onChangeText={text => keyPressHandler(handleInputKeypress(text))}
            />
            <View
                style={styles.diplayContainer}
            >
                {filters.map((item, index) => (
                    <Text key={item.id} onPress={()=>handleFilterClick(item.id)}>{item.label}</Text>
                ))
                }
            </View>

        </View>
    );
}

export default SearchBar;
