import React from 'react';
import {Button, ScrollView, StyleSheet, Text, View, WebView, TouchableOpacity, Share, Dimensions, Platform, ActivityIndicator} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import {Icons} from "../../Constants/Icon";
import {diaryHtml, safetyPlanHtml} from "../../Components/HTML";
import {readDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import {DbTableNames, SafetyPlanDbTables} from "../../Constants/Constants";
import Moment from 'moment'
import {ComponentStyleConst} from "../../Styles/TabStyles";

export default class DiaryReport extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const {params = {}} = navigation.state;

        return {
            title: "Diary Report",
            headerRight: (
                <View style={{paddingRight: 10, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                        name={Icons.print + '-outline'}
                        size={30}
                        onPress={() => params.handlePrint()}
                        color={ComponentStyleConst.headerRightIconColor}
                    />
                </View>
            ),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            diaryData: [],
            resultData: [],
            dataReady: false
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            handleThis: this.takeScreenShot,
            handlePrint: this.print
        });

        this.getDiaryList(this.getResultData)
    }

    print = () => {
        Expo.DangerZone.Print.printAsync({
            html: diaryHtml(this.state.diaryData, this.state.resultData)
        }).then(res => console.log(res)).catch(err => console.log(err))
    };

    getDiaryList = (func) => {
        readDatabaseArg('*', DbTableNames.diary, res => this.setState({diaryData: res}, func), undefined, 'where diaryType = "Feeling" or diaryType = "Skill"')
    };

    getResultData = () => {
        const columns = "s.diaryDate, ds.rating, d.diaryName, d.diaryType";
        const selectedDate = this.props.navigation.getParam('date');

        readDatabaseArg(columns,
            DbTableNames.diarySession,
            res =>  this.setState({resultData: res}, () => this.setState({dataReady: true})),
            undefined,
            " as ds inner join Diary as d on ds.diaryId = d.diaryId inner join Session as s on ds.sessionId = s.sessionId" +
            " where DATE(diaryDate) between Date('" + Moment(this.props.navigation.getParam('date')).subtract(6,'d').format('YYYY-MM-DD') + "') and Date('" + selectedDate + "') and (diaryType = 'Feeling' or diaryType = 'Skill')");
    };

    takeScreenShot = () => {
        Expo.takeSnapshotAsync(this.webView, {
            format: 'png',
            quality: 1,
            result: 'file',
        }).then(res => {
            Share.share({
                ...Platform.select({
                    ios: {
                        message: 'Have a look on : ',
                        url: res,
                    },
                    android: {
                        message: 'Have a look on : \n' + res
                    }
                }),
                title: 'Wow, did you see that?'
            }, {
                ...Platform.select({
                    android: {
                        // Android only:
                        dialogTitle: 'Share : '
                    }
                })
            }).then(res => console.log(res))
                .catch(err => console.log(err));
        })
    };

    render() {
        return (
            <View collapsable={false} style={{flex: 1}} ref={ref => (this.webView = ref)}>
                {this.state.dataReady ?
                    <WebView
                        originWhitelist={['*']}
                        source={{html: diaryHtml(this.state.diaryData, this.state.resultData, this.props.navigation.getParam('date'))}}
                    /> :
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                }
            </View>
        )
    }
}

const diaryReportStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },

});