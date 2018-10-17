import React from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, Modal, TouchableHighlight, ScrollView } from 'react-native';
import {TabStyles} from "../../Styles/TabStyles";
import Moment from 'moment'
import {readDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import CustomMultiPicker from "react-native-multiple-select-list";
import {CustomSelectionRow} from "../../Components/CustomSelectionRow";
import {Icons} from "../../Constants/Icon";
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis, VictoryLabel, VictoryLegend, VictoryStack } from 'victory-native';
import {PressableIcon} from "../../Components/PressableIcon";
import {DbTableNames} from "../../Constants/Constants";
import {convertMilliseconds} from "../../Util/ConvertMilliseconds";
import {ChartLegend} from "../../Components/ChartLegend";

const timeFrames = {
    weekDate: Moment().subtract(6,'d').format('YYYY-MM-DD'),
    monthDate: Moment().subtract(29,'d').format('YYYY-MM-DD'),
    sixMonthDate: Moment().subtract(6,'months').format('YYYY-MM-DD'),
    yearDate: Moment().subtract(12,'months').format('YYYY-MM-DD'),
};
// Time periods in Moment format that available in chart selection

const periods = {
    week: 'Past 7 days',
    month: 'Past 30 days',
    sixMonth: 'Past 6 months',
    year: 'Past year',
};
// String representations of above selections

const chartColors = {
    Home:"#c43a31",
    Plan: 'blue',
    Diary: 'green',
    Crisis: 'yellow',
    Settings: 'purple'
};

