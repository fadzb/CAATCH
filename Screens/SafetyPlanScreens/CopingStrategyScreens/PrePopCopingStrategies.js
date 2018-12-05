import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import {safetyPlanPrePops} from "../../../Constants/Prepopulated";
import {SafetyPlanConstants} from "../../../Constants/Constants";
import CustomMultiSelectList from "../../../Components/CustomMultiSelectList"
import {themeStyles} from "../../../Styles/TabStyles";

export default class PrePopCopingStrategies extends React.Component {
    static navigationOptions = {
        title: "Select Strategy",
    };

    constructor(props) {
        super(props);

        this.state = {
            strats: [],
            checkedStrats: []
        }
    }

    componentDidMount() {
        this.updateStrats(safetyPlanPrePops);
    }

    updateStrats = (strats) => {
        this.setState({ strats: strats.filter(item => item.category === SafetyPlanConstants.copingStrategy).map(strat => strat.name) });
    };
    // update checklist with strategies from pre-populated array

    getCheckedStrats = (strats) => {
        this.setState({
            checkedStrats: strats.filter(s => s !== undefined)
        });
    };
    // Updates state everytime option is checked/unchecked

    render() {
        return(
            <View style={preCopeStyle.viewContainer}>
                <View style={{flex: 1, marginBottom: 50}}>
                    <CustomMultiSelectList
                        options={this.state.strats}
                        multiple={false} //
                        returnValue={"label"} // label or value
                        callback={this.getCheckedStrats} // callback, array of selected items
                        rowBackgroundColor={"#fff"}
                        rowRadius={5}
                        iconColor={"#00a2dd"}
                        iconSize={25}
                        itemStyle={preCopeStyle.itemStyle}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                        search={true}
                    />
                </View>
                <TouchableHighlight
                    style={[preCopeStyle.button, themeStyles.multiSelectSaveButton]}
                    onPress={this.props.navigation.getParam('edit')
                        ? () => this.props.navigation.navigate('editCoping', {checkedStrats: this.state.checkedStrats})
                        : () => this.props.navigation.navigate('newCoping', {checkedStrats: this.state.checkedStrats})}
                    underlayColor='#99d9f4'>
                    <Text style={[preCopeStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const preCopeStyle = StyleSheet.create({
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