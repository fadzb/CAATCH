import React from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList, SectionList } from 'react-native';
import {Icons} from "../../Constants/Icon";
import {TabStyles} from "../../Styles/TabStyles";
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import Icon from "react-native-vector-icons/Ionicons";
import {readDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import {DbTableNames, UsageFunctionIds} from "../../Constants/Constants";

const safetyPlanElements = [{name: 'Warning Sign', info: 'Feeling Alone (8 views)', icon: Icons.warningSign},
    {name: 'Coping Strategy', info: 'Baking (12 views)', icon: Icons.copingStrategy},
    {name: 'Distraction', info: 'Library (4 views)', icon: Icons.distractions},
    {name: 'Reason to Live', info: 'Living 2 (9 views)', icon: Icons.lifeWorthLiving}];

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
        }
    }

    componentDidMount() {
        // Object.values(UsageFunctionIds).forEach(id => {
        //     readDatabaseArg('tableId, tableName, count(*) as viewCount', DbTableNames.functionUsage, res => this.setState(prevState => ({data: [...prevState.data, {...res[0], functionId: id}]}), () => console.log(this.state.data)), undefined,
        //         'where functionId = ' + id + ' group by tableId order by count(*) Desc limit 1')
        // })

        // need to add another column into function usage titled 'columnName' in order to join tables via primaryKey. Maybe another column also for functionType (can go in function table)
    }

    renderItem = ({item}) => (
        <View style={insightsStyle.listContainer}>
            <InsightRow
                name= {item.name}
                selectedText={item.info}
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
            data: safetyPlanElements,
        }];

        return (
            <View style={TabStyles.stackContainer}>
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