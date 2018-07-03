import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import twitter from 'react-native-twitter';

import {styles} from "../Styles/TabStyles";
import Tweet from "../Components/Tweet"

const tokens = {
    consumerKey: "VQ3RHBCnaM9420iDDXUIR84yl",
    consumerSecret: "a7elhJFOpqm3vzr75papfQzdI5nByyG3hh2nj5UMLRvrYytFJK",
    accessToken: "1001757426125811712-PZblF0fXwmUXUAKybF0lj1xnAOy7Th",
    accessTokenSecret: "1OjBvMX8sIjESiiz7pPhMgyAkgWfjVwRV38FpYAgyox0h"
};

const client = twitter(tokens).rest;

export default class TwitterScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tweets: []
        }
    }

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Ionicons
                name={`logo-twitter`}
                size={25}
                color={tintColor}
            />
        )
    };
    // static property called navigationOptions that belongs to all screen components

    componentDidMount() {
        client.get('statuses/home_timeline', {count: 100})
            .then(tweets => tweets.map(t => ({text: t.text, pic: t.user.profile_image_url, name: t.user.name, username: t.user.screen_name})))
            .then(res => this.setState({
                tweets: res
            }))
            .then(() => console.log(this.state.tweets))
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.tweets}
                    renderItem={({item}) => <View style={{padding: 20}}>
                        <Tweet
                            profilePicture={{uri: item.pic}}
                            name={item.name}
                            username={item.username}
                            content={item.text}
                        />
                    </View>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const newsStyle = StyleSheet.create({

});
