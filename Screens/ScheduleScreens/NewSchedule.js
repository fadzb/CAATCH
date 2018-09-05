import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Modal, Dimensions, Alert } from 'react-native';
import t from 'tcomb-form-native'
import { PressableIcon } from "../../Components/PressableIcon";
import store from "../../Redux/store"
import {updateCoping, getCoping, updateSchedule, getSchedule} from "../../Redux/actions";
import {Icons} from "../../Constants/Icon";
import {CalendarView} from "../../Components/CalendarView";
import Moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {TabStyles} from "../../Styles/TabStyles";
import {updateDatabase, updateDatabaseArgument, readDatabaseArg, deleteDatabaseRow, readDatabase} from "../../Util/DatabaseHelper";

const Form = t.form.Form;

const cope = t.struct({
    title: t.String,
    description: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
    fields: {
        title: {
            placeholder: 'Title',
            auto: 'none'
        },
        description: {
            placeholder: 'Description',
            auto: 'none'
        },
    }
};
// for customizing form UI

export default class NewSchedule extends React.Component {
    static navigationOptions = {
        title: "Appointment"
    };

    constructor(props) {
        super(props);

        this.state = {
            value: null,
            schDate: "",
            fromTime: "",
            fromTimeSelected: false,
            toTime: "",
            toTimeSelected: false,
            modalVisible: false,
            timePickerVisible: false,
            validTime: true,
            validDate: true,
            validFromTime: true
        }
    }

    componentDidMount() {
        if(this.props.navigation.getParam('id') !== undefined) {
            this.setState({
                value: {
                    title: this.props.navigation.getParam('title'),
                    description: this.props.navigation.getParam('description')
                },
                schDate: this.props.navigation.getParam('date'),
                fromTime: this.props.navigation.getParam('timeFrom'),
                toTime: this.props.navigation.getParam('timeTo'),
                fromTimeSelected: false,
                toTimeSelected: false,

            })
        } else {
            this.setState({
                schDate: store.getState().schedule.date
            })
        }
    }
    // checking if entered through existing appt and set state appropriately

    onChange = (value) => {
        this.setState({ value: value })
    };

    onPress = () => {
        const value = this.refs.form.getValue();
        // returns values captured in form as object

        if(this.state.schDate === '') {
            this.setState({validDate: false})
        } else if(this.state.fromTime === '') {
            this.setState({validFromTime: false, validDate: true})
        } else if(this.state.toTime !== '' && this.state.toTime < this.state.fromTime) {
            this.setState({validTime: false, validFromTime: true})
            // various form validation checks
        } else if (value) {
            // if validation fails, value will be null
            let resultItem = {};

            const timeFrom = this.state.fromTime;
            const timeTo = this.state.toTime !== '' ? this.state.toTime : null;


            if(this.props.navigation.getParam('edit')) {
                // DB update for existing appt's
                const scheduleId = this.props.navigation.getParam('id');

                updateDatabaseArgument('Schedule', [...Object.values(value), this.state.schDate, timeFrom, timeTo],
                    [...Object.keys(value), 'date', 'timeFrom', 'timeTo'], 'where scheduleId = ' + scheduleId,
                    undefined,
                    res => this.getGlobalSchedule());
            } else {
                updateDatabase("Schedule", [...Object.values(value), this.state.schDate, timeFrom, timeTo],
                    [...Object.keys(value), 'date', 'timeFrom', 'timeTo'],
                    undefined,
                    res => this.getGlobalSchedule());
                // write the saved values to DB if valid and update global redux store accordingly
            }
        }
    };

    getGlobalSchedule = () => {
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
                            timeTo: sch.timeTo
                        }]
                    } else {
                        resultItems[sch.date].push({
                            id: sch.scheduleId,
                            date: sch.date,
                            title: sch.title,
                            description: sch.description,
                            timeFrom: sch.timeFrom,
                            timeTo: sch.timeTo
                        })
                    }
                });
                // push details onto date array if an item already exists

                store.dispatch(getSchedule(resultItems));

                this.props.navigation.pop();
                // pop back to schedule once saved
            });
    };

    toggleModal = bool => {
        this.setState({modalVisible: bool})
    };

    toggleTimePicker = (bool, timeType) => {
        if(timeType === 'from') {
            this.setState({timePickerVisible: bool, fromTimeSelected: bool})
        } else if(timeType === undefined) {
            this.setState({timePickerVisible: bool, fromTimeSelected: bool, toTimeSelected: bool})
        } else {
            this.setState({timePickerVisible: bool, toTimeSelected: bool})
        }
    };

    handleDateSelection = date => this.setState({schDate: date.dateString}, this.toggleModal(false));

    handleTimeSelection = time => {
        if(this.state.fromTimeSelected) {
            this.setState({fromTime: Moment(time).format('h:mm A')})
        } else {
            this.setState({toTime: Moment(time).format('h:mm A')})
        }

        this.toggleTimePicker(false)
    };

    showAlert = () => {
        Alert.alert(
            'Delete Appointment',
            'Are you sure you want to delete this appointment?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteAppointment(), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    deleteAppointment = () => {
        const scheduleId = this.props.navigation.getParam('id');

        deleteDatabaseRow('Schedule', 'where scheduleId = ' + scheduleId, this.getGlobalSchedule)
    };

    render() {
        return(
            <View style={TabStyles.planContainer}>
                <View style={newScheduleStyle.formContainer}>
                    <PressableIcon
                        iconName={Icons.calendar + '-outline'}
                        size={25}
                        onPressFunction={onPress=() => this.toggleModal(true)}
                        name={this.state.schDate === "" ? 'Date' : Moment(this.state.schDate).format('LL')}
                        buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                        buttonStyle={[newScheduleStyle.listButton, !this.state.validDate && {borderColor: '#a94442'}]}
                        textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                        iconStyle={{alignSelf: 'center', alignItems: 'center', paddingRight: 10}}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <PressableIcon
                            iconName={Icons.clock + '-outline'}
                            size={25}
                            onPressFunction={onPress=() => this.toggleTimePicker(true, "from")}
                            name={this.state.fromTime === "" ? 'From' : this.state.fromTime}
                            buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                            buttonStyle={[newScheduleStyle.timeButton, !this.state.validFromTime && {borderColor: '#a94442'}]}
                            textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                            iconStyle={{alignSelf: 'center', alignItems: 'center', paddingRight: 10}}
                        />
                        <PressableIcon
                            iconName={Icons.clock + '-outline'}
                            size={25}
                            onPressFunction={onPress=() => this.toggleTimePicker(true, "to")}
                            name={this.state.toTime === "" || this.state.toTime === null ? 'To' : this.state.toTime}
                            buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                            buttonStyle={[newScheduleStyle.timeButton, !this.state.validTime && {borderColor: '#a94442'}]}
                            textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                            iconStyle={{alignSelf: 'center', alignItems: 'center', paddingRight: 10}}
                        />
                    </View>
                    <Form
                        ref="form"
                        type={cope}
                        value={this.state.value}
                        onChange={this.onChange}
                        options={options}
                    />
                    <TouchableHighlight style={newScheduleStyle.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={newScheduleStyle.buttonText}>Save</Text>
                    </TouchableHighlight>
                    {this.props.navigation.getParam('edit') && <PressableIcon
                        iconName={Icons.delete + "-outline"}
                        size={50}
                        onPressFunction={this.showAlert}
                        buttonStyle={newScheduleStyle.deleteButton}
                    />}
                </View>
                <DateTimePicker
                    isVisible={this.state.timePickerVisible}
                    mode={'time'}
                    onCancel={() => this.toggleTimePicker(false)}
                    titleIOS={""}
                    onConfirm={this.handleTimeSelection}
                    is24Hour={false}
                />
                <Modal animationType={'slide'} visible={this.state.modalVisible} transparent={false} onRequestClose={() => this.toggleModal(false)}>
                    <CalendarView
                        onPress={() => this.toggleModal(false)}
                        dayPress={this.handleDateSelection}
                        maxDate={false}
                    />
                </Modal>
            </View>
        )
    }
}

const newScheduleStyle = StyleSheet.create({
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
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    formContainer: {
        margin: 40,
    },
    iconButton: {
        alignItems: "center",
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    listButton: {
        height: 36,
        borderColor: '#cccccc', // <= relevant style here
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: '#f2f2f2',
    },
    timeButton: {
        height: 36,
        width: Dimensions.get('window').width / 2.7,
        borderColor: '#cccccc', // <= relevant style here
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: '#f2f2f2',
        //flex: 1
    },
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    deleteButton: {
        alignSelf: 'center',
        marginTop: 20
    }
});