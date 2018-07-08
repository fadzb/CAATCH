import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";

const userList = [
    "WarningSign 1",
    "WarningSign 2",
    "WarningSign 3"
];

export default class WarningSignLink extends React.Component {
    static navigationOptions = {
        title: "Warning Sign"
    };

    render() {
        return(
            <View style={signLinkStyle.viewContainer}>
                <CustomMultiPicker
                    options={userList}
                    multiple={true} //
                    returnValue={"label"} // label or value
                    callback={(res)=>{ console.log(res) }} // callback, array of selected items
                    rowBackgroundColor={"#fff"}
                    rowHeight={40}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={25}
                    itemStyle={signLinkStyle.itemStyle}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                />
            </View>
        )
    }
}

const signLinkStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    itemStyle: {
        borderBottomWidth: 3
    }
});