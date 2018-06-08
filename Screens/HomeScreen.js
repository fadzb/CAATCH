import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import {styles} from "../Styles/TabStyles";

export default class HomeScreen extends React.Component {

    static navigationOptions = {
        tabBarIcon: ({ focused, tintColor }) => (
            <Ionicons
                name={`ios-home${focused ? "" : "-outline"}`}
                // if icon is not pressed use outline
                size={25}
                color={tintColor}
            />
        )
    };
    // static property called navigationOptions that belongs to all screen components

    render() {
        const sampleQuote = '"Work hard, stay positive, and get up early. It' + "'" + 's the best part of the day."';
        const author = "George Allen, Sr.";
        // placeholder quotes

        return (
            <View style={styles.container}>
                <Image style={homeStyle.banner} source={require("../Media/Images/HD-Peaceful-Image.jpg")} />
                <View style={homeStyle.quoteContainer}>
                    <Text style={homeStyle.quote}>{sampleQuote}</Text>
                    <Text style={homeStyle.quoteAuthor}>{author}</Text>
                </View>
            </View>
        );
    }
}

const homeStyle = StyleSheet.create({
    banner: {
        flex: .37,
        resizeMode: "contain",
        justifyContent: "flex-start"
    },

    quoteContainer: {
        flex: .2,
        justifyContent: "center"
    },

    quote: {
        fontSize: 17,
        textAlign: "center",
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5
    },

    quoteAuthor: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 17,
    }
});

