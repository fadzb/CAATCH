import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Moment from 'moment';
import {SelectionRow} from "../../Components/SelectionRow";
import {Icons} from "../../Constants/Icon";
import store from "../../Redux/store"
import {readDatabaseArg} from "../../Util/DatabaseHelper";
import {DbTableNames} from "../../Constants/Constants";
import {DateChanger} from "../../Components/DateChanger";
import {updateDate} from "../../Redux/actions";

export default class SafetyPlanSummary extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Archive',
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            safetyPlanItem: [],
            type: this.props.navigation.getParam('type'),
            originalDate: store.getState().diary.date
        }
    }

    componentWillUnmount() {
        store.dispatch(updateDate(Moment(this.state.originalDate)));
    }
    // set global diary date to original dat on back press

    componentDidMount() {
        this.getArchive()
    }
    // query DB for previous sp sessions on this date

    backDay = () => {
        const newDate = Moment(store.getState().diary.date).subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss.SSS');

        store.dispatch(updateDate(Moment(newDate)));
        this.getArchive()
    };

    forwardDay = () => {
        const newDate = Moment(store.getState().diary.date).add(1, 'd').format('YYYY-MM-DD HH:mm:ss.SSS');

        store.dispatch(updateDate(Moment(newDate)));
        this.getArchive()
    };

    getArchive = () => {
        const type = this.props.navigation.getParam('type');

        const diaryDate = store.getState().diary.date;

        const selectedDate = Moment(diaryDate).format("YYYY-MM-DD");
        const columns = `d.sessionId, s.diaryDate, ${type === 'cope' ? 'd.copeId' : 'd.signId'}, s.dateEntered, ${type === 'cope' ? 'di.copeName' : 'di.signName'}`;

        if(type === 'cope') {
            readDatabaseArg(columns,
                DbTableNames.copeSession,
                this.transformResults,
                undefined,
                " as d inner join " + DbTableNames.session + " as s on d.sessionId = s.sessionId inner join " + DbTableNames.copingStrategy + " as di on d.copeId = di.copeId" +
                " where DATE(diaryDate) = '" + selectedDate + "'");
        } else {
            readDatabaseArg(columns,
                DbTableNames.signSession,
                this.transformResults,
                undefined,
                " as d inner join " + DbTableNames.session + " as s on d.sessionId = s.sessionId inner join " + DbTableNames.warningSign + " as di on d.signId = di.signId" +
                " where DATE(diaryDate) = '" + selectedDate + "'");
        }
    };

    transformResults = res => {
        let resultObj = {};

        res.forEach((r, i, arr) =>  {
            if(resultObj[r.sessionId] === undefined) {
                resultObj[r.sessionId] = [r]
            } else {
                resultObj[r.sessionId].push(r)
            }
        });

        this.setState({safetyPlanItem: Object.keys(resultObj).map(k => resultObj[k])})
    };
    // convert results from DB into desired array format for FlatList component

    renderItem = ({item}) => (
        <View style={spSummaryStyle.listContainer}>
            <SelectionRow
                name= {Moment(item[0].dateEntered).format('LLL')}
                onPress={() => this.props.navigation.push('spSession', {resultsArr: item, type: this.state.type})}
                icon={(this.state.type === 'cope' ? Icons.copingStrategy : Icons.warningSign) + '-outline'}
            />
        </View>
    );

    render() {
        return (
            <View style={spSummaryStyle.viewContainer}>
                <DateChanger
                    title={Moment(store.getState().diary.date).format('LL')}
                    forwardFunction={this.forwardDay}
                    backFunction={this.backDay}
                />
                <FlatList
                    data={this.state.safetyPlanItem}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const spSummaryStyle = StyleSheet.create({
    listContainer: {
        alignSelf: 'stretch'
    },

    viewContainer: {
        flex: 1,
    },

    buttonText: {
        fontSize: 18,
        color: '#007AFF',
        alignSelf: 'center',
    },

    button: {
        height: 36,
        backgroundColor: '#fff',
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 8,
        margin: 15,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
});