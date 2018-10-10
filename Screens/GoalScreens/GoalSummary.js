import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableHighlight,
  Linking,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Moment from 'moment';
import { CardListItem } from '../../Components/CardListItem';
import { deleteDatabaseRow, readDatabaseArg, updateDatabaseArgument } from '../../Util/DatabaseHelper';
import { Icons } from '../../Constants/Icon';
import { openSafetyPlanItem, latestSafetyPlanItem } from '../../Util/Usage';
import { PressableIcon } from '../../Components/PressableIcon';
import { getGoal, getHelper } from '../../Redux/actions';
import store from '../../Redux/store';
import { DbTableNames, UsageFunctionIds, DbPrimaryKeys } from '../../Constants/Constants';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryGroup, VictoryScatter } from 'victory-native';

const timeFrames = {
  weekDate: Moment().subtract(6, 'd').format('YYYY-MM-DD'),
  monthDate: Moment().subtract(29, 'd').format('YYYY-MM-DD'),
  sixMonthDate: Moment().subtract(6, 'months').format('YYYY-MM-DD'),
  yearDate: Moment().subtract(12, 'months').format('YYYY-MM-DD'),
};
// Time periods in Moment format that available in chart selection

const periods = {
  week: 'Past 7 days',
  month: 'Past 30 days',
  sixMonth: 'Past 6 months',
  year: 'Past year',
};
// String representations of above selections

const USED_SKILLS = 'Used Skills';
const SLEEP_SCALE = 'Sleep Scale';
const MOOD_SCALE = 'Mood Scale';

