import React, {useEffect, useState} from 'react';
import {View, Button, TextInput, Text, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import axiosInstance from '../../api/axiosInstance';
import Searchbar from "../../components/search/Searchbar";
import SearchResult from "../../components/search/SearchResult";
import {Colors} from "../../style/color";




function SearchScreen() {
    const {height, width} = useWindowDimensions()
    const searchStyle = StyleSheet.create({
        container: {
            width: "100%",
            height: "100%",
            minHeight: "100%",
            backgroundColor: Colors.Licorice,
            margin: 'auto',
        },
        subContainer: {
            width: width> 1200 ? 1200 : "100%",
            height: "100%",
            margin: "auto"
        },
        searchContainer: {
            paddingBottom: 10,
            paddingTop: 10,
            paddingLeft: 10,
            position: "sticky",
            top: 0,
            backgroundColor: Colors.Licorice,
            zIndex: 1,
        },
        resultContainer: {
            display: "flex",
            flexDirection: "column",
            gap: 10,

            width: width> 1200 ? 1200 : "100vw",
        },
        resultItemContainer: {
            width: "95%",
            margin: "auto"
        },
        messageText: {
            fontSize: 50,
            fontWeight: "500",
            color: Colors.Celadon,
            paddingLeft: 15,
            paddingRight: 15,
        }
    });

    const [filter, setFilter] = useState([]);
    const [items, setItems] = useState([]);
    const [messsageText, setMesssageText] = useState("Recherchez vos artistes, musiques ou amis");

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
            limit: 20
        }
        axiosInstance.get("/spotify/search",{
            params
        }).then(response => {
            setItems(response.data)
            if(response.data.length > 0){
                setMesssageText(null)
                return
            }
            setMesssageText('Pas de résulat pour cette recherche')
        })
    }


    return (
        <ScrollView
            style={[searchStyle.container]}
        >
            <View
                style={searchStyle.subContainer}
            >
                <View
                    style={searchStyle.searchContainer}
                >
                    <Searchbar filters={filter} keyPressHandler={query => handleSerch(query)}/>
                </View>
                {messsageText ?
                    <Text
                        style={searchStyle.messageText}
                    >
                        {messsageText}
                    </Text> : null
                }
                    <View style={[searchStyle.resultContainer]}>

                        {
                            items.map((item, index) => (
                                <View
                                    key={index}
                                    style={searchStyle.resultItemContainer}>
                                    <SearchResult
                                        key={index}
                                        imageURL={item.imageURL}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        rounded={item.type === 'user' || item.type === 'artist'}
                                    />
                                </View>
                        ))
                        }
                    </View>
            </View>
        </ScrollView>
    );


}

export default SearchScreen;
