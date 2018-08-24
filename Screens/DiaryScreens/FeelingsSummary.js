import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Moment from 'moment';
import {SelectionRow} from "../../Components/SelectionRow";
import {Icons} from "../../Constants/Icon";
import store from "../../Redux/store"
import {readDatabaseArg} from "../../Util/DatabaseHelper";

export default class FeelingsSummary extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const diaryDate = store.getState().diary.date;

        return {
            title: 'Archive' + " " + Moment(diaryDate).format('DD.MM.YYYY'),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            feelings: [],
        }
    }

    componentDidMount() {
        const diaryDate = store.getState().diary.date;

        const selectedDate = Moment(diaryDate).format("YYYY-MM-DD");
        const columns = "d.sessionId, s.diaryDate, di.scale, s.dateEntered, d.diaryId, d.rating, di.diaryType, di.diaryName, di.info";

        readDatabaseArg(columns,
            "DiarySession",
            this.transformResults,
            undefined,
            " as d inner join Session as s on d.sessionId = s.sessionId inner join Diary as di on d.diaryId = di.diaryId" +
            " where DATE(diaryDate) = '" + selectedDate + "' and diaryType = 'Feeling'");
    }
    // query DB for previous feeling sessions on this date

    transformResults = res => {
        let resultObj = {};

        res.forEach((r, i, arr) =>  {
            if(resultObj[r.sessionId] === undefined) {
                resultObj[r.sessionId] = [r]
            } else {
                resultObj[r.sessionId].push(r)
            }
        });

        this.setState({feelings: Object.keys(resultObj).map(k => resultObj[k])})
    };
    // convert results from DB into desired array format for FlatList component

    renderItem = ({item}) => (
        <View style={feelingSummaryStyle.listContainer}>
            <SelectionRow
                name= {Moment(item[0].dateEntered).format('LLL')}
                onPress={() => this.props.navigation.push('feelingsSession', {resultsArr: item})}
                icon={Icons.feelings}
            />
        </View>
    );

    render() {
        return (
            <View style={feelingSummaryStyle.viewContainer}>
                <FlatList
                    data={this.state.feelings}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const feelingSummaryStyle = StyleSheet.create({
    listContainer: {
        alignSelf: 'stretch'
    },

    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
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