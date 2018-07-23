import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import {safetyPlanPrePops} from "../../../Constants/Prepopulated";

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
        this.setState({ strats: strats.filter(item => item.category === 'CopingStrategy').map(strat => strat.name) });
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
                <View style={{flex: 1}}>
                    <CustomMultiPicker
                        options={this.state.strats}
                        multiple={false} //
                        returnValue={"label"} // label or value
                        callback={this.getCheckedStrats} // callback, array of selected items
                        rowBackgroundColor={"#fff"}
                        rowHeight={40}
                        rowRadius={5}
                        iconColor={"#00a2dd"}
                        iconSize={25}
                        itemStyle={preCopeStyle.itemStyle}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                    />
                </View>
                <TouchableHighlight
                    style={preCopeStyle.button}
                    onPress={() => this.props.navigation.navigate('newCoping', {checkedStrats: this.state.checkedStrats})}
                    underlayColor='#99d9f4'>
                    <Text style={preCopeStyle.buttonText}>Done</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const preCopeStyle = StyleSheet.create({
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