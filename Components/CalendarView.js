// Simple calendar view component

import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import {Icons} from "../Constants/Icon";
import { Calendar } from 'react-native-calendars';
import {PressableIcon} from "./PressableIcon";

export const CalendarView = props => {
    return (
        <View style={calendarViewStyle.container}>
            <View style={calendarViewStyle.closeButton}>
                <PressableIcon
                    size={45}
                    iconName={Icons.closeModal}
                    color="black"
                    onPressFunction={props.onPress}
                />
            </View>
            <View style={calendarViewStyle.calendar}>
                <Calendar
                    onDayPress={props.dayPress}
                    maxDate={new Date()}
                />
            </View>
        </View>
    )
};

CalendarView.propTypes = {
    onPress: PropTypes.func,
    dayPress: PropTypes.func,
};

const calendarViewStyle = StyleSheet.create({
    container: {
        flex: 1,
    },

    closeButton: {
        paddingLeft: 25,
        alignItems:'flex-start',
        marginTop: 25
    },

    image: {
        flex: 1,
        justifyContent: 'center'
    }
});