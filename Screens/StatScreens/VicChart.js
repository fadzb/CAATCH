import React from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, Modal, TouchableHighlight } from 'react-native';
import { TabStyles } from '../../Styles/TabStyles';
import Moment from 'moment';
import { readDatabase, readDatabaseArg } from '../../Util/DatabaseHelper';
import CustomMultiPicker from 'react-native-multiple-select-list';
import { CustomSelectionRow } from '../../Components/CustomSelectionRow';
import { Icons } from '../../Constants/Icon';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryGroup, VictoryScatter } from 'victory-native';
import { PressableIcon } from '../../Components/PressableIcon';

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

export default class VicChart extends React.Component {
  static navigationOptions = {
    title: 'Charts',
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      diaryData: [],
      oldDiaryData: [],
      selectedDiaryItem: 'Use Drugs',
      compareDiaryItem: 'None',
      graphData: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      compareGraphData: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      dateRange: [],
      graphReady: false,
      modalVisible: false,
      selectedTimeFrame: periods.week,
      diaryList: {},
      compareDiaryList: {},
      timeFrameSelected: false,
      comparisonSelected: false,
      checkedItemTime: periods.week,
      checkedItemDiary: 'Use Drugs',
      checkedItemCompare: 'None',
    };
  }

  componentDidMount() {
    this.getDiaryData();

    this.getDiaryList();
  }

  getDiaryList = () => {
    readDatabase('*', 'Diary', (res) => {
      let list = {};

      const scaleList = res.filter((di) => di.diaryType !== 'Skill' && di.diaryName !== 'Notes');

      scaleList.forEach((d, i) => (list[i] = d.diaryName));

      let compareList = {};

      scaleList.forEach((d, i) => {
        if (d.diaryName === USED_SKILLS) {
          compareList[d.diaryName] = { '0': 'None' };
        } else {
          compareList[d.diaryName] = scaleList
            .filter((t) => t.diaryType === d.diaryType)
            .reduce((obj, r, i) => {
              if (Object.keys(obj).length === 0) {
                obj['0'] = 'None';
              }

              if (r.diaryName !== d.diaryName && r.diaryName !== USED_SKILLS) {
                obj = { ...obj, [i + 1]: r.diaryName };
              }

              return obj;
            }, {});
        }
      });

      this.setState({ diaryList: list, compareDiaryList: compareList });
    });
  };
  // List of diary items available for analysis in line chart form

  toggleModal = (bool) => {
    this.setState({ modalVisible: bool });
  };

  getDiaryData = () => {
    const columns = 's.diaryDate, ds.rating, d.diaryName';
    const today = Moment().format('YYYY-MM-DD');

    readDatabaseArg(
      columns,
      'DiarySession',
      this.handleDiaryData,
      this.getOldDiaryData,
      ' as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId' +
        " where DATE(diaryDate) between Date('" +
        timeFrames.monthDate +
        "') and Date('" +
        today +
        "') and diaryType = 'Feeling' or diaryType = 'General'"
    );
  };
  // retrieve ratings for diary items up to 30 days ago

  getOldDiaryData = () => {
    const columns = "diaryDate, diaryName, avg(rating) as 'rating'";
    const today = Moment().format('YYYY-MM-DD');
    const table =
      "(Select strftime('%m/%Y',s.diaryDate) as 'diaryDate', ds.rating, d.diaryName FROM DiarySession as ds \n" +
      'inner join Diary as d on ds.diaryId = d.diaryId \n' +
      'inner join Session as s on ds.sessionId = s.sessionId \n' +
      "where DATE(diaryDate) between Date('" +
      timeFrames.yearDate +
      "') and Date('" +
      today +
      "') and diaryType = 'Feeling' or diaryType = 'General')";

    readDatabaseArg(
      columns,
      table,
      (res) => this.setState({ oldDiaryData: res }),
      undefined,
      'group by diaryName, diaryDate'
    );
  };
  // retrieve ratings for diary items up for last 12 months. Monthly average is used for charts

  handleDiaryData = (res) => {
    this.setState({ diaryData: res }, () => {
      this.transformForGraph(this.state.selectedDiaryItem, periods.week);
    });
  };

  transformForGraph = (selectedDiaryItem, timeRange, cache, callback) => {
    if (!cache) {
      this.getDateRange(timeRange, () => {
        this.transformFunction(selectedDiaryItem, 'graphData');

        if (callback) {
          callback();
        }
      });
    } else {
      this.transformFunction(selectedDiaryItem, 'graphData');
    }
  };
  // Only call getDateRange function if a new time period has been selected i.e. not for when just changing diary item

  transformFunction = (selectedDiaryItem, updateState) => {
    let trackGraph = [];

    if (this.state.selectedTimeFrame === periods.week || this.state.selectedTimeFrame === periods.month) {
      const diaryRatings = this.state.diaryData
        .filter((sk) => sk.diaryName === selectedDiaryItem)
        .map((rating) => ({
          ...rating,
          diaryDate: Moment(rating.diaryDate).format('YYYY-MM-DD'),
        }));
      const diaryDates = diaryRatings.map((skr) => skr.diaryDate);

      this.state.dateRange.forEach((date) => {
        trackGraph.push({
          x: date,
          y: selectedDiaryItem === SLEEP_SCALE || selectedDiaryItem === MOOD_SCALE ? 3 : 0,
        });

        if (diaryDates.includes(date)) {
          const trackArr = diaryRatings.filter((sk) => sk.diaryDate === date).map((tr) => tr.rating);

          const avgRating = trackArr.reduce((total, rating) => total + rating) / trackArr.length;
          const diaryObjIndex = trackGraph.findIndex((e) => e.x === date);

          trackGraph[diaryObjIndex].y = avgRating;
        }
      });

      this.setState(
        { [updateState]: trackGraph.map((tr) => ({ ...tr, x: Moment(tr.x).format('DD/MM') })) },
        this.setState({ graphReady: true })
      );

      // function for mapping diary data for chart analysis. If days has multiple entries, average is taken
    } else {
      const diaryRatings = this.state.oldDiaryData
        .filter((sk) => sk.diaryName === selectedDiaryItem)
        .map((rating) => ({
          ...rating,
          diaryDate: rating.diaryDate.slice(0, 3) + rating.diaryDate.slice(5),
        }));
      const diaryDates = diaryRatings.map((skr) => skr.diaryDate);

      this.state.dateRange.forEach((date) => {
        trackGraph.push({
          x: date,
          y: selectedDiaryItem === SLEEP_SCALE || selectedDiaryItem === MOOD_SCALE ? 3 : 0,
        });

        if (diaryDates.includes(date)) {
          const trackArr = diaryRatings.filter((sk) => sk.diaryDate === date).map((tr) => tr.rating);
          const diaryObjIndex = trackGraph.findIndex((e) => e.x === date);

          trackGraph[diaryObjIndex].y = trackArr[0];
        }
      });

      this.setState({ [updateState]: trackGraph }, this.setState({ graphReady: true }));

      // function for mapping old(6 - 12 months) diary data for chart analysis
    }
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
  // used to calculate date ranges for each time frame selection. POSSIBLY MOVE TO COMPONENT DID MOUNT

  handleSelection = (item) => {
    if (this.state.timeFrameSelected) {
      this.setState({
        checkedItemTime: item[0],
      });
    } else if (this.state.comparisonSelected) {
      this.setState({
        checkedItemCompare: item[0],
      });
    } else {
      this.setState({
        checkedItemDiary: item[0],
      });
    }
  };
  // update state as boxes are ticked in either selection list

  handleModalClose = () => {
    this.toggleModal(false);

    this.setState({ timeFrameSelected: false, comparisonSelected: false });
  };

  handleFinalSelection = () => {
    if (this.state.checkedItemCompare !== this.state.compareDiaryItem) {
      this.setState({ compareDiaryItem: this.state.checkedItemCompare }, () => {
        this.transformFunction(this.state.compareDiaryItem, 'compareGraphData');
      });
    }

    if (this.state.checkedItemTime !== this.state.selectedTimeFrame) {
      this.setState({ selectedTimeFrame: this.state.checkedItemTime }, () => {
        if (this.state.checkedItemTime === periods.week) {
          this.transformForGraph(this.state.selectedDiaryItem, periods.week, false, () =>
            this.transformFunction(this.state.compareDiaryItem, 'compareGraphData')
          );
        } else if (this.state.checkedItemTime === periods.month) {
          this.transformForGraph(this.state.selectedDiaryItem, periods.month, false, () =>
            this.transformFunction(this.state.compareDiaryItem, 'compareGraphData')
          );
        } else if (this.state.checkedItemTime === periods.sixMonth) {
          this.transformForGraph(this.state.selectedDiaryItem, periods.sixMonth, false, () =>
            this.transformFunction(this.state.compareDiaryItem, 'compareGraphData')
          );
        } else {
          this.transformForGraph(this.state.selectedDiaryItem, periods.year, false, () =>
            this.transformFunction(this.state.compareDiaryItem, 'compareGraphData')
          );
        }
      });
    }

    if (this.state.checkedItemDiary !== this.state.selectedDiaryItem) {
      this.setState({
        selectedDiaryItem: this.state.checkedItemDiary,
        compareDiaryItem: 'None',
        checkedItemCompare: 'None',
      });

      this.transformForGraph(this.state.checkedItemDiary, this.state.selectedTimeFrame, true);
    }

    this.handleModalClose();
  };
  // call the transformGraph function based on what options have been selected

  getYDomain = (diaryItem) => {
    if (diaryItem === USED_SKILLS) {
      return [0, 7];
    } else if (diaryItem === SLEEP_SCALE || diaryItem === MOOD_SCALE) {
      return [1, 5];
    } else {
      return [0, 5];
    }
  };
  // setting the min and max values expected for each type of diary item

  getYCategorey = () => {
    if (this.state.selectedDiaryItem === USED_SKILLS) {
      return ['1', '2', '3', '4', '5', '6', '7'];
    } else {
      return ['1', '2', '3', '4', '5'];
    }
  };
  // setting Y axis labels for various diary types

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        {this.state.graphReady ? (
          <View>
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
              <VictoryGroup data={this.state.graphData} domain={{ y: this.getYDomain(this.state.selectedDiaryItem) }}>
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
              {this.state.compareDiaryItem !== 'None' && (
                <VictoryGroup data={this.state.compareGraphData}>
                  <VictoryLine
                    style={{
                      data: { stroke: 'blue', strokeWidth: 1.5 },
                    }}
                    animate={{
                      onExit: {
                        duration: 0,
                      },
                    }}
                    interpolation="monotoneX"
                    // interpolation="natural"
                  />
                  <VictoryScatter style={{ data: { fill: 'blue' } }} size={2} />
                </VictoryGroup>
              )}
            </VictoryChart>
            <View style={{ flex: 1, marginBottom: 10 }}>
              <CustomSelectionRow
                name="Diary Item"
                icon={Icons.diary + '-outline'}
                iconSize={Dimensions.get('window').height / 20}
                iconContainer={chartStyle.iconContainer}
                selectedText={this.state.selectedDiaryItem}
                onPress={() => this.toggleModal(true)}
                selectedTextStyle={{ color: '#c43a31' }}
                nameStyle={{ fontSize: 16 }}
              />
              <CustomSelectionRow
                name="Time Frame"
                icon={Icons.calendar + '-outline'}
                iconSize={Dimensions.get('window').height / 20}
                iconContainer={chartStyle.iconContainer}
                selectedText={this.state.selectedTimeFrame}
                onPress={() => this.setState({ timeFrameSelected: true }, () => this.toggleModal(true))}
                nameStyle={{ fontSize: 16 }}
              />
              <CustomSelectionRow
                name="Compare"
                icon={Icons.compare + '-outline'}
                iconSize={Dimensions.get('window').height / 20}
                iconContainer={chartStyle.iconContainer}
                selectedText={this.state.compareDiaryItem}
                onPress={() => this.setState({ comparisonSelected: true }, () => this.toggleModal(true))}
                selectedTextStyle={{ color: this.state.compareDiaryItem === 'None' ? '#4d4d4d' : 'blue' }}
                nameStyle={{ fontSize: 16 }}
              />
            </View>
            <Modal
              animationType={'slide'}
              visible={this.state.modalVisible}
              transparent={false}
              onRequestClose={this.handleModalClose}
            >
              <View style={{ flex: 1 }}>
                <View style={chartStyle.closeButton}>
                  <PressableIcon
                    size={45}
                    iconName={Icons.closeModal}
                    color="black"
                    onPressFunction={this.handleModalClose}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, marginBottom: 50 }}>
                    <CustomMultiPicker
                      options={
                        this.state.timeFrameSelected
                          ? periods
                          : this.state.comparisonSelected
                          ? this.state.compareDiaryList[this.state.selectedDiaryItem]
                          : this.state.diaryList
                      }
                      multiple={false} //
                      returnValue={'label'} // label or value
                      callback={this.handleSelection} // callback, array of selected items
                      rowBackgroundColor={'#fff'}
                      rowHeight={40}
                      rowRadius={5}
                      iconColor={'#00a2dd'}
                      iconSize={25}
                      itemStyle={chartStyle.itemStyle}
                      selectedIconName={'ios-checkmark-circle-outline'}
                      unselectedIconName={'ios-radio-button-off-outline'}
                      search={true}
                      selected={
                        this.state.checkedItem
                          ? this.state.checkedItem
                          : this.state.timeFrameSelected
                          ? this.state.selectedTimeFrame
                          : this.state.comparisonSelected
                          ? this.state.compareDiaryItem
                          : this.state.selectedDiaryItem
                      }
                    />
                  </View>
                  <TouchableHighlight
                    style={chartStyle.button}
                    onPress={this.handleFinalSelection}
                    underlayColor="#99d9f4"
                  >
                    <Text style={chartStyle.buttonText}>Done</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
    );
  }
}

const chartStyle = StyleSheet.create({
  itemStyle: {
    borderBottomWidth: 3,
  },

  iconContainer: {
    width: Dimensions.get('window').height / 20,
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    paddingLeft: 25,
    alignItems: 'flex-start',
    marginTop: 15,
  },

  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },

  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
