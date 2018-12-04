import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Icons} from "../Constants/Icon";
import {PressableIcon} from "./PressableIcon";
import {AppColors} from "../Styles/TabStyles";

export const DateChanger = props => {
    return (
        <View style={dateStyle.header}>
            <PressableIcon
                iconName={Icons.dividerArrowBack}
                size={30}
                onPressFunction={props.backFunction}
                buttonStyle={{paddingHorizontal: 10}}
                color={AppColors.blue}
            />
            <Text style={{fontSize: 16, color: AppColors.grey}}>{props.title}</Text>
            <PressableIcon
                iconName={Icons.dividerArrow}
                size={30}
                onPressFunction={props.forwardFunction}
                buttonStyle={{paddingHorizontal: 10}}
                color={AppColors.blue}
            />
        </View>
    )
};

const dateStyle = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 15,
        marginBottom: 5,
        backgroundColor: '#f0f0f5',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: AppColors.orange,
        borderRadius: 2,
        alignItems: 'center'
    }
});
