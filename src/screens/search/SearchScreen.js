import React, {useEffect, useState} from 'react';
import {View, Button, TextInput, Text} from 'react-native';
import axiosInstance from '../../api/axiosInstance';
import Searchbar from "../../components/search/Searchbar";
import SearchResult from "../../components/search/SearchResult";
import commonStyles from '../../style/commonStyle';
import searchStyle from '../../style/searchStyle';

import Svg, {Path} from "react-native-svg";

function SearchScreen() {

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
            style={commonStyles.container}
        >
            <View
                style={searchStyle.searchContainer}
            >
                <Searchbar filters={filter} keyPressHandler={query => handleSerch(query)}/>
            </View>

            <View
                style={searchStyle.searchResultContainer}
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

export default SearchScreen;
