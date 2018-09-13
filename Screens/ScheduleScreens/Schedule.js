import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, TouchableHighlight, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import {connect} from 'react-redux'
import store from "../../Redux/store"
import {getSchedule, updateScheduleDate} from "../../Redux/actions";
import {readDatabase} from "../../Util/DatabaseHelper";

class Schedule extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Schedule',
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.push('newSchedule')}
                ><Text style={{ padding: 10 }}>New +</Text>
                </TouchableOpacity>
            ),
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            agendaReady: false
        };
    }

    componentDidMount() {
        readDatabase('*',
            'Schedule',
            res => {
                let resultItems = {};

                res.forEach(sch => {
                    if(resultItems[sch.date] === undefined) {
                        resultItems[sch.date] = [{
                            id: sch.scheduleId,
                            date: sch.date,
                            title: sch.title,
                            description: sch.description,
                            timeFrom: sch.timeFrom,
                            timeTo: sch.timeTo,
                            nativeId: sch.nativeCalendarId
                        }]
                    } else {
                        resultItems[sch.date].push({
                            id: sch.scheduleId,
                            date: sch.date,
                            title: sch.title,
                            description: sch.description,
                            timeFrom: sch.timeFrom,
                            timeTo: sch.timeTo,
                            nativeId: sch.nativeCalendarId
                        })
                    }
                });

                this.setState({items: resultItems}, () => {
                    this.updateStore();

                    this.setState({agendaReady: true});
                })
            });
    }
    // reading DB for saved schedule items. Render agenda component once finished through agenda ready state property

    updateStore = () => {
        store.dispatch(getSchedule(this.state.items))
    };
    // update redux store with all db rows in Schedule table

    render() {
        return (
            <View style={scheduleStyle.viewContainer}>
                {this.state.agendaReady ? <Agenda
                    items={this.props.schedule}
                    renderItem={this.renderItem}
                    renderEmptyData={this.renderEmptyDate}
                    rowHasChanged={this.rowHasChanged}
                    onDayPress={day => store.dispatch(updateScheduleDate(day.dateString))}
                /> : <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>}
            </View>
        );
    }

    getDate = (day, date) => {
        const month = '0' + day.month;
        const dateString = '0' + date;

        return (day.year + '-' + month.slice(-2) + '-' + dateString.slice(-2));
    };
    // returns date string in desired text. May need for something else

    renderItem = (item) => <TouchableOpacity style={[scheduleStyle.item, {height: item.height}]} onPress={() => this.props.navigation.push('newSchedule', {...item, edit: true})}>
        <View>
            <Text style={scheduleStyle.timeText}>{item.timeTo !== null ? item.timeFrom + " - " + item.timeTo : item.timeFrom}</Text>
            <Text style={scheduleStyle.titleText}>{item.title}</Text>
            {item.description !== null && <Text style={scheduleStyle.descText}>{item.description}</Text>}
        </View>
    </TouchableOpacity>;

    renderEmptyDate = () => <View style={scheduleStyle.emptyDate}><Text>{""}</Text></View>;
    // display nothing on dates where noo appt exists

    rowHasChanged = (r1, r2) => r1.title !== r2.title || r1.description !== r2.description || r1.date !== r2.date || r1.timeFrom !== r2.timeFrom || r1.timeTo !== r2.timeTo;
    // function that checks whether a row has changed or not
}

const scheduleStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
    },
    timeText: {
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 10
    },
    titleText: {
        fontSize: 15,
        fontWeight: '600',
        paddingBottom: 5
    },
    descText: {
        fontSize: 15,
        color: '#737373'
    }
});

const mapStateToProps = state => ({
    schedule: state.schedule.appointments
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Schedule)
// HOC that re-renders the component automatically every time a particular section of state is updated