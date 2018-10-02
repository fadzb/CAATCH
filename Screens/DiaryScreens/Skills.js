import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Moment from 'moment';
import SkillRow from '../../Components/SkillRow'
import {connect} from 'react-redux'
import store from "../../Redux/store"
import {resetSkillRating} from "../../Redux/actions";
import {deleteDatabaseRow, readDatabaseArg, updateDatabase, updateDatabaseArgument} from "../../Util/DatabaseHelper";
import {diaryPrePops} from "../../Constants/Prepopulated";
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import {DbTableNames} from "../../Constants/Constants";
import {updateNotifications} from "../../Util/Notifications";

class Skills extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const diaryDate = store.getState().diary.date;

        return {
            title: 'Skills' + " " + Moment(diaryDate).format('DD.MM.YYYY'),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            skills: [],
            sessionDate: new Date(),
            prevSelected: false,
            historyChecked: false,
            savePressed: false
        }
    }

    componentDidMount() {
        this.getSkills(diaryPrePops);

        this.checkPreviousEntry();
    }

    createSession = () => {
        updateDatabase(DbTableNames.session,
            [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), this.props.diaryDate],
            ["dateEntered", "diaryDate"],
            undefined,
            (res) => this.handleSave(res.insertId))
    };
    // when user presses save - create session in DB with date recorded at screen opening

    getSkills = diaryItem => {
        this.setState({ skills: diaryItem.filter(d => d.diaryType === "Skill") })
    };

    checkPreviousEntry = () => {
        const selectedDate = Moment(this.props.diaryDate).format("YYYY-MM-DD");
        const columns = "d.sessionId, s.diaryDate, d.diaryId, d.rating, di.diaryType, di.subType, di.diaryName, di.info";

        readDatabaseArg(columns,
            DbTableNames.diarySession,
            this.savePrevSelected,
            undefined,
            " as d inner join " + DbTableNames.session + " as s on d.sessionId = s.sessionId inner join " + DbTableNames.diary + " as di on d.diaryId = di.diaryId" +
            " where DATE(diaryDate) = '" + selectedDate + "' and diaryType = 'Skill'");
    };
    // check if previous entry is saved for this date and, if yes, get that info for current state

    savePrevSelected = (res) => {
        if(res.length !== 0) {
            this.setState({skills: res}, () => {
                this.setState({historyChecked: true, prevSelected: true})
            })
        } else {
            this.setState({historyChecked: true})
        }
    };
    // need to keep track of when we checked through callback in order to delay render of flatlist component

    handleSave = (sessionId) => {
        this.props.skillRating.forEach(rating => {
            updateDatabase(DbTableNames.diarySession,
                [sessionId, rating.id, rating.rating],
                ['sessionId', 'diaryId', 'rating'],
                () => store.dispatch(resetSkillRating(diaryPrePops.filter(t => t.diaryType === "Skill").map(s => ({id: s.diaryId, rating: 0})))))
        });

        if(this.state.prevSelected) {
            this.state.skills.forEach(rating => {
                deleteDatabaseRow(DbTableNames.diarySession, 'where diaryId = ' + rating.diaryId + ' and sessionId = ' + rating.sessionId)
            })
        }

        updateNotifications();

        this.props.navigation.pop();
    };
    //after creating session transaction in DB - write ratings to DB, reset global ratings store and pop back to previous screen
    //if there was already data saved for that day - delete. Only storing one entry for skills

    render() {
        const mindfulness = 1;
        const interpersonalEffectiveness = 2;
        const emotionRegulation = 3;
        const distressTolerance = 4;

        const NUMBER_OF_TABS = 4;

        return (
            <View style={skillStyle.viewContainer}>
                {this.state.historyChecked ? <Container>
                    <StyleProvider style={getTheme(platform)}>
                        <Tabs prerenderingSiblingsNumber={NUMBER_OF_TABS}>
                            <Tab heading={"M"}>
                                <View style={{flex: 1}}>
                                    {this.state.skills.filter(sk => sk.subType === mindfulness).map(skill => {
                                        return(
                                            <View key={skill.diaryId} style={{flex : 1}}>
                                                <SkillRow
                                                    name= {skill.diaryName}
                                                    info={skill.info}
                                                    index= {skill.diaryId}
                                                    prevSelected={(this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating !== undefined
                                                        ? (this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating
                                                        : null}
                                                    savePressed={this.state.savePressed}
                                                />
                                            </View>
                                        )
                                    })}
                                    <TouchableOpacity style={skillStyle.button} onPress={this.createSession}>
                                        <Text style={skillStyle.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                            <Tab heading={"IE"}>
                                <View style={{flex: 1}}>
                                    {this.state.skills.filter(sk => sk.subType === interpersonalEffectiveness).map(skill => {
                                        return(
                                            <View key={skill.diaryId} style={{flex : 1}}>
                                                <SkillRow
                                                    name= {skill.diaryName}
                                                    info={skill.info}
                                                    index= {skill.diaryId}
                                                    prevSelected={(this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating !== undefined
                                                        ? (this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating
                                                        : null}
                                                    savePressed={this.state.savePressed}
                                                />
                                            </View>
                                        )
                                    })}
                                    <TouchableOpacity style={skillStyle.button} onPress={this.createSession}>
                                        <Text style={skillStyle.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                            <Tab heading={"ER"}>
                                <View style={{flex: 1}}>
                                    {this.state.skills.filter(sk => sk.subType === emotionRegulation).map(skill => {
                                        return(
                                            <View key={skill.diaryId} style={{flex : 1}}>
                                                <SkillRow
                                                    name= {skill.diaryName}
                                                    info={skill.info}
                                                    index= {skill.diaryId}
                                                    prevSelected={(this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating !== undefined
                                                        ? (this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating
                                                        : null}
                                                    savePressed={this.state.savePressed}
                                                />
                                            </View>
                                        )
                                    })}
                                    <TouchableOpacity style={skillStyle.button} onPress={this.createSession}>
                                        <Text style={skillStyle.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                            <Tab heading={"DT"}>
                                <View style={{flex: 1}}>
                                    {this.state.skills.filter(sk => sk.subType === distressTolerance).map(skill => {
                                        return(
                                            <View key={skill.diaryId} style={{flex : 1}}>
                                                <SkillRow
                                                    name= {skill.diaryName}
                                                    info={skill.info}
                                                    index= {skill.diaryId}
                                                    prevSelected={(this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating !== undefined
                                                        ? (this.state.skills.filter(sk => sk.diaryId === skill.diaryId))[0].rating
                                                        : null}
                                                    savePressed={this.state.savePressed}
                                                />
                                            </View>
                                        )
                                    })}
                                    <TouchableOpacity style={skillStyle.button} onPress={this.createSession}>
                                        <Text style={skillStyle.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                        </Tabs>
                    </StyleProvider>
                </Container> : <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                </View>}
            </View>
        );
    }
    // rendering flatlist conditionally in order to display previously filled in entries
}

const skillStyle = StyleSheet.create({
    listContainer: {
        alignSelf: 'stretch',
    },

    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
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
});

const mapStateToProps = state => ({
    skillRating: state.diary.skillRating,
    diaryDate: state.diary.date
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Skills)
// HOC that re-renders the component automatically every time a particular section of state is updated