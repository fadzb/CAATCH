// component to display video thumbnail as this is not possible by passing video uri to image component in ios devices

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import {Video} from 'expo';

export const VideoThumbnail = props => {
    return (
        <View style={props.containerStyle}>
            <Video
                style={props.videoDisplayStyle}
                source={props.source}
                usePoster
                shouldPlay={false}
                resizeMode="cover"
            />
        </View>
    )
};

VideoThumbnail.propTypes = {
    source: PropTypes.object,
    onPressFunction: PropTypes.func,
    containerStyle: PropTypes.number
};
// Defining prop types for this component
