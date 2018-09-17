import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icons } from '../../Constants/Icon';
import { TabStyles } from '../../Styles/TabStyles';
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import Icon from 'react-native-vector-icons/Ionicons';
import { readDatabase, readDatabaseArg } from '../../Util/DatabaseHelper';
import { DbPrimaryKeys, DbTableNames, UsageFunctionIds } from '../../Constants/Constants';
import Moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';

const safetyPlanElements = {
  WarningSign: { name: 'Warning Sign', icon: Icons.warningSign },
  CopingStrategy: { name: 'Coping Strategy', icon: Icons.copingStrategy },
  Distraction: { name: 'Things to Do', icon: Icons.distractions },
  Reason: { name: 'Reason to Live', icon: Icons.lifeWorthLiving },
  Contact: { name: 'Contact', icon: Icons.contacts },
};

const functionTypeToInfo = {
  mostViewed: 'viewCount',
  lastEntered: 'dateEntered',
  lastViewed: 'dateEntered',
};

const InsightRow = (props) => (
  <View style={insightsStyle.container}>
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View style={insightsStyle.iconContainer}>
          <Icon name={props.icon} size={30} color={props.iconColor} />
        </View>
        <Text style={insightsStyle.buttonText}>{props.name}</Text>
      </View>
      <View style={{ marginLeft: 15 }}>
        <Text style={insightsStyle.ratingText}>{props.selectedText}</Text>
        <Text style={insightsStyle.ratingTextInfo}>{props.selectedTextInfo}</Text>
      </View>
    </View>
  </View>
);

