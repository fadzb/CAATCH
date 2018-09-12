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

const safetyPlanElements = {
  WarningSign: { name: 'Warning Sign', icon: Icons.warningSign },
  CopingStrategy: { name: 'Coping Strategy', icon: Icons.copingStrategy },
  Distraction: { name: 'Distraction', icon: Icons.distractions },
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
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={insightsStyle.iconContainer}>
          <Icon name={props.icon} size={30} color={props.iconColor} />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={insightsStyle.buttonText}>{props.name}</Text>
          <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
            <Text style={insightsStyle.ratingText}>{props.selectedText}</Text>
            <Text style={insightsStyle.ratingTextInfo}>{props.selectedTextInfo}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  }

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

  renderItem = ({ item }) => (
    <View style={insightsStyle.listContainer}>
      <InsightRow
        name={item.name}
        selectedText={item.idName}
        selectedTextInfo={item[functionTypeToInfo[item.functionType]]}
        icon={item.icon + '-outline'}
        onPress={() => console.log(item)}
      />
    </View>
  );

  renderSectionHeader = (obj) => (
    <View style={insightsStyle.sectionHeader}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{obj.section.title}</Text>
    </View>
  );

  render() {
    const NUMBER_OF_TABS = 2;

    const sections = [...new Set(this.state.data.map((item) => item.title))].map((title) => ({
      title: title,
      data: this.state.data.filter((d) => d.title === title),
    }));
    // mapping over unique titles and creating object for each with title and data keys

    return (
      <View style={TabStyles.stackContainer}>
        {this.state.dataReady ? (
          <Container>
            <StyleProvider style={getTheme(platform)}>
              <Tabs prerenderingSiblingsNumber={NUMBER_OF_TABS}>
                <Tab heading={'Safety Plan'}>
                  <View>
                    <SectionList
                      renderItem={this.renderItem}
                      renderSectionHeader={this.renderSectionHeader}
                      sections={sections}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </Tab>
                <Tab heading={'Diary'}>
                  <View style={{ flex: 1 }}>
                    <Text>Todo</Text>
                  </View>
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
    fontSize: 14,
    paddingRight: 10,
    color: '#4d4d4d',
    paddingBottom: 4,
    fontWeight: 'bold',
  },

  ratingTextInfo: {
    fontSize: 14,
    paddingRight: 10,
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
    paddingTop: 20,
    paddingBottom: 20,
  },

  listContainer: {
    alignSelf: 'stretch',
  },

  sectionHeader: {
    flex: 1,
    alignItems: 'stretch',
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 7.5,
    backgroundColor: '#e1e1ea',
  },
});
