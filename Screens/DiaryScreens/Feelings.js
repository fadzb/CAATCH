import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import {diaryPrePops, updateDiaryPrePops} from "../../Constants/Prepopulated";
import FeelingRow from '../../Components/FeelingRow'
import {deleteDatabaseRow, updateDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import Moment from 'moment';
import {connect} from 'react-redux'
import {resetFeelingRating, updateFeelingRating} from "../../Redux/actions";
import store from "../../Redux/store"
import {DbTableNames, DiaryId, SectionHeader, UsedSkillRating} from "../../Constants/Constants";
import {updateNotifications} from "../../Util/Notifications";
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import RNPickerSelect from 'react-native-picker-select';
import {Icons} from "../../Constants/Icon";
import Icon from 'react-native-vector-icons/Ionicons'
import {PressableIcon} from "../../Components/PressableIcon";

const USED_SKILLS = 'Used Skills';

class Feelings extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const diaryDate = store.getState().diary.date;

        return {
            title: SectionHeader.info + " " + Moment(diaryDate).format('DD.MM.YYYY'),
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.push('feelingsSummary')}
                ><Text style={{ padding: 10 }}>Archive</Text>
                </TouchableOpacity>
            ),
        }
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            feelings: [],
            sessionDate: new Date(),
            usedSkillRating: 'Select Rating...',
            usedSkill: {},
            dataReady: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const newFeeling = nextProps.navigation.getParam('newFeeling', null);

        if(newFeeling !== this.props.navigation.getParam('newFeeling', null)) {
            if (newFeeling !== null) {
                this.getFeelings()
            } else {
                console.log("no feeling added");
            }
        }
    }
    // listen for new props coming from pre-populated screen and update accordingly

    componentDidMount() {
        this.getFeelings()
    }

    getFeelings = () => {
        readDatabaseArg('*', DbTableNames.diary, res => this.setState({feelings: res}, () => {
            this.setState({usedSkill: this.state.feelings.filter(fe => fe.diaryId === DiaryId.usedSkills)[0]}, () => this.setState({dataReady: true}))
        }), undefined, 'where diaryType = "Feeling"');
    };

    createSession = () => {
        updateDatabase(DbTableNames.session,
            [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), this.props.diaryDate],
            ["dateEntered", "diaryDate"],
            undefined,
            (res) => this.handleSave(res.insertId))
    };
    // when user presses save - create session in DB with date recorded at screen opening

    handleSave = (sessionId) => {
        this.props.feelingRating.forEach(rating => {
            updateDatabase(DbTableNames.diarySession,
                [sessionId, rating.id, rating.rating],
                ['sessionId', 'diaryId', 'rating'],
                () => store.dispatch(resetFeelingRating(diaryPrePops.filter(t => t.diaryType === "Feeling").map(f => ({id: f.diaryId, rating: 0})))))
        });

        updateNotifications();

        this.props.navigation.pop();
    };
    // iterate through global rating store for feelings and save in DB

    deleteDbtItem = id => {
        deleteDatabaseRow(DbTableNames.diary, 'where diaryId = ' + id, res => {
            updateDiaryPrePops(this.getFeelings)
        })
    };

    showAlert = (id) => {
        Alert.alert(
            'Delete DBT Item',
            'Are you sure you want to delete this DBT Item?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteDbtItem(id), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    renderItem = ({item}) => {
        return (
            <View style={feelingStyle.listContainer}>
                <FeelingRow
                    feeling={item}
                    deleteFunction={() => this.showAlert(item.diaryId)}
                />
            </View>
        )
    };
    // prevSelected prop contains the history for that day if it was already filled in

    createRatingArr = (min, max) => {
        let ratingArr = [];

        for(let i = min; i <= max; i++) {
            ratingArr.push({label: i.toString() + '. ' + UsedSkillRating[i], value: i})
        }

        return ratingArr;
    };

    infoAlert = () => {
        Alert.alert(
            USED_SKILLS,
            this.state.usedSkill.info,
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };
    // alert for displaying feeling info

    render() {
        const urges = 1;
        const feelings = 2;
        const usedSkills = 3;

        const NUMBER_OF_TABS = 3;

        return (
            <View style={feelingStyle.viewContainer}>
                {this.state.dataReady ? <Container>
                    <StyleProvider style={getTheme(platform)}>
                        <Tabs locked={true} prerenderingSiblingsNumber={NUMBER_OF_TABS}>
                            <Tab heading={"Urges"}>
                                <FlatList
                                    data={this.state.feelings.filter(f => f.subType === urges)}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                <View style={feelingStyle.twoButtonContainer}>
                                    <TouchableOpacity style={feelingStyle.buttonsNew} onPress={() => this.props.navigation.push('newDbtItem', {subType: urges})}>
                                        <Text style={feelingStyle.buttonNewText}>New</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={feelingStyle.buttons} onPress={this.createSession}>
                                        <Text style={feelingStyle.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                            <Tab heading={"Feelings"}>
                                <FlatList
                                    data={this.state.feelings.filter(f => f.subType === feelings)}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                <View style={feelingStyle.twoButtonContainer}>
                                    <TouchableOpacity style={feelingStyle.buttonsNew} onPress={() => this.props.navigation.push('newDbtItem', {subType: feelings})}>
                                        <Text style={feelingStyle.buttonNewText}>New</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={feelingStyle.buttons} onPress={this.createSession}>
                                        <Text style={feelingStyle.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                            <Tab heading={"Used Skills"}>
                                <View style={{flex: 1, marginHorizontal: 15, marginTop: 10}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 15}}>
                                        <PressableIcon
                                            iconName={Icons.info + '-outline'}
                                            size={25}
                                            onPressFunction={this.infoAlert}
                                            color='#007AFF'
                                        />
                                        <Text style={{paddingLeft: 10, fontSize: 15}}>{USED_SKILLS}</Text>
                                    </View>
                                    <RNPickerSelect
                                        placeholder={{
                                            label: 'Select Rating...',
                                            value: null,
                                        }}
                                        items={this.createRatingArr(this.state.usedSkill.minRating, this.state.usedSkill.scale)}
                                        onValueChange={(value) => {
                                            if(value !== null) {
                                                this.setState({usedSkillRating: value + '. ' + UsedSkillRating[value]});

                                                store.dispatch(updateFeelingRating({
                                                    id: this.state.usedSkill.diaryId,
                                                    rating: value
                                                }))
                                            } else {
                                                this.setState({usedSkillRating: value});

                                                store.dispatch(updateFeelingRating({
                                                    id: this.state.usedSkill.diaryId,
                                                    rating: 0
                                                }))
                                            }
                                        }}
                                        hideIcon={true}
                                    >
                                        <View style={[feelingStyle.listButton, {justifyContent: 'space-between', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7}]}>
                                            <Text style={{fontSize: 14, color: '#4d4d4d'}}>{this.state.usedSkillRating === null ? 'Select Rating...' : this.state.usedSkillRating}</Text>
                                            <Icon
                                                name={Icons.down}
                                                size={30}
                                                color={'#4d4d4d'}
                                            />
                                        </View>
                                    </RNPickerSelect>
                                </View>
                                <TouchableOpacity style={feelingStyle.button} onPress={this.createSession}>
                                    <Text style={feelingStyle.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </Tab>
                        </Tabs>
                    </StyleProvider>
                </Container> : <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>}
            </View>
        );
    }
}

const feelingStyle = StyleSheet.create({
    listContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    viewContainer: {
        flex: 1,
    },
    buttonText: {
        fontSize: 18,
        color: '#007AFF',
        alignSelf: 'center',
    },
    button: {
        height: 36,
        backgroundColor: '#fff',
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 8,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    buttons: {
        height: 36,
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        marginHorizontal: 5
    },
    buttonNewText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
    },
    buttonsNew: {
        height: 36,
        flex: 1,
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        marginHorizontal: 5
    },
    twoButtonContainer: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 5
    },
    listButton: {
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7
    },
});


const mapStateToProps = state => ({
    feelingRating: state.diary.feelingRating,
    diaryDate: state.diary.date
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Feelings)
// HOC that re-renders the component automatically every time a particular section of state is updated