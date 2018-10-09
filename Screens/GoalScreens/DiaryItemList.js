import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiSelectList from "../../Components/CustomMultiSelectList"

import {readDatabaseArg} from "../../Util/DatabaseHelper";

export default class DiaryItemList extends React.Component {
    static navigationOptions = {
        title: "Diary Items",
    };

    constructor(props) {
        super(props);

        this.state = {
            diaryItems: {},
            checkedItems: [],
            diaryList: []
        }
    }

    componentDidMount() {
        readDatabaseArg("*", "Diary", this.updateDiaryItems, () => console.log("DB read success"), 'where scale is not NULL');
    }
    // read DB for all currently saved diary items

    updateDiaryItems = (diaryItems) => {
        const diaryStruct = {};

        diaryItems.forEach(di => {
            diaryStruct[di.diaryId] = di.diaryName
        });

        this.setState({ diaryItems: diaryStruct, diaryList: diaryItems})
    };
    // function that creates object with diaryId as key and diaryName as value. Then setStates with that object

    getCheckedDiaryItem = (diaryItems) => {
        this.setState({
            checkedItems: diaryItems.filter(di => di !== undefined)
        });
    };
    // Updates state everytime option is checked/unchecked

    render() {
        return(
            <View style={diaryItemStyle.viewContainer}>
                <View style={{flex: 1, marginBottom: 50}}>
                    <CustomMultiSelectList
                        options={this.state.diaryItems}
                        multiple={false} //
                        returnValue={"diaryId"} // label or value
                        callback={this.getCheckedDiaryItem} // callback, array of selected items
                        rowBackgroundColor={"#fff"}
                        rowRadius={5}
                        iconColor={"#00a2dd"}
                        iconSize={25}
                        itemStyle={diaryItemStyle.itemStyle}
                        search={true}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                        selected={this.props.navigation.getParam('selectedDiaryItems') !== undefined
                            ? this.props.navigation.getParam('selectedDiaryItems').map(di => di.diaryId.toString())
                            : undefined}
                    />
                </View>
                <TouchableHighlight
                    style={diaryItemStyle.button}
                    onPress={this.props.navigation.getParam('edit')
                        ? () => this.props.navigation.navigate('editGoal', {checkedItem: {diaryId: Number(this.state.checkedItems[0]), diaryName: this.state.diaryItems[this.state.checkedItems[0]]}})
                        : () => {
                            const selectedObject = this.state.diaryList.find(di => di.diaryId === Number(this.state.checkedItems[0]));

                            this.props.navigation.navigate('newGoal', {
                                checkedItem: {
                                    diaryId: Number(this.state.checkedItems[0]), diaryScale: selectedObject.scale, diaryName: this.state.diaryItems[this.state.checkedItems[0]]
                                }
                            })
                        }}
                    underlayColor='#99d9f4'>
                    <Text style={diaryItemStyle.buttonText}>Done</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const diaryItemStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
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