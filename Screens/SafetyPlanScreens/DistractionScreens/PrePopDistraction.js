import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import {safetyPlanPrePops} from "../../../Constants/Prepopulated";
import {SafetyPlanConstants} from "../../../Constants/Constants";
import CustomMultiSelectList from "../../../Components/CustomMultiSelectList"
import {themeStyles} from "../../../Styles/TabStyles";

export default class PrePopDistraction extends React.Component {
    static navigationOptions = {
        title: "Select Distraction",
    };

    constructor(props) {
        super(props);

        this.state = {
            distractions: [],
            checkedDistractions: []
        }
    }

    componentDidMount() {
        this.updateDistractions(safetyPlanPrePops);
    }

    updateDistractions = (distractions) => {
        this.setState({ distractions: distractions.filter(item => item.category === SafetyPlanConstants.distraction).map(distract => distract.name) });
    };
    // update checklist with distractions from pre-populated array

    getCheckedDistractions = (distractions) => {
        this.setState({
            checkedDistractions: distractions.filter(dis => dis !== undefined)
        });
    };
    // Updates state everytime option is checked/unchecked

    render() {
        return(
            <View style={preDistractionStyle.viewContainer}>
                <View style={{flex: 1, marginBottom: 50}}>
                    <CustomMultiSelectList
                        options={this.state.distractions}
                        multiple={false} //
                        returnValue={"label"} // label or value
                        callback={this.getCheckedDistractions} // callback, array of selected items
                        rowBackgroundColor={"#fff"}
                        rowRadius={5}
                        iconColor={"#00a2dd"}
                        iconSize={25}
                        itemStyle={preDistractionStyle.itemStyle}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                        search={true}
                    />
                </View>
                <TouchableHighlight
                    style={[preDistractionStyle.button, themeStyles.multiSelectSaveButton]}
                    onPress={this.props.navigation.getParam('edit')
                        ? () => this.props.navigation.navigate('editDistraction', {checkedDistractions: this.state.checkedDistractions})
                        : () => this.props.navigation.navigate('newDistraction', {checkedDistractions: this.state.checkedDistractions})}
                    underlayColor='#99d9f4'>
                    <Text style={[preDistractionStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const preDistractionStyle = StyleSheet.create({
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