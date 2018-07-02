import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'

import { HomeScreenTile } from "./HomeScreenTile";

export const HomeScreenTileRow = props => {
    return (
        <View style={tileRowStyle.container}>
            <HomeScreenTile
                name= {props.name1}
                iconName= {props.iconName1}
            />
            <HomeScreenTile
                name= {props.name2}
                iconName= {props.iconName2}
            />
        </View>
    )
};

HomeScreenTileRow.propTypes = {
    name1: PropTypes.string.isRequired,
    name2: PropTypes.string.isRequired,
    iconName1: PropTypes.string.isRequired,
    iconName2: PropTypes.string.isRequired,
};

const tileRowStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    }
});