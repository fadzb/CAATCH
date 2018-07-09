import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";

import {readDatabase} from "../../../Util/DatabaseHelper";

export default class WarningSignLink extends React.Component {
    static navigationOptions = {
        title: "Warning Sign",
    };

    constructor(props) {
        super(props);

        this.state = {
            signs: {},
            checkedSigns: []
        }
    }

    componentDidMount() {
        readDatabase("*", "WarningSign", this.updateSigns)
    }
    // read DB for all currently saved warning signs

    updateSigns = (signs) => {
        const signStruct = {};
        signs.forEach(s => signStruct[s.signId] = s.signName);

        this.setState({ signs: signStruct})
    };
    // function that creates object with signId as key and signName as value. Then setStates with that object

    getCheckedSigns = (signs) => {
        this.setState({
            checkedSigns: signs.filter(s => s !== undefined)
        });
    };
    // Updates state everytime option is checked/unchecked

    render() {
        return(
            <View style={signLinkStyle.viewContainer}>
                <CustomMultiPicker
                    options={this.state.signs}
                    multiple={true} //
                    returnValue={"signId"} // label or value
                    callback={this.getCheckedSigns} // callback, array of selected items
                    rowBackgroundColor={"#fff"}
                    rowHeight={40}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={25}
                    itemStyle={signLinkStyle.itemStyle}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                />
                <TouchableHighlight
                    style={signLinkStyle.button}
                    onPress={() => this.props.navigation.navigate('newCoping', {checkedSigns: this.state.checkedSigns})}
                    underlayColor='#99d9f4'>
                    <Text style={signLinkStyle.buttonText}>Done</Text>
                </TouchableHighlight>
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
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        margin:15,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});