import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types'

import Icon from "react-native-vector-icons/Ionicons";

// Component used for each of the SP items on the first SP tab screen

export const HomeScreenTile = props => {
    return (
        <View style={tileStyle.container}>
            <TouchableHighlight
                underlayColor="#FDEDEC"
                style={tileStyle.button}>
                <View style={{alignItems:"center"}}>
                    <Text style={tileStyle.buttonText}>{props.name}</Text>
                    <Icon
                        name={props.iconName}
                        size={90}
                    />
                </View>
            </TouchableHighlight>
        </View>
    )
};

HomeScreenTile.propTypes = {
    name: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired
};
// Defining prop types for this component

const tileStyle = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        borderWidth: 3,
        borderRadius: 15
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        margin: 10
    },
    // need to wrap button in View in order to stretch to full width of screen using flexDirection

    buttonText: {
        fontSize: 25,
        paddingBottom: 10
    },

});