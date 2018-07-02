import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, TouchableHighlight } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import {styles} from "../Styles/TabStyles";
import {HomeScreenTileRow} from "../Components/HomeScreenTileRow";

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
        return (
            <View style={styles.container}>
                <Image style={homeStyle.banner} source={require("../Media/Images/HD-Peaceful-Image.jpg")} />
                <View style={homeStyle.tileContainer}>
                    <HomeScreenTileRow
                        name1="My Stats"
                        iconName1="ios-stats-outline"
                        name2="Plan"
                        iconName2="ios-list-outline"
                    />
                    <HomeScreenTileRow
                        name1="Diary"
                        iconName1="ios-book-outline"
                        name2="Reports"
                        iconName2="ios-clipboard-outline"
                    />
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

    tileContainer: {
        flex: .63,
        flexDirection: "column",
        alignSelf: "stretch",
        margin: 10
    },

});

