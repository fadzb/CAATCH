import React from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, Modal, TouchableHighlight, ScrollView, Alert } from 'react-native';
import {AppColors, TabStyles, themeStyles} from "../../Styles/TabStyles";
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
import Icon from "react-native-vector-icons/Ionicons";
import CustomMultiSelectList from "../../Components/CustomMultiSelectList"

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
    statSelection:"#c43a31",
    Plan: 'blue',
    Diary: 'green',
    goals: 'yellow',
    reports: 'purple'
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
            todayTimeChecked: false,
            selectedRecipients: [],
            snapshotFile: '',
            emailModalVisible: false
        }
    }

    componentDidMount() {
        this.getDateRange(periods.week, this.getUsageData)
    }

    handleEmailSelection = email => this.setState({selectedRecipients: email.filter(e => e !== undefined)});
    // update selectedRecipients state when new email is selected in multi picker list

    handleEmailModalClose = () => {
        this.setState({emailModalVisible: false})
    };

    handleFinalEmailSelection = () => {
        if(this.state.selectedRecipients.length > 0) {
            Expo.MailComposer.composeAsync({
                recipients: this.state.selectedRecipients,
                subject: 'SafePlan Usage Graph ' + Moment().format('LL'),
                body: "Hi, please find SafePlan Usage graph attached.",
                attachments: [this.state.snapshotFile]
            })
                .then(result => console.log(result))
                .then(res => this.handleEmailModalClose())
                .catch(err => console.log(err))
        } else {
            this.notSelectedAlert()
        }
    };
    // open email interface with snapshot attached as png file

    notSelectedAlert = () => {
        Alert.alert(
            'Email Not Selected',
            'Please select and email address from the list',
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };

    takeScreenShot = () => {
        Expo.takeSnapshotAsync(this.chartView, {
            format: 'png',
            quality: 1,
            result: 'file',
        }).then(this.handleEmail).catch(err => console.log(err))
    };
    // take screenshot of entire screen view and call handleEmail function that sets the resulting file as the snapshotFile state

    handleEmail = file => {
        this.setState({snapshotFile: file, emailModalVisible: true});
    };

    infoAlert = () => {
        Alert.alert(
            'Recipients',
            'Recipient list is populated with user email address and Helper email addresses.\n\nUser email address can be set in Backup and Restore setting menu',
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };
    // alert for displaying recipient info

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
            statSelection: [],
            Plan: [],
            Diary: [],
            goals: [],
            reports: []
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
                        <View style={{alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0, marginHorizontal: 20, borderRadius: 5, flex: .15, flexDirection: 'row'}}>
                            <Text style={{fontSize: 17, color: AppColors.blue}}>{"Today's Usage: "}<Text style={{color: AppColors.grey, fontSize: 17}}>{convertMilliseconds(this.state.todayTime)}</Text></Text>
                            <View style={{position: 'absolute', right: 0}}>
                                <Icon
                                    name={Icons.share}
                                    size={25}
                                    onPress={() => this.takeScreenShot()}
                                    color={AppColors.blue}
                                />
                            </View>
                        </View>
                        <View collapsable={false} ref={ref => this.chartView = ref} style={{flex: 1, backgroundColor: '#fff'}}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <View style={{alignItems: 'stretch'}}>
                                    <ChartLegend
                                        data={[
                                            { name: "Stats", color: chartColors.statSelection },
                                            { name: "Plan", color: chartColors.Plan },
                                            { name: "Diary", color: chartColors.Diary },
                                            { name: "Goals", color: chartColors.goals },
                                            { name: "Reports", color: chartColors.reports },
                                        ]}
                                    />
                                </View>
                                <VictoryChart
                                    padding={{top: 25, bottom: 35, left: 55, right: 50}}
                                    height={Dimensions.get('window').height * .47}
                                    theme={VictoryTheme.material}
                                    categories={{
                                        x: this.state.graphData.statSelection.map(gr => gr.x)
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
                                                    style={{ data: { fill: chartColors.statSelection, fillOpacity: 0.8, } }}
                                                    alignment="start"
                                                    data={this.state.graphData.statSelection}
                                                    barRatio={0.8}
                                                    animate={{
                                                        onExit: {
                                                            duration: 0,
                                                        }
                                                    }}
                                        />
                                        <VictoryBar
                                            style={{ data: { fill: chartColors.Plan, fillOpacity: 0.8, } }}
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
                                            style={{ data: { fill: chartColors.Diary, fillOpacity: 0.8, } }}
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
                                            style={{ data: { fill: chartColors.goals, fillOpacity: 0.8, } }}
                                            alignment="start"
                                            data={this.state.graphData.goals}
                                            barRatio={0.8}
                                            animate={{
                                                onExit: {
                                                    duration: 0,
                                                }
                                            }}
                                        />
                                        <VictoryBar
                                            style={{ data: { fill: chartColors.reports, fillOpacity: 0.8, } }}
                                            alignment="start"
                                            data={this.state.graphData.reports}
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
                        </View>
                        <Modal visible={this.state.modalVisible} transparent={false} onRequestClose={this.handleModalClose}>
                            <View style={{flex: 1}}>
                                <View style={overviewStyle.closeButton}>
                                    <PressableIcon
                                        size={45}
                                        iconName={Icons.closeModal}
                                        color={AppColors.blue}
                                        onPressFunction={this.handleModalClose}
                                    />
                                </View>
                                <View style={{flex: 1}}>
                                    <View style={{flex: 1, marginBottom: 50}}>
                                        <CustomMultiSelectList
                                            options={periods}
                                            multiple={false} //
                                            returnValue={"label"} // label or value
                                            callback={this.handleSelection} // callback, array of selected items
                                            rowBackgroundColor={"#fff"}
                                            rowHeight={40}
                                            rowRadius={5}
                                            iconColor={"#00a2dd"}
                                            iconSize={25}
                                            selectedIconName={"ios-checkmark-circle-outline"}
                                            unselectedIconName={"ios-radio-button-off-outline"}
                                            search={true}
                                            selected={this.state.selectedTimeFrame}
                                        />
                                    </View>
                                    <TouchableHighlight
                                        style={[overviewStyle.button, themeStyles.multiSelectSaveButton]}
                                        onPress={this.handleFinalSelection}
                                        underlayColor='#99d9f4'>
                                        <Text style={[overviewStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </Modal>
                        <Modal visible={this.state.emailModalVisible} transparent={false} onRequestClose={this.handleEmailModalClose}>
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={overviewStyle.closeButton}>
                                        <PressableIcon
                                            size={45}
                                            iconName={Icons.closeModal}
                                            color={AppColors.blue}
                                            onPressFunction={this.handleEmailModalClose}
                                        />
                                    </View>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: Expo.Constants.statusBarHeight, justifyContent: 'center'}}>
                                        <Text style={{color: AppColors.blue, paddingRight: 5}}>Select Recipient(s)</Text>
                                        <PressableIcon
                                            iconName={Icons.info + '-outline'}
                                            size={25}
                                            onPressFunction={this.infoAlert}
                                            color='#007AFF'
                                        />
                                    </View>
                                </View>
                                <View style={{flex: 1}}>
                                    <View style={{flex: 1, marginBottom: 50}}>
                                        <CustomMultiSelectList
                                            options={this.props.recipients}
                                            multiple={true} //
                                            returnValue={"label"} // label or value
                                            callback={this.handleEmailSelection} // callback, array of selected items
                                            rowBackgroundColor={"#fff"}
                                            rowHeight={40}
                                            rowRadius={5}
                                            iconColor={"#00a2dd"}
                                            iconSize={25}
                                            selectedIconName={"ios-checkmark-circle-outline"}
                                            unselectedIconName={"ios-radio-button-off-outline"}
                                            search={true}
                                        />
                                    </View>
                                    <TouchableHighlight
                                        style={[overviewStyle.button, themeStyles.multiSelectSaveButton]}
                                        onPress={this.handleFinalEmailSelection}
                                        underlayColor='#99d9f4'>
                                        <Text style={[overviewStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
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
        alignSelf: 'center'
    },

    button: {
        margin:15,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});