export default class UsageOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            graphReady: false,
            graphData: {},
            xDomain: [],
            timeFrameSelected: false,
            modalVisible: false,
            checkedItemTime: periods.week,
            selectedTimeFrame: periods.week,
            data: [],
            dateRange: [],
            todayTime: 0,
            todayTimeChecked: false
        }
    }

    componentDidMount() {
        // this.getUsageData();

        this.getDateRange(periods.week, this.getUsageData)
    }

    toggleModal = bool => {
        this.setState({modalVisible: bool})
    };

    handleModalClose = () => {
        this.toggleModal(false);

        this.setState({timeFrameSelected: false})
    };

    getUsageData = () => {
        readDatabaseArg('fu.functionId, f.title, DATE(fu.dateEntered) as dateEntered, sum(fu.functionValue) as time', DbTableNames.functionUsage,
            res => this.setState({data: res}, this.transformData), undefined,
            'as fu ' +
            'inner join ' + DbTableNames.function + ' as f on fu.functionId = f.functionId where functionType = "sessionTime" ' +
            'group by fu.functionId, DATE(fu.dateEntered)')
    };

    handleSelection = item => {
        this.setState({
            checkedItemTime: item[0]
        });
    };
    // update state as boxes are ticked in either selection list

    handleFinalSelection = () => {
        this.handleModalClose();
        this.setState({selectedTimeFrame: this.state.checkedItemTime, graphReady: false}, () => {
            setTimeout(() => {
                if (this.state.checkedItemTime === periods.week) {
                    this.getDateRange(periods.week, this.transformData)
                } else if (this.state.checkedItemTime === periods.month) {
                    this.getDateRange(periods.month, this.transformData)
                } else if (this.state.checkedItemTime === periods.sixMonth) {
                    this.getDateRange(periods.sixMonth, this.transformData)
                } else {
                    this.getDateRange(periods.year, this.transformData)
                }
            }, 10)
        })

        // setting timeout to allow spinner to appear
    };

    getDateRange = (timeRange, func) => {
        let dateArray = [];
        const today = Moment().format("YYYY-MM-DD");

        if(timeRange === periods.week) {
            let weekAgo = timeFrames.weekDate;

            while (today >= weekAgo) {
                dateArray.push(Moment(weekAgo).format("YYYY-MM-DD"));
                weekAgo = Moment(weekAgo).add(1, 'd').format("YYYY-MM-DD");
            }
        } else if(timeRange === periods.month) {
            let monthAgo = timeFrames.monthDate;

            while (today >= monthAgo) {
                dateArray.push(Moment(monthAgo).format("YYYY-MM-DD"));
                monthAgo = Moment(monthAgo).add(1, 'd').format("YYYY-MM-DD");
            }
        } else if(timeRange === periods.sixMonth) {
            for(let numMonths = 5; numMonths >= 0; numMonths--) {
                dateArray.push(Moment().subtract(numMonths, 'months').format("MM/YY"))
            }
        } else {
            for(let numMonths = 11; numMonths >= 0; numMonths--) {
                dateArray.push(Moment().subtract(numMonths, 'months').format("MM/YY"))
            }
        }

        this.setState({dateRange: dateArray}, func)
    };

    transformData = () => {
        let trackGraph = {
            Home: [],
            Plan: [],
            Diary: [],
            Crisis: [],
            Settings: []
        };

        const today = Moment().format("YYYY-MM-DD");

        if(this.state.selectedTimeFrame === periods.week || this.state.selectedTimeFrame === periods.month) {
            const tabSessionDates = this.state.data.map(s => s.dateEntered);

            this.state.dateRange.forEach(date => {
                Object.keys(trackGraph).forEach(k => {
                    const timeObj = this.state.data.filter(d => d.dateEntered === date && d.title === k)[0];

                    trackGraph[k].push({
                        x: Moment(date).format("DD/MM"),
                        y: timeObj ? timeObj.time : 0
                    });

                    if(date === today && !this.state.todayTimeChecked) {
                        this.setState(prevState => {
                            return {
                                todayTime: prevState.todayTime + (timeObj ? timeObj.time : 0)
                            }
                        })
                    }
                });
            });
            // function for mapping diary data for chart analysis. If days has multiple entries, average is taken
        } else {
            this.state.dateRange.forEach(date => {
                Object.keys(trackGraph).forEach(k => {
                    const accumTime = this.state.data.filter(d => Moment(d.dateEntered).format("MM/YY") === date && d.title === k).reduce((acc, cv) => cv.time + acc, 0);

                    trackGraph[k].push({
                        x: date,
                        y: accumTime
                    });

                });
            });
        }

        this.setState({graphData: trackGraph, todayTimeChecked: true}, () => {
            this.setState({graphReady: true})
        })
    };

    render() {
        return (
            <ScrollView contentContainerStyle={TabStyles.stackContainer}>
                {this.state.graphReady ?
                    <View>
                        <View style={{alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0, marginHorizontal: 25, borderRadius: 5, flex: .15}}>
                            <Text style={{fontSize: 17}}>{"Today's Usage: "}<Text style={{color: '#808080', fontSize: 17}}>{convertMilliseconds(this.state.todayTime)}</Text></Text>
                            {/*<Text>{Moment().format("LL")}</Text>*/}
                        </View>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <View style={{alignItems: 'stretch'}}>
                                <ChartLegend
                                    data={[
                                        { name: "Home", color: chartColors.Home },
                                        { name: "Plan", color: chartColors.Plan },
                                        { name: "Diary", color: chartColors.Diary },
                                        { name: "Crisis", color: chartColors.Crisis },
                                        { name: "Settings", color: chartColors.Settings },
                                    ]}
                                />
                            </View>
                            <VictoryChart
                                padding={{top: 25, bottom: 35, left: 55, right: 50}}
                                height={Dimensions.get('window').height * .47}
                                theme={VictoryTheme.material}
                                categories={{
                                    x: this.state.graphData.Home.map(gr => gr.x)
                                }}
                            >
                                <VictoryAxis
                                    fixLabelOverlap={true}
                                />
                                <VictoryAxis dependentAxis
                                             fixLabelOverlap={true}
                                             tickFormat={(t) => convertMilliseconds(t)}
                                             style={{
                                                 tickLabels: { fontSize: 10 }
                                             }}
                                />
                                <VictoryStack>
                                    <VictoryBar
                                                style={{ data: { fill: "#c43a31", fillOpacity: 0.8, } }}
                                                alignment="start"
                                                data={this.state.graphData.Home}
                                                barRatio={0.8}
                                                animate={{
                                                    onExit: {
                                                        duration: 0,
                                                    }
                                                }}
                                    />
                                    <VictoryBar
                                        style={{ data: { fill: "blue", fillOpacity: 0.8, } }}
                                        alignment="start"
                                        data={this.state.graphData.Plan}
                                        barRatio={0.8}
                                        animate={{
                                            onExit: {
                                                duration: 0,
                                            }
                                        }}
                                    />
                                    <VictoryBar
                                        style={{ data: { fill: "green", fillOpacity: 0.8, } }}
                                        alignment="start"
                                        data={this.state.graphData.Diary}
                                        barRatio={0.8}
                                        animate={{
                                            onExit: {
                                                duration: 0,
                                            }
                                        }}
                                    />
                                    <VictoryBar
                                        style={{ data: { fill: "yellow", fillOpacity: 0.8, } }}
                                        alignment="start"
                                        data={this.state.graphData.Crisis}
                                        barRatio={0.8}
                                        animate={{
                                            onExit: {
                                                duration: 0,
                                            }
                                        }}
                                    />
                                    <VictoryBar
                                        style={{ data: { fill: "purple", fillOpacity: 0.8, } }}
                                        alignment="start"
                                        data={this.state.graphData.Settings}
                                        barRatio={0.8}
                                        animate={{
                                            onExit: {
                                                duration: 0,
                                            }
                                        }}
                                    />
                                </VictoryStack>
                            </VictoryChart>
                        </View>
                        <View style={{flex: .15, justifyContent: 'flex-start', marginBottom: 20}}>
                            <CustomSelectionRow
                                name="Time Frame"
                                icon={Icons.calendar + '-outline'}
                                iconSize={Dimensions.get('window').height / 20}
                                iconContainer={overviewStyle.iconContainer}
                                selectedText={this.state.selectedTimeFrame}
                                onPress={() => {
                                    this.setState({timeFrameSelected: true});

                                    this.toggleModal(true)
                                }}
                                nameStyle={{fontSize: 16}}
                            />
                        </View>
                        <Modal visible={this.state.modalVisible} transparent={false} onRequestClose={this.handleModalClose}>
                            <View style={{flex: 1}}>
                                <View style={overviewStyle.closeButton}>
                                    <PressableIcon
                                        size={45}
                                        iconName={Icons.closeModal}
                                        color="black"
                                        onPressFunction={this.handleModalClose}
                                    />
                                </View>
                                <View style={{flex: 1}}>
                                    <View style={{flex: 1, marginBottom: 50}}>
                                        <CustomMultiPicker
                                            options={periods}
                                            multiple={false} //
                                            returnValue={"label"} // label or value
                                            callback={this.handleSelection} // callback, array of selected items
                                            rowBackgroundColor={"#fff"}
                                            rowHeight={40}
                                            rowRadius={5}
                                            iconColor={"#00a2dd"}
                                            iconSize={25}
                                            itemStyle={overviewStyle.itemStyle}
                                            selectedIconName={"ios-checkmark-circle-outline"}
                                            unselectedIconName={"ios-radio-button-off-outline"}
                                            search={true}
                                            selected={this.state.selectedTimeFrame}
                                        />
                                    </View>
                                    <TouchableHighlight
                                        style={overviewStyle.button}
                                        onPress={this.handleFinalSelection}
                                        underlayColor='#99d9f4'>
                                        <Text style={overviewStyle.buttonText}>Done</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </Modal>
                    </View> :
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>}
            </ScrollView>
        );
    }
}

const overviewStyle = StyleSheet.create({
    itemStyle: {
        borderBottomWidth: 3
    },

    iconContainer: {
        width: Dimensions.get('window').height / 20,
        height: Dimensions.get('window').height / 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButton: {
        paddingLeft: 25,
        alignItems:'flex-start',
        marginTop: 15
    },

    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },

    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        margin:15,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});

