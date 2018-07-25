// Simple component for rendering a pressable image with fixed height relative to device screen size

import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

export const PressableImage = props => {
    return (
        <TouchableOpacity
            onPress={() => props.onPressFunction()}>
            <Image
                source={props.source}
                resizeMode={'cover'}
                style={imageStyle.image}
            />
        </TouchableOpacity>
    )
};

const imageStyle = StyleSheet.create({
    image: {
        width: (Dimensions.get('window').width) - 35,
        height: (Dimensions.get('window').height) / 2.4
    }
});
