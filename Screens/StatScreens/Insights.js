import React from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList, SectionList, ActivityIndicator } from 'react-native';
import {Icons} from "../../Constants/Icon";
import {TabStyles} from "../../Styles/TabStyles";
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import Icon from "react-native-vector-icons/Ionicons";
import {readDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import {DbPrimaryKeys, DbTableNames, UsageFunctionIds} from "../../Constants/Constants";

const safetyPlanElements = {
    WarningSign: {name: 'Warning Sign', icon: Icons.warningSign},
    CopingStrategy: {name: 'Coping Strategy', icon: Icons.copingStrategy},
    Reason: {name: 'Distraction', icon: Icons.distractions},
    Distraction: {name: 'Reason to Live', icon: Icons.lifeWorthLiving},
    Contact: {name: 'Contact', icon: Icons.contacts}
};

const InsightRow = (props) => (
    <View style={insightsStyle.container}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center'}}>
            <View style={insightsStyle.iconContainer}>
                <Icon
                    name={props.icon}
                    size={30}
                    color={props.iconColor}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={insightsStyle.buttonText}>{props.name}</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={insightsStyle.ratingText}>{props.selectedText}</Text>
                </View>
            </View>
        </View>
    </View>
);

export default class Insights extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Insights',
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            viewData: [],
            dataReady: false
        }
    }

    componentDidMount() {
        readDatabaseArg('*', DbTableNames.functionUsage, res => this.setState({data: [...res]}), this.getMostViewedData, 'as fu inner join ' + DbTableNames.function + ' as f on fu.functionId = f.functionId')

        // retrieving all FunctionUsage data and storing in state
    }

    getMostViewedData = () => {
        const columns = 'functionId, tableName, columnName, tableId, idName, max(count) as viewCount';
        const functionType = '"view"';

        readDatabaseArg(columns, '(select *, count(*) as count from ' + DbTableNames.functionUsage + ' as fu inner join ' + DbTableNames.function + ' as f ' +
            'on fu.functionId = f.functionId where f.functionType = ' + functionType + ' group by fu.functionId, fu.tableId)', this.setViewData, undefined, 'group by ' + DbPrimaryKeys.function)
    };
    // complex sql query for retrieving most viewed SP items

    setViewData = res => {
        this.setState({viewData: res.map(r => ({...r, ...safetyPlanElements[r.tableName]}))}, () => this.setState({dataReady: true}))
    };
    // combining most viewed SP items with their respective title and icon from const safetyPlanElements. Storing in viewData state

    renderItem = ({item}) => (
        <View style={insightsStyle.listContainer}>
            <InsightRow
                name= {item.name}
                selectedText={item.idName + ' (' + item.viewCount + ' views)'}
                icon={item.icon + '-outline'}
            />
        </View>
    );

    renderSectionHeader = obj => <View style={insightsStyle.sectionHeader}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{obj.section.title}</Text>
    </View>;

    render() {
        const NUMBER_OF_TABS = 2;

        const sections = [{
            title: 'Most Viewed',
            data: this.state.viewData,
        }];

        return (
            <View style={TabStyles.stackContainer}>
                {this.state.dataReady ?
                    <Container>
                        <StyleProvider style={getTheme(platform)}>
                            <Tabs prerenderingSiblingsNumber={NUMBER_OF_TABS}>
                                <Tab heading={"Safety Plan"}>
                                    <View>
                                        <SectionList
                                            renderItem={this.renderItem}
                                            renderSectionHeader={this.renderSectionHeader}
                                            sections={sections}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                </Tab>
                                <Tab heading={"Diary"}>
                                    <View style={{flex: 1}}>
                                        <Text>Todo</Text>
                                    </View>
                                </Tab>
                            </Tabs>
                        </StyleProvider>
                    </Container>
                    : <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>}
            </View>
        );
    }
}

const insightsStyle = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        paddingLeft: 10,
        flex: 1
    },

    ratingText: {
        fontSize: 14,
        paddingRight: 10,
        color: '#4d4d4d'
    },

    iconContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },

    container: {
        flex: 1,
        justifyContent: "space-around",
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
    },

    listContainer: {
        alignSelf: 'stretch'
    },

    sectionHeader: {
        flex: 1,
        alignItems: 'stretch',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15
    }
});