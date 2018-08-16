import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Thumbnail} from 'native-base'
import PropTypes from 'prop-types'
import Icon from "react-native-vector-icons/Ionicons";
import {VideoThumbnail} from "./VideoThumbnail";

// Component used for rows in the touchable rows in the app
 export const SelectionRow = (props) => (
        <View style={sectionRowStyle.container}>
            <TouchableHighlight
                underlayColor="#FDEDEC"
                style={sectionRowStyle.button}
                onPress={props.onPress}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center'}}>
                    {props.thumbnail !== undefined && <Thumbnail source={props.thumbnail} />}
                    {props.videoThumbnail !== undefined && <VideoThumbnail
                        source={props.videoThumbnail}
                        containerStyle={sectionRowStyle.videoThumbnailView}
                        videoDisplayStyle={sectionRowStyle.videoDisplay}
                    />}
                    {props.icon !== undefined && <View style={sectionRowStyle.iconContainer}><Icon
                        name={props.icon}
                        size={56}
                        color={props.iconColor}
                    /></View>}
                    {props.circleView !== undefined && <View style={sectionRowStyle.circleView}>
                        <Text style={{fontSize: 20}}>{props.circleView}</Text>
                    </View>}
                    <Text style={sectionRowStyle.buttonText}>{props.name}</Text>
                </View>
            </TouchableHighlight>
        </View>
);

SelectionRow.propTypes = {
    name: PropTypes.string,
    deleteFunction: PropTypes.func
};
// Defining prop types for this component

const sectionRowStyle = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: "space-around",
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
        fontSize: 18,
        paddingLeft: 20
    },

    circleView: {
        width: 56,
        height: 56,
        borderRadius: 56/2,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    videoThumbnailView: {
        width: 56,
        height: 56,
        borderRadius: 56/2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    videoDisplay: {
        width: 56,
        height: 56,
        borderRadius: 56/2,
    },

    iconContainer: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    }

});