export default class Insights extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Insights',
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      dataReady: false,
      diaryDataReady: false,
      diaryData: [],
    };
  }

  componentDidMount() {
    readDatabaseArg(
      'fu.*, f.functionId, f.functionName, f.functionType, f.title',
      DbTableNames.functionUsage,
      (res) => this.setData(res, false),
      this.getMostViewedData,
      'as fu inner join ' +
        DbTableNames.function +
        ' as f on fu.functionId = f.functionId where f.functionType <> "mostViewed" and fu.tableId is not NULL'
    );

    // retrieving all NOT mostViewed FunctionUsage data and storing in state

    const columns = 's.diaryDate, ds.rating, d.diaryName';
    const today = Moment().format('YYYY-MM-DD');
    const weekAgo = Moment().subtract(6, 'd').format('YYYY-MM-DD');

    readDatabaseArg(
      columns,
      DbTableNames.diarySession,
      this.setDiaryData,
      undefined,
      ' as ds inner join ' +
        DbTableNames.diary +
        ' as d on ds.diaryId = d.diaryId inner join ' +
        DbTableNames.session +
        ' as s on ds.sessionId = s.sessionId' +
        " where DATE(diaryDate) between Date('" +
        weekAgo +
        "') and Date('" +
        today +
        "') and diaryType = 'General'"
    );
    // retrieving general diary data i.e. sleep and mood scale
  }

  setDiaryData = (res) => {
    const resultArr = [];

    const diaryNames = [...new Set(res.map((f) => f.diaryName))];

    diaryNames.forEach((di) => {
      const ratingArr = res.filter((r) => r.diaryName === di).map((t) => t.rating);

      resultArr.push({
        diaryName: di,
        type: 'Average Rating',
        rating: ratingArr.reduce((a, b) => a + b, 0) / ratingArr.length,
      });
      // average rating last 7 days

      resultArr.push({ diaryName: di, type: 'Max Rating', rating: Math.max(...ratingArr) });
      // max rating last 7 days

      resultArr.push({ diaryName: di, type: 'Min Rating', rating: Math.min(...ratingArr) });
      // min rating last 7 days
    });

    this.setState({ diaryData: resultArr });
  };

  getMostViewedData = () => {
    const columns = 'functionId, functionType, title, tableName, columnName, tableId, idName, max(count) as viewCount';
    const functionType = '"mostViewed"';

    readDatabaseArg(
      columns,
      '(select *, count(*) as count from ' +
        DbTableNames.functionUsage +
        ' as fu inner join ' +
        DbTableNames.function +
        ' as f ' +
        'on fu.functionId = f.functionId where f.functionType = ' +
        functionType +
        ' group by fu.functionId, fu.tableId)',
      (res) => this.setData(res, true),
      undefined,
      'group by ' + DbPrimaryKeys.function
    );
  };
  // complex sql query for retrieving most viewed SP items. Includes inner joins and nested queries

  setData = (res, readyBool) => {
    this.setState(
      (prevState) => ({
        data: [
          ...prevState.data,
          ...res.map((r) => ({
            ...r,
            dateEntered: Moment(r.dateEntered).format('LLL'),
            ...safetyPlanElements[r.tableName],
          })),
        ],
      }),
      () => this.setState({ dataReady: readyBool })
    );
  };
  // combining most SP items with their respective title and icon from const safetyPlanElements. Storing in data state. Second parameter is used for when function is called last so it can indicate that all data is ready

  renderItem = (section, _, isActive, sections) =>
    section.items.map((a, i) => (
      <View key={i} style={insightsStyle.listContainer}>
        {a.functionType !== 'mostViewed' ? (
          <InsightRow
            name={a.name}
            selectedText={a[functionTypeToInfo[a.functionType]]}
            selectedTextInfo={a.idName}
            icon={a.icon + '-outline'}
            onPress={() => console.log(a)}
          />
        ) : (
          <InsightRow
            name={a.name}
            selectedText={a[functionTypeToInfo[a.functionType]] + (a.viewCount === 1 ? ' View' : ' Views')}
            selectedTextInfo={a.idName}
            icon={a.icon + '-outline'}
            onPress={() => console.log(a)}
          />
        )}
      </View>
    ));

  renderDiaryItem = (section, _, isActive, sections) =>
    section.items.map((a, i) => (
      <View key={i} style={insightsStyle.listContainer}>
        <View style={insightsStyle.container}>
          <View style={{ paddingLeft: 10 }}>
            <Text style={insightsStyle.ratingText}>{a.type}</Text>
            <Text style={insightsStyle.ratingTextInfo}>{a.rating}</Text>
          </View>
        </View>
      </View>
    ));

  renderSectionHeader = (section, _, isActive) => (
    <View style={insightsStyle.sectionHeader}>
      <Text style={{ fontSize: 18 }}>{section.title}</Text>
      <Icon name={isActive ? Icons.up + '-outline' : Icons.down + '-outline'} size={25} />
    </View>
  );

  render() {
    const NUMBER_OF_TABS = 2;

    const sections = [...new Set(this.state.data.map((item) => item.title))].map((title) => ({
      title: title,
      items: this.state.data.filter((d) => d.title === title),
    }));
    // mapping over unique titles and creating object for each with title and data keys

    const diarySections = [...new Set(this.state.diaryData.map((item) => item.diaryName))].map((name) => ({
      title: name,
      items: this.state.diaryData.filter((d) => d.diaryName === name),
    }));
    // mapping over unique titles and creating object for each with title and data keys

    return (
      <View style={TabStyles.stackContainer}>
        {this.state.dataReady ? (
          <Container>
            <StyleProvider style={getTheme(platform)}>
              <Tabs prerenderingSiblingsNumber={NUMBER_OF_TABS}>
                <Tab heading={'Safety Plan'}>
                  <ScrollView style={{ marginTop: 10 }}>
                    <Accordion
                      sections={sections}
                      renderHeader={this.renderSectionHeader}
                      renderContent={this.renderItem}
                      underlayColor={'transparent'}
                    />
                  </ScrollView>
                </Tab>
                <Tab heading={'Diary'}>
                  <ScrollView style={{ marginTop: 10 }}>
                    <Accordion
                      sections={diarySections}
                      renderHeader={this.renderSectionHeader}
                      renderContent={this.renderDiaryItem}
                      underlayColor={'transparent'}
                    />
                  </ScrollView>
                </Tab>
              </Tabs>
            </StyleProvider>
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

const insightsStyle = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    paddingLeft: 10,
    flex: 1,
  },

  ratingText: {
    fontSize: 16,
    color: '#4d4d4d',
    paddingBottom: 5,
    fontWeight: 'bold',
  },

  ratingTextInfo: {
    fontSize: 16,
    color: '#4d4d4d',
  },

  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },

  listContainer: {
    alignSelf: 'stretch',
  },

  sectionHeader: {
    alignSelf: 'stretch',
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 12,
    backgroundColor: '#f0f0f5',
    borderWidth: 0.5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
});
