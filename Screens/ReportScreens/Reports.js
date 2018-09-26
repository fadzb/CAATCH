import React from 'react';
import {Button, ScrollView, StyleSheet, Text, View, TextInput, ActivityIndicator} from 'react-native';
import {readDatabaseArg} from "../../Util/DatabaseHelper";
import Moment from 'moment'

const timeFrames = {
    weekDate: Moment().subtract(6,'d').format('YYYY-MM-DD'),
    monthDate: Moment().subtract(29,'d').format('YYYY-MM-DD'),
    sixMonthDate: Moment().subtract(6,'months').format('YYYY-MM-DD'),
    yearDate: Moment().subtract(12,'months').format('YYYY-MM-DD'),
};
// Time periods in Moment format that available in chart selection

export default class Reports extends React.Component {
    static navigationOptions = {
        title: 'Reports'
    };

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false
        }
    }

    componentDidMount() {
        this.getDiaryData()
    }

    getDiaryData = () => {
        const columns = "s.diaryDate, ds.rating, d.diaryName";
        const today = Moment().format("YYYY-MM-DD");

        readDatabaseArg(columns,
            "DiarySession",
            res => this.setState({data: res}),
            undefined,
            " as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId" +
            " where DATE(diaryDate) between Date('" + timeFrames.monthDate + "') and Date('" + today + "') and diaryType = 'Feeling' or diaryType = 'General'");
    };
    // retrieve ratings for diary items up to 30 days ago

    updateReport = () => {
        this.setState({loading: true});

        fetch('http://192.168.0.101:3000/pdf', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: this.state.data,
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .then(() => {
                this.setState({loading: false});

                this.props.navigation.navigate('pdf')
            })
            .catch(err => console.log(err))
    };
    // for android need to change 'localhost' to local IP address of server -> System Preferences (Network)

    updateText = text => {
        this.setState({text: text})
    };

    render() {
        return (
            <View style={reportStyle.container}>
                <View style={{marginTop: 30}}>
                    <Button title="Generate PDF" onPress={this.updateReport}/>
                </View>
                {this.state.loading && <View style={{paddingTop: 40}}>
                    <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    /></View>}
            </View>
        );
    }
}

const reportStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },

});

