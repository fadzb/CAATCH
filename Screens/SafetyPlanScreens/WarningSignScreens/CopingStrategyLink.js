import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiSelectList from "../../../Components/CustomMultiSelectList"

import {readDatabaseArg} from "../../../Util/DatabaseHelper";
import {DbTableNames} from "../../../Constants/Constants";
import {themeStyles} from "../../../Styles/TabStyles";

export default class CopingStrategyLink extends React.Component {
    static navigationOptions = {
        title: "Coping Strategies",
    };

    constructor(props) {
        super(props);

        this.state = {
            copes: {},
            checkedCopes: []
        }
    }

    componentDidMount() {
        readDatabaseArg("*", DbTableNames.copingStrategy, this.updateCopes, () => console.log("DB read success"), 'where dateDeleted is NULL');
    }
    // read DB for all currently saved coping Strategies where dateDeleted is null

    updateCopes = (copes) => {
        const copeStruct = {};
        copes.forEach(c => copeStruct[c.copeId] = c.copeName);

        this.setState({ copes: copeStruct})
    };
    // function that creates object with copeId as key and copeName as value. Then setStates with that object

    getCheckedCopes = (copes) => {
        this.setState({
            checkedCopes: copes.filter(c => c !== undefined)
        });
    };
    // Updates state everytime option is checked/unchecked

    render() {
        return(
            <View style={copeLinkStyle.viewContainer}>
                <CustomMultiSelectList
                    options={this.state.copes}
                    multiple={true} //
                    returnValue={"copeId"} // label or value
                    callback={this.getCheckedCopes} // callback, array of selected items
                    rowBackgroundColor={"#fff"}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    search={true}
                    iconSize={25}
                    itemStyle={copeLinkStyle.itemStyle}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                    selected={this.props.navigation.getParam('selectedStrats') !== undefined
                        ? this.props.navigation.getParam('selectedStrats').map(sc => sc.copeId.toString())
                        : undefined}
                />
                <TouchableHighlight
                    style={[copeLinkStyle.button, themeStyles.multiSelectSaveButton]}
                    onPress={this.props.navigation.getParam('edit')
                        ? () => this.props.navigation.navigate('editWarning', {checkedCopes: this.state.checkedCopes})
                        : () => this.props.navigation.navigate('newWarning', {checkedCopes: this.state.checkedCopes})}
                    underlayColor='#99d9f4'>
                    <Text style={[copeLinkStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const copeLinkStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },

    buttonText: {
        alignSelf: 'center'
    },
    button: {
        margin:15,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});