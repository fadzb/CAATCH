import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, Dimensions, Alert } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../Constants/Icon";
import PINCode from '@haskkor/react-native-pincode'
import {updateDatabase, readDatabase, updateDatabaseArgument} from "../Util/DatabaseHelper";
import {SettingsSelectionRow} from "../Components/SettingsSelectionRow";
import { Constants } from 'expo';
import {PressableIcon} from "../Components/PressableIcon";
import {updateDbtSetting} from "../Redux/actions";
import store from "../Redux/store"

import {TabStyles} from "../Styles/TabStyles";
import {DbTableNames} from "../Constants/Constants";

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
            dbtSwitchValue: false
        }
    }

    componentDidMount() {
        readDatabase('*', 'User', this.getSwitchValues);
        // get user settings
    }

    getSwitchValues = dbObject => {
        const switchValue = dbObject[0].enabled;
        const dbtSwitchValue = dbObject[0].dbt;

        this.setState({
            switchValue: Boolean(switchValue),
            dbtSwitchValue: Boolean(dbtSwitchValue)
        });

        // setting switches based on values in DB
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