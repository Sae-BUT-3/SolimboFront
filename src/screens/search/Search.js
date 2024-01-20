import React, {useEffect, useState} from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import axiosInstance from '../../api/axiosInstance';
import Searchbar from "../../component/search/Searchbar";
import SearchResult from "../../component/search/SearchResult";
function Search() {
    const [filter, setFilter] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Fetch search filters when the component mounts
        axiosInstance.get('/spotify/Searchfilters').then(response => {
            setFilter(response.data);
        });
    }, [])
    function handleSerch(query){
       console.log(query.filters.join(","))
        const params = {
            query: query.text,
            spotify_filter: query.filters.join(","),
            limit: 10
        }
        axiosInstance.get("/spotify/search",{
            params
        }).then(response => {
            console.log(response.data)
            setItems(response.data)
        })
    }

    return (
        <View>
            <Searchbar filters={filter} keyPressHandler={query => handleSerch(query)}/>
            <View>
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
