import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types'

import {PressableIcon} from "./PressableIcon";

// Component used for rows in the various SP section lists

export const SafetyPlanSectionRow = props => {
    return (
        <View style={sectionRowStyle.container}>
            <TouchableHighlight
                underlayColor="#FDEDEC"
                style={sectionRowStyle.button}
                onPress={props.onPress}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "space-between",}}>
                    <Text style={sectionRowStyle.buttonText}>{props.name}</Text>
                    {props.delete && <PressableIcon
                        iconName={'ios-trash-outline'}
                        size={30}
                        buttonStyle={sectionRowStyle.deleteButtonStyle}
                        onPressFunction={props.deleteFunction}
                    />}
                </View>
            </TouchableHighlight>
        </View>
    )
};

SafetyPlanSectionRow.propTypes = {
    name: PropTypes.string,
    deleteFunction: PropTypes.func,
    delete: PropTypes.bool.isRequired
};
// Defining prop types for this component

const sectionRowStyle = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: "space-around",
        //alignItems: "center",
        borderBottomWidth: 1,
        marginLeft: 30,
        marginRight: 30,
    },

    container: {
        flex: 1,
        height: 80
    },
    // need to wrap button in View in order to stretch to full width of screen using flexDirection

    buttonText: {
        fontSize: 20,
        alignSelf: 'center',
    },

    deleteButtonStyle: {
        alignSelf: 'center',
        paddingRight: 10
    }
});