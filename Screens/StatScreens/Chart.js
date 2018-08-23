import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, WebView, Dimensions } from 'react-native';
import { Icons } from '../../Constants/Icon';
import { LineChart } from 'react-native-chart-kit';
import Moment from 'moment';

import { TabStyles } from '../../Styles/TabStyles';
import { readDatabaseArg } from '../../Util/DatabaseHelper';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [0, 3, 1, 5, 4, 2],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#fff4e6',
  backgroundGradientTo: '#ffeacc',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export default class Chart extends React.Component {
  static navigationOptions = {
    title: 'Charts',
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      weekDate: Moment().subtract(6, 'd').format('YYYY-MM-DD'),
      monthDate: Moment().subtract(1, 'M').format('YYYY-MM-DD'),
      sixMonthDate: Moment().subtract(6, 'M').format('YYYY-MM-DD'),
      skillData: [],
      selectedSkill: 'Use Drugs',
      graphData: { labels: [], datasets: [{ data: [] }] },
      dateRange: [],
    };
  }

  componentDidMount() {
    this.getSkillData();
  }

  getSkillData = () => {
    const columns = 's.diaryDate, ds.rating, d.diaryName';
    const today = Moment().format('YYYY-MM-DD');

    this.getDateRange();

    readDatabaseArg(
      columns,
      'DiarySession',
      this.handleSkillData,
      undefined,
      ' as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId' +
        " where DATE(diaryDate) between Date('" +
        this.state.weekDate +
        "') and Date('" +
        today +
        "') and diaryType = 'Feeling'"
    );
  };

  handleSkillData = (res) => this.setState({ skillData: res }, () => this.transformForGraph(this.state.selectedSkill));

  transformForGraph = (selectedSkill) => {
    let trackGraph = { labels: [], datasets: [{ data: [] }] };

    const skillRatings = this.state.skillData
      .filter((sk) => sk.diaryName === selectedSkill)
      .map((rating) => ({ ...rating, diaryDate: Moment(rating.diaryDate).format('DD/MM') }));
    const skillDates = skillRatings.map((skr) => skr.diaryDate);

    this.state.dateRange.forEach((date) => {
      trackGraph.labels.push(date);

      if (!skillDates.includes(date)) {
        trackGraph.datasets[0].data.push(0);
      } else {
        const trackArr = skillRatings.filter((sk) => sk.diaryDate === date).map((tr) => tr.rating);

        trackGraph.datasets[0].data.push(trackArr.reduce((total, rating) => total + rating) / trackArr.length);
      }
    });

    this.setState({ graphData: trackGraph });
  };

  getDateRange = () => {
    const today = Moment().format('YYYY-MM-DD');
    let weekAgo = Moment().subtract(6, 'd').format('YYYY-MM-DD');
    let dateArray = [];

    while (today >= weekAgo) {
      dateArray.push(Moment(weekAgo).format('DD/MM'));
      weekAgo = Moment(weekAgo).add(1, 'd').format('YYYY-MM-DD');
    }

    this.setState({ dateRange: dateArray });
  };

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <LineChart
          data={this.state.graphData}
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height / 2.5}
          chartConfig={chartConfig}
        />
      </View>
    );
  }
}

const chartStyle = StyleSheet.create({});
