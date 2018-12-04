import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Thumbnail} from 'native-base'
import PropTypes from 'prop-types'
import Icon from "react-native-vector-icons/Ionicons";
import {VideoThumbnail} from "./VideoThumbnail";
import {AppColors} from "../Styles/TabStyles";

// Component used for rows in the touchable rows in the app
 export const SelectionRow = (props) => (
        <View style={selectionRowStyle.container}>
            <TouchableHighlight
                underlayColor="#FDEDEC"
                style={selectionRowStyle.button}
                onPress={props.onPress}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center'}}>
                    {props.thumbnail !== undefined && <Thumbnail source={props.thumbnail} />}
                    {props.videoThumbnail !== undefined && <VideoThumbnail
                        source={props.videoThumbnail}
                        containerStyle={selectionRowStyle.videoThumbnailView}
                        videoDisplayStyle={selectionRowStyle.videoDisplay}
                    />}
                    {props.icon !== undefined && <View style={selectionRowStyle.iconContainer}><Icon
                        name={props.icon}
                        size={56}
                        color={AppColors.orange}
                    /></View>}
                    {props.circleView !== undefined && <View style={selectionRowStyle.circleView}>
                        <Text style={{fontSize: 20}}>{props.circleView}</Text>
                    </View>}
                    <Text style={selectionRowStyle.buttonText}>{props.name}</Text>
                </View>
            </TouchableHighlight>
        </View>
);

SelectionRow.propTypes = {
    name: PropTypes.string,
    deleteFunction: PropTypes.func
};
// Defining prop types for this component

const selectionRowStyle = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderColor: AppColors.orange,
        marginLeft: 30,
        marginRight: 30,
    },

    container: {
        flex: 1,
        height: 80
    },
    // need to wrap button in View in order to stretch to full width of screen using flexDirection

    buttonText: {
        fontSize: 16,
        paddingLeft: 20,
        color: AppColors.blue
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