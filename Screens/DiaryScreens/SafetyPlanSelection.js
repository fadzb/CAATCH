import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, ActivityIndicator } from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";
import {readDatabaseArg, updateDatabase, deleteDatabaseRow} from "../../Util/DatabaseHelper";
import Moment from 'moment';
import store from "../../Redux/store";
import {DbTableNames} from "../../Constants/Constants";

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
            previouslyCheckedItems: [],
            type: '',
            sessionDate: new Date(),
            historyChecked: false,
        }
    }

    componentDidMount() {
        const type = this.props.navigation.getParam('type');
        this.setState({ type: type });

        if(type === 'cope') {
            readDatabaseArg('*', DbTableNames.copingStrategy, this.updateItems, undefined, 'where dateDeleted is NULL')
        } else {
            readDatabaseArg('*', DbTableNames.warningSign, this.updateItems, undefined, 'where dateDeleted is NULL')
        }
    }
    // get safetyplan items based on their type passed down through navigation props

    getPreviouslyCheckedItems = (safetyPlanType) => {
        const diaryDate = store.getState().diary.date;
        const selectedDate = Moment(diaryDate).format("YYYY-MM-DD");

        if(safetyPlanType === 'cope') {
            const columns = "c.copeId, c.sessionId";

            readDatabaseArg(columns,
                DbTableNames.copeSession,
                this.setPreviouslyCheckedItems,
                undefined,
                " as c inner join " + DbTableNames.session + " as s on c.sessionId = s.sessionId where DATE(diaryDate) = '" + selectedDate + "'");
        } else {
            const columns = "si.signId, si.sessionId";

            readDatabaseArg(columns,
                DbTableNames.signSession,
                this.setPreviouslyCheckedItems,
                undefined,
                " as si inner join " + DbTableNames.session + " as s on si.sessionId = s.sessionId where DATE(diaryDate) = '" + selectedDate + "'");
        }
    };
    // get previously saved items for selected date

    setPreviouslyCheckedItems = results => {
        if(this.state.type === 'cope') {
            this.setState({previouslyCheckedItems: results} , () => this.setState({historyChecked: true}))
        } else {
            this.setState({previouslyCheckedItems: results}, () => this.setState({historyChecked: true}))
        }
    };

    updateItems = (items) => {
        const testCope = this.state.type === 'cope';
        let struct = {};

        if(testCope) {
            items.forEach(c => struct[c.copeId] = c.copeName)
        } else {
            items.forEach(s => struct[s.signId] = s.signName)
        }

        this.setState({ items: struct },
            testCope ? this.getPreviouslyCheckedItems('cope') : this.getPreviouslyCheckedItems('sign'));
    };
    // update checklist with items from pre-populated array

    getCheckedItems = (items) => {
        this.setState({
            checkedItems: items.filter(item => item !== undefined)
        });
    };
    // Updates state everytime option is checked/unchecked

    createSession = () => {
        updateDatabase(DbTableNames.session,
            [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), store.getState().diary.date],
            ["dateEntered", "diaryDate"],
            undefined,
            (res) => this.handleSave(res.insertId))
    };
    // when user presses save - create session in DB with date recorded at screen opening

    handleSave = (sessionId) => {
        if(this.state.type ==='cope') {
            this.state.checkedItems.forEach(t => {
                updateDatabase(DbTableNames.copeSession,
                    [sessionId, t],
                    ['sessionId', 'copeId']
                )
            });

            if(this.state.previouslyCheckedItems.length > 0) {
                this.state.previouslyCheckedItems.forEach(prev => {
                    deleteDatabaseRow(DbTableNames.copeSession, 'where sessionId = ' + prev.sessionId)
                })
            }
        } else {
            this.state.checkedItems.forEach(t => {
                updateDatabase(DbTableNames.signSession,
                    [sessionId, t],
                    ['sessionId', 'signId']
                )
            });

            if(this.state.previouslyCheckedItems.length > 0) {
                this.state.previouslyCheckedItems.forEach(prev => {
                    deleteDatabaseRow(DbTableNames.signSession, 'where sessionId = ' + prev.sessionId)
                })
            }
        }

        this.props.navigation.pop();
    };

    render() {
        return(
            <View style={SPSelectionStyle.viewContainer}>
                {this.state.historyChecked ? <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <CustomMultiPicker
                            options={this.state.items}
                            multiple={true} //
                            returnValue={this.state.type === 'cope' ? "copeId" : "signId"} // label or value
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
                            selected={this.state.type === 'cope' ? this.state.previouslyCheckedItems.map(r => r.copeId.toString())
                            : this.state.previouslyCheckedItems.map(r => r.signId.toString())}
                        />
                    </View>
                    <TouchableHighlight
                        style={SPSelectionStyle.button}
                        onPress={this.createSession}
                        underlayColor='#99d9f4'>
                        <Text style={SPSelectionStyle.buttonText}>Save</Text>
                    </TouchableHighlight>
                </View> :
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>}
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