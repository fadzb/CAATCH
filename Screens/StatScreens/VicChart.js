import React from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator } from 'react-native';
import {TabStyles} from "../../Styles/TabStyles";
import Moment from 'moment'
import {readDatabaseArg} from "../../Util/DatabaseHelper";

import { VictoryChart, VictoryGroup, VictoryLine, VictoryTheme } from 'victory-native';

export default class VicChart extends React.Component {
    static navigationOptions = {
        title: 'Charts'
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            weekDate: Moment().subtract(6,'d').format('YYYY-MM-DD'),
            monthDate: Moment().subtract(1,'M').format('YYYY-MM-DD'),
            sixMonthDate: Moment().subtract(6,'M').format('YYYY-MM-DD'),
            skillData: [],
            selectedSkill: 'Use Drugs',
            graphData: [{x: 0, y: 0}, {x: 0, y: 0}],
            dateRange: [],
            graphReady: false
        }
    }

    componentDidMount() {
        this.getSkillData();
    }

    getSkillData = () => {
        const columns = "s.diaryDate, ds.rating, d.diaryName";
        const today = Moment().format("YYYY-MM-DD");

        this.getDateRange();

        readDatabaseArg(columns,
            "DiarySession",
            this.handleSkillData,
            undefined,
            " as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId" +
            " where DATE(diaryDate) between Date('" + this.state.weekDate + "') and Date('" + today + "') and diaryType = 'Feeling'");
    };

    handleSkillData = res => this.setState({skillData: res}, () => this.transformForGraph(this.state.selectedSkill));

    transformForGraph = selectedSkill => {
        let trackGraph = [];


        const skillRatings = this.state.skillData.filter(sk => sk.diaryName === selectedSkill).map(rating => ({...rating, diaryDate: Moment(rating.diaryDate).format("DD/MM")}));
        const skillDates = skillRatings.map(skr => skr.diaryDate);

        this.state.dateRange.forEach(date => {
            trackGraph.push({x: date, y: 0});

            if(skillDates.includes(date)) {
                const trackArr = skillRatings.filter(sk => sk.diaryDate === date).map(tr => tr.rating);

                const avgRating = trackArr.reduce((total, rating) => total + rating) / trackArr.length;
                const skillObjIndex = trackGraph.findIndex(e => e.x === date);

                trackGraph[skillObjIndex].y = avgRating
            }
        });
        
        this.setState({graphData: trackGraph}, this.setState({graphReady: true}))
    };

    getDateRange = () => {
        const today = Moment().format("YYYY-MM-DD");
        let weekAgo = Moment().subtract(6,'d').format('YYYY-MM-DD');
        let dateArray = [];

        while(today >= weekAgo) {
            dateArray.push(Moment(weekAgo).format("DD/MM"));
            weekAgo = Moment(weekAgo).add(1, 'd').format('YYYY-MM-DD');
        }

        this.setState({dateRange: dateArray})
    };

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                {this.state.graphReady ?
                <VictoryChart
                    theme={VictoryTheme.material}
                    categories={{
                        y: ["1", "2", "3", "4", "5"],
                        x: this.state.graphData.map(gr => gr.x)
                    }}
                >
                        <VictoryLine
                            style={{
                                data: { stroke: "#c43a31", strokeWidth: 3 },
                                parent: { border: "4px solid #ccc"}
                            }}
                            data={this.state.graphData}
                            domain={{x: [0, 5], y: [0, 5]}}

                        />
                </VictoryChart> :
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

