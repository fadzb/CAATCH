// Simple calendar view component

import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types'
import {Icons} from "../Constants/Icon";
import { Calendar } from 'react-native-calendars';
import {PressableIcon} from "./PressableIcon";
import {AppColors} from "../Styles/TabStyles";

export const CalendarView = props => {
    return (
        <View style={calendarViewStyle.container}>
            <View style={calendarViewStyle.closeButton}>
                <PressableIcon
                    size={45}
                    iconName={Icons.closeModal}
                    color={AppColors.blue}
                    onPressFunction={props.onPress}
                />
                <View style={{paddingLeft: 25}}>
                    <Text style={{color: AppColors.blue, fontWeight: 'bold'}}>{props.title}</Text>
                </View>
            </View>
            <View style={calendarViewStyle.calendar}>
                <Calendar
                    onDayPress={props.dayPress}
                    maxDate={props.maxDate && new Date()}
                    theme={{
                        todayTextColor: AppColors.orange,
                        arrowColor: AppColors.orange,
                        monthTextColor: AppColors.orange,
                        dayTextColor: AppColors.blue
                    }}
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
        alignItems:'center',
        marginTop: 25,
        flexDirection: 'row'
    },

    image: {
        flex: 1,
        justifyContent: 'center'
    }
});