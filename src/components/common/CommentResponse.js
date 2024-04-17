import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Divider, List } from 'react-native-paper'; // Importation des composants de react-native-paper
import Response from './Response';
import { Colors } from '../../style/color';

const CommentResponse = ({items}) => {  
    return (
        <List.Section style={styles.list}>
            {items.map((data, index) => (
                <React.Fragment>
                    <Response data={data}/>
                    {index < items.length - 1 ? <Divider style={styles.divider} leftInset={true}  /> : null}
                </React.Fragment>
            ))}
        </List.Section>
    );
}

const styles = StyleSheet.create({
    list: {
        maxWidth: Platform.OS === 'web' ? null : 360,
        display: 'flex',
        flexDirection: 'column'
    },
    divider: {
        backgroundColor: Colors.BattleShipGray,
        marginTop: 10,
    },
});

export default CommentResponse;