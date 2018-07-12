// Simple image viewer component

import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import Image from 'react-native-scalable-image';
import {PressableIcon} from "./PressableIcon";
import {Constants} from 'expo';


export const ImageViewer = props => {
    return (
        <View style={imageViewerStyle.container}>
            <View style={imageViewerStyle.closeButton}>
                <PressableIcon
                    size={50}
                    iconName={"ios-close"}
                    color="white"
                    onPressFunction={props.onPress}
                />
            </View>
            <View style={imageViewerStyle.image}>
                <Image
                    width={(Dimensions.get('window').width)} // height will be calculated automatically
                    source={props.image}
                />
            </View>
        </View>
    )
};

ImageViewer.propTypes = {
    //image: PropTypes.number.isRequired,
    onPress: PropTypes.func,

};

const imageViewerStyle = StyleSheet.create({
    container: {
        //marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: 'black',
    },

    closeButton: {
        paddingLeft: 20,
        alignItems:'flex-start',
    },

    image: {
        flex: 1,
        justifyContent: 'center'
    }
});