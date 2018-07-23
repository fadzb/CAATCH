import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types'
import {DiaryTile} from "./DiaryTile";
import {Icons} from "../Constants/Icon";

import Icon from "react-native-vector-icons/Ionicons";

export const DiaryGrid = () => {
    return (
        <View style={gridStyle.container}>
            <View style={gridStyle.rowContainer}>
                <DiaryTile name='Skills' iconName={Icons.skills + '-outline'}/>
                <DiaryTile name='Feelings' iconName={Icons.feelings + '-outline'}/>
            </View>
            <View style={gridStyle.rowContainer}>
                <DiaryTile name='Medication' iconName={Icons.medication + '-outline'}/>
                <DiaryTile name='General' iconName={Icons.generalDiary + '-outline'}/>
            </View>
            <View style={gridStyle.lastRowContainer}>
                <DiaryTile name='Warning Sign' iconName={Icons.warningSign + '-outline'}/>
                <DiaryTile name='Coping Strategy' iconName={Icons.copingStrategy + '-outline'}/>
            </View>
        </View>
    )
};

const gridStyle = StyleSheet.create({

    rowContainer: {
        flexDirection: 'row',
        flex: 1,
    },

    lastRowContainer: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 15
    },

    container: {
        flex: 1,
        margin: 15

    }
});