import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TimeLineView from '../Components/TimelineView'

import {styles} from "../Styles/TabStyles";

export default class TwitterScreen extends React.Component {

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Ionicons
                name={`logo-twitter`}
                size={25}
                color={tintColor}
            />
        )
    };
    // static property called navigationOptions that belongs to all screen components

    render() {
        return (
            <View style={styles.container}>
                <Text>TwitterScreen</Text>
                <TimeLineView/>;
            </View>
        );
    }
}

const newsStyle = StyleSheet.create({

});
