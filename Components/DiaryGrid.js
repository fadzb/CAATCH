import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types'
import {DiaryTile} from "./DiaryTile";
import {Icons} from "../Constants/Icon";

import Icon from "react-native-vector-icons/Ionicons";
import {SectionHeader} from "../Constants/Constants";

export const DiaryGrid = (props) => {
    return (
        <View style={gridStyle.container}>
            <View style={{flex: 1, alignItems: 'center'}}>
                <View style={gridStyle.generalRowContainer}>
                    <DiaryTile onPress={() => props.navigation.push('general', {title: props.date})} name='General' iconName={Icons.generalDiary + '-outline'}/>
                </View>
            </View>
            <View style={gridStyle.rowContainer}>
                <DiaryTile onPress={() => props.navigation.push('spSelection', {title: 'Signs', type: 'sign'})} name='Warning Sign' iconName={Icons.warningSign + '-outline'}/>
                <DiaryTile onPress={() => props.navigation.push('spSelection', {title: 'Strategies', type: 'cope'})} name='Coping Strategy' iconName={Icons.copingStrategy + '-outline'}/>
            </View>
            <View style={gridStyle.rowContainer}>
                {props.dbtEnabled && <View style={gridStyle.rowContainer}>
                    <DiaryTile onPress={() => props.navigation.push('skills', {title: props.date})} name={SectionHeader.skills} iconName={Icons.skills + '-outline'}/>
                    <DiaryTile onPress={() => props.navigation.push('feelings', {title: props.date})} name={SectionHeader.info} iconName={Icons.feelings + '-outline'}/>
                </View>}
            </View>
        </View>
    )
};

const marginHorizontal = 25;

const gridStyle = StyleSheet.create({

    rowContainer: {
        flexDirection: 'row',
        flex: 1,
    },

    generalRowContainer: {
        flexDirection: 'row',
        flex: 1,
        width: (Dimensions.get('window').width - (marginHorizontal * 2)) / 2
    },

    container: {
        flex: 1,
        marginVertical: 25,
        marginHorizontal: marginHorizontal

    }
});