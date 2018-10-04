import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, Dimensions, Alert } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Toast } from 'native-base';
import {Icons} from "../../Constants/Icon";
import PINCode from '@haskkor/react-native-pincode'
import {updateDatabase, readDatabase, updateDatabaseArgument, readDatabaseArg} from "../../Util/DatabaseHelper";
import {SettingsSelectionRow} from "../../Components/SettingsSelectionRow";
import { Constants } from 'expo';
import {PressableIcon} from "../../Components/PressableIcon";
import {updateDbtSetting} from "../../Redux/actions";
import store from "../../Redux/store"
import Moment from 'moment'
import {updateEmail} from "../../Redux/actions";

import {TabStyles} from "../../Styles/TabStyles";
import {DbTableNames} from "../../Constants/Constants";

const DBT = 'Dialectical Behaviour Therapy (DBT) is a treatment programme aimed at helping people with ongoing difficulties managing intense emotions';

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: "Settings"
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            switchValue: false,
            dbtSwitchValue: false,
            notificationSwitchValue: false
        }
    }

    componentDidMount() {
        readDatabase('*', 'User', this.getSwitchValues);
        // get user settings
    }

    getSwitchValues = dbObject => {
        const switchValue = dbObject[0].enabled;
        const dbtSwitchValue = dbObject[0].dbt;
        const notificationSwitchValue = dbObject[0].notifications;

        this.setState({
            switchValue: Boolean(switchValue),
            dbtSwitchValue: Boolean(dbtSwitchValue),
            notificationSwitchValue: Boolean(notificationSwitchValue)
        });

        // setting switches based on values in DB


        const email = dbObject[0].email;

        if(email) {
            store.dispatch(updateEmail(email))
        }
        // if email already saved in db, dispatch saved email to redux store
    };

    toggleModal = bool => {
        this.setState({modalVisible: bool})
    };

    handlePinStore = pin => {
        updateDatabaseArgument('User',
            [pin, 1],
            ['passcode', 'enabled'],
            'where userId = 1',
            this.setState({switchValue: true, modalVisible: false}));
    };
    // saving pin to USER table in DB

    handleSwitch = value => {
        this.setState(prevState => {
            if(prevState.switchValue === true) {
                updateDatabaseArgument('User',
                    [0],
                    ['enabled'],
                    'where userId = 1')
            }

            return {switchValue: !prevState.switchValue}
        },() => this.toggleModal(this.state.switchValue));
    };

    handleCancelModal = () => {
        this.setState({switchValue: false, modalVisible: false})
    };

    handleDbtSwitch = value => {
        this.setState(prevState => {
            const newValue = !prevState.dbtSwitchValue;
            const convertBool = newValue ? 1 : 0;

            updateDatabaseArgument(DbTableNames.user, [convertBool], ['dbt'], 'where userId = 1', undefined, res => store.dispatch(updateDbtSetting(newValue)));

            return {dbtSwitchValue: newValue}
        })
    };

    handleNotificationSwitch = value => {
        if(!this.state.notificationSwitchValue) {
            Expo.Permissions.askAsync(Expo.Permissions.USER_FACING_NOTIFICATIONS)
                .then(response => {
                    if (response.status !== "granted") {
                        console.log("Notification permission not granted!");

                        Toast.show({
                            text: 'Allow app notifications in device settings!',
                            //buttonText: 'Okay',
                            duration: 2000,
                            style: { marginBottom: 50 }
                        });

                        return;
                    }

                    this.toggleNotification(this.checkDiaryEntriesForToday)
                })
        } else {
            Expo.Notifications.cancelAllScheduledNotificationsAsync();

            this.toggleNotification()
        }

        // if switched to on, check if notification permissions granted. If yes, toggle the switch and run the checkDiaryEntriesForToday function. Show Toast if not
    };

    checkDiaryEntriesForToday = () => {
        const diaryDate = store.getState().diary.date;
        const selectedDate = Moment(diaryDate).format("YYYY-MM-DD");

        readDatabaseArg('diaryDate',
            DbTableNames.session,
            this.sendNotification,
            undefined,
            " where DATE(diaryDate) = '" + selectedDate + "'");
    };
    // check if and diary entries recorded for today's date

    sendNotification = (res) => {
        const localNotification = {
            title: 'Diary Reminder',
            body: "Don't forget to update your diary today!" ,
            android: {
                sound: true,
            },
            ios: {
                sound: true,
            },
        };

        // create local notification object

        let noteTime = new Date();
        noteTime.setHours(9, 0, 0);

        // set today note time to 9am

        let tomorrowNoteTime = new Date();
        tomorrowNoteTime.setHours(9, 0, 0);
        tomorrowNoteTime.setDate(tomorrowNoteTime.getDate() + 1);

        // set tomorrow note time to 9am

        let schedulingOptions = {};

        if(res.length === 0) {
            const now = new Date();

            if(now > noteTime) {
                schedulingOptions = {time: tomorrowNoteTime, repeat: 'day'}
            } else {
                schedulingOptions = {time: noteTime, repeat: 'day'}
            }
            // if no entries set notification to go off today at 9am. Or if later than 9 am , set for tomorrow at same time

        } else {
            schedulingOptions = {time: tomorrowNoteTime, repeat: 'day'}
        }
        // if entries do exist for today, set for tomorrow

        // repeat daily

        Expo.Notifications.scheduleLocalNotificationAsync(
            localNotification,
            schedulingOptions
        ).then(res => console.log(res));
    };

    toggleNotification = (callback) => {
        this.setState(prevState => {
            const newValue = !prevState.notificationSwitchValue;
            const convertBool = newValue ? 1 : 0;

            updateDatabaseArgument(DbTableNames.user, [convertBool], ['notifications'], 'where userId = 1');

            return {notificationSwitchValue: newValue}
        }, callback)
    };
    // toggle notification switch

    infoAlert = () => {
        Alert.alert(
            'DBT',
            DBT,
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };
    // alert for displaying skill info

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <SettingsSelectionRow
                        height={Dimensions.get('window').height / 11}
                        name={'Set Passcode'}
                        iconName={Icons.password + "-outline"}
                        switch={true}
                        switchValue={this.state.switchValue}
                        handleSwitch={() => this.handleSwitch()}
                    />
                    <SettingsSelectionRow
                        height={Dimensions.get('window').height / 11}
                        name={'DBT'}
                        iconName={Icons.dbt + "-outline"}
                        switch={true}
                        switchValue={this.state.dbtSwitchValue}
                        handleSwitch={() => this.handleDbtSwitch()}
                        info={true}
                        infoAlert={this.infoAlert}
                    />
                    <SettingsSelectionRow
                        height={Dimensions.get('window').height / 11}
                        name={'Notifications'}
                        iconName={Icons.notifications + "-outline"}
                        switch={true}
                        switchValue={this.state.notificationSwitchValue}
                        handleSwitch={() => this.handleNotificationSwitch()}
                    />
                    <SettingsSelectionRow
                        height={Dimensions.get('window').height / 11}
                        name={'Backup and Restore'}
                        iconName={Icons.backup + "-outline"}
                        arrow={true}
                        onPress={() => this.props.navigation.push('backupRestore')}
                    />
                </View>
                <Modal animationType={'slide'} visible={this.state.modalVisible} transparent={false} onRequestClose={() => this.toggleModal(false)}>
                    <PressableIcon
                        size={45}
                        iconName={Icons.closeModal}
                        color="black"
                        onPressFunction={this.handleCancelModal}
                        buttonStyle={{padding: 20}}
                    />
                    <PINCode
                        status={'choose'}
                        storePin={this.handlePinStore}
                        handleResultEnterPin
                    />
                </Modal>
            </View>
        );
    }
}

const settingsStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Constants.statusBarHeight
    }
});