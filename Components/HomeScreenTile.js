import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types'

import Icon from "react-native-vector-icons/Ionicons";
import {themeStyles, Tiles} from "../Styles/TabStyles";
import {deviceHeight, smallDeviceHeight} from "../Constants/Constants";

// Component used for each of the SP items on the first SP tab screen

export const HomeScreenTile = props => {
    return (
        <View style={tileStyle.container}>
            <TouchableHighlight
                underlayColor="#FDEDEC"
                style={[tileStyle.button, themeStyles.tiles]}
                onPress={props.onPress}>
                <View style={{alignItems:"center", justifyContent: 'space-evenly', flex: 1}}>
                    <Text style={[tileStyle.buttonText, themeStyles.tileFont]}>{props.name}</Text>
                    <Icon
                        name={props.iconName}
                        size={40}
                        color={Tiles.iconColor}
                    />
                </View>
            </TouchableHighlight>
        </View>
    )
};

HomeScreenTile.propTypes = {
    name: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    onPress: PropTypes.func
};
// Defining prop types for this component

const tileStyle = StyleSheet.create({
    button: {
        flex: 1,
        //justifyContent: "space-around",
        alignItems: "center",
        //borderWidth: 1,
        borderRadius: 7,
        //backgroundColor: 'white'
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 15,
        //marginVertical: 23,
        // margin: 10
    },
    // need to wrap button in View in order to stretch to full width of screen using flexDirection

    buttonText: {
        fontSize: deviceHeight < smallDeviceHeight ? 12 : 14,
        //paddingBottom: 20
    },

});