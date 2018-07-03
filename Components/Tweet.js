import React from 'react';
import { StyleSheet, View, Button, TextInput, FlatList } from 'react-native';

import { ListItem, Thumbnail, Text, Body } from 'native-base';

const Tweet = props => {
    return (
        <View>
            <Thumbnail size={60} source={props.profilePicture} />
            <Body>
            <View style={tweetStyle.nameContainer}>
                <Text style={tweetStyle.name}>{props.name}</Text>
                <Text style={tweetStyle.username}>@{props.username}</Text>
            </View>
            <Text style={tweetStyle.content}>{props.content}</Text>
            </Body>
        </View>
    )
};

const tweetStyle = StyleSheet.create({
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    name: {
        fontWeight: '600',
        fontSize: 14,
    },
    username: {
        fontWeight: '200',
        fontSize: 12,
    },
    content: {
        fontSize: 16,
    },
});

export default Tweet;