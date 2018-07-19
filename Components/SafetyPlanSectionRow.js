import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Thumbnail} from 'native-base'
import PropTypes from 'prop-types'
import Swipeable from 'react-native-swipeable';
import {Icons} from "../Constants/Icon";
import Icon from "react-native-vector-icons/Ionicons";
import {VideoThumbnail} from "./VideoThumbnail";

import {PressableIcon} from "./PressableIcon";

// Component used for rows in the various SP section lists. Can display a thumbnail, icon or circleView(See contacts)

export class SafetyPlanSectionRow extends React.Component {

    onPressDelete = () => {
        this.props.deleteFunction();

        this.swipeable.recenter();
        // recenter swipeable once delete button is pressed
    };

    rightDeleteButton =
            [
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <PressableIcon
                        iconName={Icons.delete + '-outline'}
                        size={40}
                        buttonStyle={sectionRowStyle.deleteButtonStyle}
                        onPressFunction={this.onPressDelete}
                        color='red'
                    />
                </View>
            ];
    // delete button that appears on swipe

    render() {
        return (
            <Swipeable onRef={ref => this.swipeable = ref} rightButtons={this.rightDeleteButton}>
                <View style={sectionRowStyle.container}>
                    <TouchableHighlight
                        underlayColor="#FDEDEC"
                        style={sectionRowStyle.button}
                        onPress={this.props.onPress}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center'}}>
                            {this.props.thumbnail !== undefined && <Thumbnail source={this.props.thumbnail} />}
                            {this.props.videoThumbnail !== undefined && <VideoThumbnail
                                source={this.props.videoThumbnail}
                                containerStyle={sectionRowStyle.videoThumbnailView}
                                videoDisplayStyle={sectionRowStyle.videoDisplay}
                            />}
                            {this.props.icon !== undefined && <Icon
                                name={this.props.icon}
                                size={56}
                                color={this.props.iconColor}
                            />}
                            {this.props.circleView !== undefined && <View style={sectionRowStyle.circleView}>
                                <Text style={{fontSize: 20}}>{this.props.circleView}</Text>
                            </View>}
                            <Text style={sectionRowStyle.buttonText}>{this.props.name}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </Swipeable>
        )
    }
}

SafetyPlanSectionRow.propTypes = {
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
    }

});