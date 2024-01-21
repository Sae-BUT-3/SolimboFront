import React, {useEffect, useState} from 'react';
import {View, Button, TextInput, Text, StyleSheet} from 'react-native';
import axiosInstance from '../../api/axiosInstance';
import Searchbar from "../../component/search/Searchbar";
import SearchResult from "../../component/search/SearchResult";
import Svg, {Path} from "react-native-svg";
function Search() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: "#191414",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            maxWidth: "100vw",
            alignItems: "center"
        },
        SearchBarContainer: {
            width: "95%",
            paddingBottom: "10px"
        },
        resultContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }
    })
    const [filter, setFilter] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Fetch search filters when the component mounts
        axiosInstance.get('/spotify/Searchfilters').then(response => {
            setFilter(response.data);
        });
    }, [])
    function handleSerch(query){
        if(!query.text.length) {
            setItems([])
            return
        }
        const params = {
            query: query.text,
            spotify_filter: query.filters.join(","),
            limit: 10
        }
        axiosInstance.get("/spotify/search",{
            params
        }).then(response => {
            setItems(response.data)
        })
    }

    return (
        <View
            style={styles.container}
        >
            <View
                style={styles.SearchBarContainer}
            >
                <Searchbar filters={filter} keyPressHandler={query => handleSerch(query)}/>
            </View>

            <View
                style={styles.resultContainer}
            >
                {items.map((item, index) => (
                    <SearchResult
                        key={index}
                        imageURL={item.imageURL}
                        title={item.title}
                        subtitle={item.subtitle}
                    />
                ))
                }
            </View>

        </View>
    );


}

export default Search;
