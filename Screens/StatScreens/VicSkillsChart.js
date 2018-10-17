import React from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, Modal, TouchableHighlight } from 'react-native';
import {TabStyles} from "../../Styles/TabStyles";
import Moment from 'moment'
import {readDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import CustomMultiPicker from "react-native-multiple-select-list";
import {CustomSelectionRow} from "../../Components/CustomSelectionRow";
import {Icons} from "../../Constants/Icon";
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis, VictoryLabel, VictoryPortal } from 'victory-native';
import {PressableIcon} from "../../Components/PressableIcon";
import {DbTableNames} from "../../Constants/Constants";

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

const skillTypes = {
    '1': 'Mindfulness',
    '2': 'Interpersonal Effectiveness',
    '3': 'Emotion Regulation',
    '4': 'Distress Tolerance',
};

export default class VicSkillsChart extends React.Component {
    static navigationOptions = {
        title: 'Charts - DBT Skills'
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            graphReady: false,
            graphData: [],
            xDomain: [],
            selectedSkillCategory: 1,
            timeFrameSelected: false,
            modalVisible: false,
            checkedItemTime: periods.week,
            selectedTimeFrame: periods.week,
            skillList: [],
            checkedItemSkill: 1,
            data: []
        }
    }

    componentDidMount() {
        this.getSkillList(this.getSkillEntries(timeFrames.weekDate));
    }

    toggleModal = bool => {
        this.setState({modalVisible: bool})
    };

    handleModalClose = () => {
        this.toggleModal(false);

        this.setState({timeFrameSelected: false})
    };

    getSkillEntries = (timeFrame) => {
        this.setState({graphReady: false}, () => {
            const columns = "s.diaryDate, sum(ds.rating) as 'ratingSum', d.diaryName, d.diaryId, d.subType, d.chartLabel";
            const today = Moment().format("YYYY-MM-DD");

            readDatabaseArg(columns,
                "DiarySession",
                res => {
                    this.setState({data: res}, () => this.transformData(res))
                },
                undefined,
                " as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId" +
                " where DATE(diaryDate) between Date('" + timeFrame + "') and Date('" + today + "') and diaryType = 'Skill' group by d.diaryId");
        })
    };

    getSkillList = (func) => {
        readDatabase('*', 'Diary', res => {
            this.setState({skillList: res.filter(sk => sk.diaryType === "Skill")}, func)
        })
    };

    handleSelection = item => {
        if(this.state.timeFrameSelected) {
            this.setState({
                checkedItemTime: item[0]
            });
        } else {
            this.setState({
                checkedItemSkill: Number(item[0])
            });
        }
    };
    // update state as boxes are ticked in either selection list

    handleFinalSelection = () => {
        this.handleModalClose();

        this.setState({graphReady: false}, () => setTimeout(() => {

            if (this.state.checkedItemTime !== this.state.selectedTimeFrame) {
                this.setState({selectedTimeFrame: this.state.checkedItemTime}, () => {
                    if (this.state.checkedItemTime === periods.week) {
                        this.getSkillEntries(timeFrames.weekDate)
                    } else if (this.state.checkedItemTime === periods.month) {
                        this.getSkillEntries(timeFrames.monthDate)
                    } else if (this.state.checkedItemTime === periods.sixMonth) {
                        this.getSkillEntries(timeFrames.sixMonthDate)
                    } else {
                        this.getSkillEntries(timeFrames.yearDate)
                    }
                });
            }

            if (this.state.checkedItemSkill !== this.state.selectedSkillCategory) {
                this.setState({selectedSkillCategory: this.state.checkedItemSkill}, () => this.transformData(this.state.data));
            }
        }, 10))
    };

    transformData = res => {
        this.setState({graphData: res.filter(r => r.subType === this.state.selectedSkillCategory).map(sk => ({y: sk.ratingSum, x: sk.chartLabel}))}, this.getXDomain)
    };

    getXDomain = () => {
        const maxRatingSum = Math.max(...this.state.graphData.map(a => a.y));

        if(this.state.graphData.length === 0 || maxRatingSum === 0) {
            this.setState({xDomain: [0, 3]}, () => this.setState({graphReady: true}))
        } else {
            this.setState({xDomain: [0, maxRatingSum + 1]}, () => this.setState({graphReady: true}))
        }
    };

    setCategory = () => {
        return this.state.skillList.filter(sk => sk.subType === this.state.selectedSkillCategory).map(t => t.chartLabel)
    };

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                {this.state.graphReady ?
                    <View>
                        <VictoryChart
                            height={Dimensions.get('window').height * .55}
                            theme={VictoryTheme.material}
                            //domainPadding={10}
                            padding={{ left: 80, top: 40, right: 30, bottom: 35 }}
                            domain={{x: this.state.xDomain}}
                            categories={this.state.graphData.length === 0 && {
                                x: this.setCategory()
                            }}
                        >
                            <VictoryAxis
                                fixLabelOverlap={true}
                            />
                            <VictoryAxis dependentAxis
                                         tickFormat={(t) => t.toString().replace(' ', '\n')}
                                         tickLabelComponent={<VictoryPortal><VictoryLabel/></VictoryPortal>}
                                         style={{
                                             tickLabels: { fontSize: 10 }
                                         }}
                            />
                            <VictoryBar horizontal
                                        style={{ data: { fill: "#c43a31", fillOpacity: 0.8, } }}
                                        data={this.state.graphData}
                                        alignment="start"
                                        animate={{
                                            onExit: {
                                                duration: 0,
                                            }
                                        }}
                            />
                        </VictoryChart>
                        <View style={{height: Dimensions.get('window').height * .2}}>
                            <CustomSelectionRow
                                name="Skill Category"
                                icon={Icons.skills + '-outline'}
                                iconSize={Dimensions.get('window').height / 20}
                                iconContainer={chartStyle.iconContainer}
                                selectedText={skillTypes[this.state.selectedSkillCategory.toString()]}
                                onPress={() => this.toggleModal(true)}
                                nameStyle={{fontSize: 16}}
                                selectedTextViewStyle={{flex: .7, alignItems: 'flex-end'}}
                            />
                            <CustomSelectionRow
                                name="Time Frame"
                                icon={Icons.calendar + '-outline'}
                                iconSize={Dimensions.get('window').height / 20}
                                iconContainer={chartStyle.iconContainer}
                                selectedText={this.state.selectedTimeFrame}
                                onPress={() => this.setState({timeFrameSelected: true}, () => this.toggleModal(true))}
                                nameStyle={{fontSize: 16}}
                            />
                        </View>
                        <Modal visible={this.state.modalVisible} transparent={false} onRequestClose={this.handleModalClose}>
                            <View style={{flex: 1}}>
                                <View style={chartStyle.closeButton}>
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
                                            options={this.state.timeFrameSelected ? periods : skillTypes}
                                            multiple={false} //
                                            returnValue={this.state.timeFrameSelected ? "label" : "id"} // label or value
                                            callback={this.handleSelection} // callback, array of selected items
                                            rowBackgroundColor={"#fff"}
                                            rowHeight={40}
                                            rowRadius={5}
                                            iconColor={"#00a2dd"}
                                            iconSize={25}
                                            itemStyle={chartStyle.itemStyle}
                                            selectedIconName={"ios-checkmark-circle-outline"}
                                            unselectedIconName={"ios-radio-button-off-outline"}
                                            search={true}
                                            selected={this.state.timeFrameSelected ? this.state.selectedTimeFrame : this.state.selectedSkillCategory.toString()}
                                        />
                                    </View>
                                    <TouchableHighlight
                                        style={chartStyle.button}
                                        onPress={this.handleFinalSelection}
                                        underlayColor='#99d9f4'>
                                        <Text style={chartStyle.buttonText}>Done</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </Modal>
                    </View> :
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>}
            </View>
        );
    }
}

const chartStyle = StyleSheet.create({
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

