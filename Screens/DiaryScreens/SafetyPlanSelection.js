import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import {readDatabase} from "../../Util/DatabaseHelper";

export default class SafetyPlanSelection extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        }
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            checkedItems: [],
            type: ''
        }
    }

    componentDidMount() {
        const type = this.props.navigation.getParam('type');
        this.setState({ type: type });

        if(type === 'cope') {
            readDatabase('*', 'CopingStrategy', this.updateItems)
        } else {
            readDatabase('*', 'WarningSign', this.updateItems)
        }
    }

    updateItems = (items) => {
        this.setState({ items: items.map(item => {
            if(this.state.type === 'cope') {
                return item.copeName
            } else {
                return item.signName
            }
        })});
    };
    // update checklist with items from pre-populated array

    getCheckedItems = (items) => {
        this.setState({
            checkedItems: items.filter(item => item !== undefined)
        });
    };
    // Updates state everytime option is checked/unchecked

    render() {
        return(
            <View style={SPSelectionStyle.viewContainer}>
                <View style={{flex: 1}}>
                    <CustomMultiPicker
                        options={this.state.items}
                        multiple={true} //
                        returnValue={"label"} // label or value
                        callback={this.getCheckedItems} // callback, array of selected items
                        rowBackgroundColor={"#fff"}
                        rowHeight={40}
                        rowRadius={5}
                        iconColor={"#00a2dd"}
                        iconSize={25}
                        itemStyle={SPSelectionStyle.itemStyle}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                        search={true}
                    />
                </View>
                <TouchableHighlight
                    style={SPSelectionStyle.button}
                    onPress={() => this.props.navigation.navigate('main', {checkedItems: this.state.checkedItems})}
                    underlayColor='#99d9f4'>
                    <Text style={SPSelectionStyle.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const SPSelectionStyle = StyleSheet.create({
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