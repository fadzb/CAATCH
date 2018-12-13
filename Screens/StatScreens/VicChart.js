import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { AppColors, ComponentStyleConst, TabStyles, themeStyles } from '../../Styles/TabStyles';
import Moment from 'moment';
import { readDatabase, readDatabaseArg } from '../../Util/DatabaseHelper';
import CustomMultiPicker from 'react-native-multiple-select-list';
import { CustomSelectionRow } from '../../Components/CustomSelectionRow';
import { Icons } from '../../Constants/Icon';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryGroup, VictoryScatter } from 'victory-native';
import { PressableIcon } from '../../Components/PressableIcon';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppName, DbTableNames } from '../../Constants/Constants';
import CustomMultiSelectList from '../../Components/CustomMultiSelectList';

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

const stepPeriods = {
  week: 'Past 7 days',
  month: 'Past 30 days',
};
// String representations of above selections

const USED_SKILLS = 'Used Skills';
const SLEEP_SCALE = 'Sleep Scale';
const MOOD_SCALE = 'Mood Scale';
const STEPS = 'Steps';

class VicChart extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Charts',
      headerRight: (
        <View style={{ paddingRight: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name={Icons.share}
            size={30}
            onPress={() => params.handleScreenShot()}
            color={ComponentStyleConst.headerRightIconColor}
          />
        </View>
      ),
    };
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      diaryData: [],
      oldDiaryData: [],
      selectedDiaryItem: 'Mood Scale',
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
      emailModalVisible: false,
      selectedTimeFrame: periods.week,
      diaryList: {},
      compareDiaryList: {},
      timeFrameSelected: false,
      comparisonSelected: false,
      checkedItemTime: periods.week,
      checkedItemDiary: 'Mood Scale',
      checkedItemCompare: 'None',
      ratingsInfo: {},
      selectedRecipients: [],
      snapshotFile: '',
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleScreenShot: this.takeScreenShot,
    });

    this.getDiaryList(this.getDiaryData);
  }

  handleEmailSelection = (email) => this.setState({ selectedRecipients: email.filter((e) => e !== undefined) });
  // update selectedRecipients state when new email is selected in multi picker list

  handleFinalEmailSelection = () => {
    if (this.state.selectedRecipients.length > 0) {
      Expo.MailComposer.composeAsync({
        recipients: this.state.selectedRecipients,
        subject: AppName + ' Graph ' + Moment().format('LL'),
        body: 'Hi, please find ' + AppName + ' graph attached.',
        attachments: [this.state.snapshotFile],
      })
        .then((result) => console.log(result))
        .then((res) => this.handleEmailModalClose())
        .catch((err) => console.log(err));
    } else {
      this.notSelectedAlert();
    }
  };
  // open email interface with snapshot attached as png file

  notSelectedAlert = () => {
    Alert.alert(
      'Email Not Selected',
      'Please select and email address from the list',
      [{ text: 'OK', onPress: () => console.log('OK pressed') }],
      { cancelable: false }
    );
  };

  takeScreenShot = () => {
    Expo.takeSnapshotAsync(this.chartView, {
      format: 'png',
      quality: 1,
      result: 'file',
    })
      .then(this.handleEmail)
      .catch((err) => console.log(err));
  };
  // take screenshot of entire screen view and call handleEmail function that sets the resulting file as the snapshotFile state

  handleEmail = (file) => {
    this.setState({ snapshotFile: file, emailModalVisible: true });
  };

  getDiaryList = (func) => {
    readDatabase('*', DbTableNames.diary, (res) => {
      let list = {};

      const scaleList = this.props.settings.dbt
        ? res.filter((di) => di.diaryType !== 'Skill' && di.diaryName !== 'Notes')
        : res.filter((di) => di.diaryType === 'General' && di.diaryName !== 'Notes');
      const ratingsInfo = scaleList.reduce((obj, s) => {
        obj[s.diaryName] = { defaultRating: s.defaultRating, minRating: s.minRating, scale: s.scale };

        return obj;
      }, {});

      this.setState({ ratingsInfo: ratingsInfo }, func);

      scaleList.forEach((d, i) => (list[i] = d.diaryName));

      let compareList = {};

      scaleList.forEach((d, i) => {
        if (d.diaryName === USED_SKILLS || d.diaryName === STEPS) {
          compareList[d.diaryName] = { '0': 'None' };
        } else {
          compareList[d.diaryName] = scaleList
            .filter((t) => t.diaryType === d.diaryType)
            .reduce((obj, r, i) => {
              if (Object.keys(obj).length === 0) {
                obj['0'] = 'None';
              }

              if (r.diaryName !== d.diaryName && r.diaryName !== USED_SKILLS && r.diaryName !== STEPS) {
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
      DbTableNames.diarySession,
      this.handleDiaryData,
      this.getOldDiaryData,
      ' as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId' +
        " where DATE(diaryDate) between Date('" +
        timeFrames.monthDate +
        "') and Date('" +
        today +
        "') and " +
        (this.props.settings.dbt ? "diaryType = 'Feeling' or diaryType = 'General'" : "diaryType = 'General'")
    );
  };
  // retrieve ratings for diary items up to 30 days ago

  getOldDiaryData = () => {
    const columns = "diaryDate, diaryName, avg(rating) as 'rating'";
    const today = Moment().format('YYYY-MM-DD');
    const table =
      "(Select strftime('%m/%Y',s.diaryDate) as 'diaryDate', ds.rating, d.diaryName FROM " +
      DbTableNames.diarySession +
      ' as ds \n' +
      'inner join ' +
      DbTableNames.diary +
      ' as d on ds.diaryId = d.diaryId \n' +
      'inner join ' +
      DbTableNames.session +
      ' as s on ds.sessionId = s.sessionId \n' +
      "where DATE(diaryDate) between Date('" +
      timeFrames.yearDate +
      "') and Date('" +
      today +
      "') and " +
      (this.props.settings.dbt ? "diaryType = 'Feeling' or diaryType = 'General')" : "diaryType = 'General')");

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
          y: this.state.ratingsInfo[this.state.selectedDiaryItem].defaultRating,
        });

        if (diaryDates.includes(date)) {
          const trackArr = diaryRatings.filter((sk) => sk.diaryDate === date).map((tr) => tr.rating);

          const avgRating = trackArr.reduce((total, rating) => total + rating) / trackArr.length;
          const diaryObjIndex = trackGraph.findIndex((e) => e.x === date);

          trackGraph[diaryObjIndex].y = selectedDiaryItem === STEPS ? Math.max(...trackArr) : avgRating;
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
          y: this.state.ratingsInfo[this.state.selectedDiaryItem].defaultRating,
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

  handleEmailModalClose = () => {
    this.setState({ emailModalVisible: false });
  };

  handleFinalSelection = () => {
    this.handleModalClose();

    this.setState({ graphReady: false }, () =>
      setTimeout(() => {
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
      }, 10)
    );
  };
  // call the transformGraph function based on what options have been selected

  getYDomain = (diaryItem) => {
    return [this.state.ratingsInfo[diaryItem].minRating, this.state.ratingsInfo[diaryItem].scale];
  };
  // setting the min and max values expected for each type of diary item

  getYCategorey = () => {
    const scale =
      this.state.ratingsInfo[this.state.selectedDiaryItem].scale === 'Undetermined'
        ? 5
        : this.state.ratingsInfo[this.state.selectedDiaryItem].scale;
    // if scale is set to 'Undetermined' in DB, give it default of 5 for when no records in DB.

    let categoryArr = [];

    for (let i = 1; i <= scale; i++) {
      categoryArr.push(i.toString());
    }

    return categoryArr;
  };
  // setting Y axis labels for various diary types

  infoAlert = () => {
    Alert.alert(
      'Recipients',
      'Recipient list is populated with user email address and Helper email addresses.\n\nUser email address can be set in Backup and Restore setting menu',
      [{ text: 'OK', onPress: () => console.log('OK pressed') }],
      { cancelable: false }
    );
  };
  // alert for displaying recipient info

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        {this.state.graphReady ? (
          <View style={{ backgroundColor: '#fff' }} collapsable={false} ref={(ref) => (this.chartView = ref)}>
            <VictoryChart
              height={Dimensions.get('window').height * 0.57}
              theme={VictoryTheme.material}
              categories={{
                [(this.state.ratingsInfo[this.state.selectedDiaryItem].scale !== 'Undetermined' ||
                  this.state.graphData.reduce((acc, g) => acc + g.y, 0) === 0) &&
                'y']: this.getYCategorey(),
                x: this.state.graphData.map((gr) => gr.x),
              }}
            >
              <VictoryAxis fixLabelOverlap={true} />
              <VictoryAxis
                dependentAxis
                fixLabelOverlap={true}
                tickFormat={(t) => {
                  if (t > 1000) {
                    return `${t / 1000}k`;
                  } else {
                    return t;
                  }
                }}
              />
              <VictoryGroup
                data={this.state.graphData}
                domain={{
                  [this.state.ratingsInfo[this.state.selectedDiaryItem].scale !== 'Undetermined' &&
                  'y']: this.getYDomain(this.state.selectedDiaryItem),
                }}
              >
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
            <Modal visible={this.state.modalVisible} transparent={false} onRequestClose={this.handleModalClose}>
              <View style={{ flex: 1 }}>
                <View style={chartStyle.closeButton}>
                  <PressableIcon
                    size={45}
                    iconName={Icons.closeModal}
                    color={AppColors.blue}
                    onPressFunction={this.handleModalClose}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, marginBottom: 50 }}>
                    <CustomMultiSelectList
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
                    style={[chartStyle.button, themeStyles.multiSelectSaveButton]}
                    onPress={this.handleFinalSelection}
                    underlayColor="#99d9f4"
                  >
                    <Text style={[chartStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
            <Modal
              visible={this.state.emailModalVisible}
              transparent={false}
              onRequestClose={this.handleEmailModalClose}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={chartStyle.closeButton}>
                    <PressableIcon
                      size={45}
                      iconName={Icons.closeModal}
                      color={AppColors.blue}
                      onPressFunction={this.handleEmailModalClose}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: Expo.Constants.statusBarHeight,
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: AppColors.blue, paddingRight: 5 }}>Select Recipient(s)</Text>
                    <PressableIcon
                      iconName={Icons.info + '-outline'}
                      size={25}
                      onPressFunction={this.infoAlert}
                      color="#007AFF"
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, marginBottom: 50 }}>
                    <CustomMultiSelectList
                      options={this.props.navigation.getParam('recipients')}
                      multiple={true} //
                      returnValue={'label'} // label or value
                      callback={this.handleEmailSelection} // callback, array of selected items
                      rowBackgroundColor={'#fff'}
                      rowHeight={40}
                      rowRadius={5}
                      iconColor={'#00a2dd'}
                      iconSize={25}
                      selectedIconName={'ios-checkmark-circle-outline'}
                      unselectedIconName={'ios-radio-button-off-outline'}
                      search={true}
                    />
                  </View>
                  <TouchableHighlight
                    style={[chartStyle.button, themeStyles.multiSelectSaveButton]}
                    onPress={this.handleFinalEmailSelection}
                    underlayColor="#99d9f4"
                  >
                    <Text style={[chartStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
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
    marginTop: Expo.Constants.statusBarHeight,
  },

  buttonText: {
    alignSelf: 'center',
  },

  button: {
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  settings: state.setting,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(VicChart);
// HOC that re-renders the component automatically every time a particular section of state is updated