export default class GoalSummary extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      graphReady: false,
      diaryData: [],
      graphData: [],
      goalArray: [],
      dateRange: [],
      selectedTimeFrame: periods.week,
    };
  }

  componentDidMount() {
    this.getDiaryData();
  }

  formatDate = (date) => {
    return Moment(date).format('LLL');
  };

  getDiaryData = () => {
    const columns = 's.diaryDate, ds.rating, d.diaryName, d.defaultRating, d.minRating';
    const today = Moment().format('YYYY-MM-DD');

    readDatabaseArg(
      columns,
      'DiarySession',
      this.handleDiaryData,
      undefined,
      ' as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId' +
        " where DATE(diaryDate) between Date('" +
        timeFrames.monthDate +
        "') and Date('" +
        today +
        "') and d.diaryid = " +
        this.props.navigation.getParam('diaryId')
    );
  };
  // retrieve ratings for diary items up to 30 days ago

  handleDiaryData = (res) => {
    this.setState({ diaryData: res }, () => this.getDateRange(this.state.selectedTimeFrame, this.transformFunction));
  };

  transformFunction = () => {
    let trackGraph = [];
    let goalArr = [];

    const diaryId = this.props.navigation.getParam('diaryId');

    const diaryRatings = this.state.diaryData.map((rating) => ({
      ...rating,
      diaryDate: Moment(rating.diaryDate).format('YYYY-MM-DD'),
    }));
    const diaryDates = diaryRatings.map((dr) => dr.diaryDate);

    this.state.dateRange.forEach((date) => {
      trackGraph.push({
        x: date,
        y: this.props.navigation.getParam('defaultRating'),
      });

      goalArr.push({
        x: date,
        y: Number(this.props.navigation.getParam('rating')),
      });

      if (diaryDates.includes(date)) {
        const trackArr = diaryRatings.filter((sk) => sk.diaryDate === date).map((tr) => tr.rating);

        const avgRating = trackArr.reduce((total, rating) => total + rating) / trackArr.length;
        const diaryObjIndex = trackGraph.findIndex((e) => e.x === date);

        trackGraph[diaryObjIndex].y = avgRating;
      }
    });

    this.setState(
      {
        graphData: trackGraph.map((tr) => ({ ...tr, x: Moment(tr.x).format('DD/MM') })),
        goalArray: goalArr.map((tr) => ({ ...tr, x: Moment(tr.x).format('DD/MM') })),
      },
      this.setState({ graphReady: true })
    );
    // function for mapping diary data for chart analysis. If days has multiple entries, average is taken
  };

  getDateRange = (timeRange, func) => {
    let dateArray = [];
    const today = Moment().format('YYYY-MM-DD');

    if (timeRange === periods.week) {
      let weekAgo = timeFrames.weekDate;

      while (today >= weekAgo) {
        dateArray.push(Moment(weekAgo).format('YYYY-MM-DD'));
        weekAgo = Moment(weekAgo).add(1, 'd').format('YYYY-MM-DD');
      }
    } else if (timeRange === periods.month) {
      let monthAgo = timeFrames.monthDate;

      while (today >= monthAgo) {
        dateArray.push(Moment(monthAgo).format('YYYY-MM-DD'));
        monthAgo = Moment(monthAgo).add(1, 'd').format('YYYY-MM-DD');
      }
    } else if (timeRange === periods.sixMonth) {
      for (let numMonths = 5; numMonths >= 0; numMonths--) {
        dateArray.push(Moment().subtract(numMonths, 'months').format('MM/YY'));
      }
    } else {
      for (let numMonths = 11; numMonths >= 0; numMonths--) {
        dateArray.push(Moment().subtract(numMonths, 'months').format('MM/YY'));
      }
    }

    this.setState({ dateRange: dateArray }, func);
  };
  // used to calculate date ranges for each time frame selection.

  getCompleteList = () => {
    readDatabaseArg(
      'g.*, d.diaryName, d.diaryId, d.scale',
      DbTableNames.goal,
      this.updateGoals,
      () => console.log('DB read success'),
      ' as g inner join ' + DbTableNames.diary + ' as d' + ' on g.diaryId = d.diaryId'
    );
  };
  // fetching all goals that do not have a deleted date

  updateGoals = (goals) => {
    store.dispatch(getGoal(goals));
    // dispatching total list of goal names from DB to global redux store
  };

  editGoal = (id, name, desc, rating, diaryId, diaryName) => {
    this.props.navigation.push('editGoal', {
      id: id,
      name: name,
      desc: desc,
      rating: rating,
      diaryId: diaryId,
      diaryName: diaryName,
    });
  };

  deleteGoal = (id) => {
    deleteDatabaseRow(DbTableNames.goal, 'where goalId = ' + id, (res) => {
      this.getCompleteList();

      this.props.navigation.pop();
    });
  };
  // deleting pressed goal and updating redux global store to re-render the strategy list

  showAlert = (id) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteGoal(id), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  getYDomain = () => {
    return [this.props.navigation.getParam('minRating'), this.props.navigation.getParam('scale')];
  };
  // setting the min and max values expected for each type of diary item

  getYCategorey = () => {
    const scale = this.props.navigation.getParam('scale');
    let categoryArr = [];

    for (let i = 1; i <= scale; i++) {
      categoryArr.push(i.toString());
    }

    return categoryArr;
  };
  // setting Y axis labels for various diary types

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.graphReady ? (
          <Container style={goalSummaryStyle.viewContainer}>
            <Content>
              <Left>
                <Body>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 20,
                      marginTop: 20,
                    }}
                  >
                    <View style={{ flex: 4, paddingRight: 9 }}>
                      <Text>{this.props.navigation.getParam('name')}</Text>
                      <Text note>{this.formatDate(this.props.navigation.getParam('date'))}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                      <PressableIcon
                        iconName={Icons.edit + '-outline'}
                        size={35}
                        onPressFunction={() =>
                          this.editGoal(
                            this.props.navigation.getParam('id'),
                            this.props.navigation.getParam('name'),
                            this.props.navigation.getParam('desc'),
                            this.props.navigation.getParam('rating'),
                            this.props.navigation.getParam('diaryId'),
                            this.props.navigation.getParam('diaryName')
                          )
                        }
                      />
                      <PressableIcon
                        iconName={Icons.delete + '-outline'}
                        size={35}
                        onPressFunction={() => this.showAlert(this.props.navigation.getParam('id'))}
                        color="red"
                      />
                    </View>
                  </View>
                </Body>
              </Left>
              <Body>
                <VictoryChart
                  height={Dimensions.get('window').height * 0.57}
                  theme={VictoryTheme.material}
                  categories={{
                    y: this.getYCategorey(),
                    x: this.state.graphData.map((gr) => gr.x),
                  }}
                >
                  <VictoryAxis fixLabelOverlap={true} />
                  <VictoryAxis dependentAxis fixLabelOverlap={true} />
                  <VictoryGroup data={this.state.graphData} domain={{ y: this.getYDomain() }}>
                    <VictoryLine
                      style={{
                        data: { stroke: '#c43a31', strokeWidth: 1.5 },
                      }}
                      animate={{
                        onExit: {
                          duration: 0,
                        },
                      }}
                      interpolation="monotoneX"
                      // interpolation="natural"
                    />
                    <VictoryScatter style={{ data: { fill: '#c43a31' } }} size={2} />
                  </VictoryGroup>
                  <VictoryLine
                    data={this.state.goalArray}
                    style={{
                      data: { stroke: 'blue', strokeWidth: 2.5 },
                    }}
                  />
                </VictoryChart>
                <View style={{ alignSelf: 'flex-start', flex: 1, marginHorizontal: 20 }}>
                  <Text style={goalSummaryStyle.text}>
                    Target Rating:{' '}
                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                      {this.props.navigation.getParam('rating')}
                    </Text>
                  </Text>
                </View>
              </Body>
            </Content>
          </Container>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
    );
  }
}

const goalSummaryStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  text: {
    paddingTop: 20,
  },

  urlText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },

  linkText: {
    fontWeight: 'bold',
    padding: 10,
  },

  linkListContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    alignSelf: 'stretch',
    padding: 5,
    borderRadius: 7,
    marginTop: 25,
  },
});
