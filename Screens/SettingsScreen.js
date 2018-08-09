import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../Constants/Icon";
import PINCode from '@haskkor/react-native-pincode'
import {updateDatabase, readDatabase, updateDatabaseArgument} from "../Util/DatabaseHelper";
import {SettingsSelectionRow} from "../Components/SettingsSelectionRow";
import { Constants } from 'expo';
import {PressableIcon} from "../Components/PressableIcon";

import {TabStyles} from "../Styles/TabStyles";

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: "Settings"
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            switchValue: false
        }
    }

    componentDidMount() {
        readDatabase('enabled', 'User', this.getSwitchValue);
    }

    getSwitchValue = dbObject => {
        const dbSwitchValue = dbObject[0].enabled;

        if(dbSwitchValue === 1) {
            this.setState({switchValue: true})
        } else {
            this.setState({switchValue: false})
        }
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

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <View style={{height: Dimensions.get('window').height / 11, alignSelf: 'stretch'}}>
                    <SettingsSelectionRow
                        name={'Set Passcode'}
                        iconName={Icons.password + "-outline"}
                        switch={true}
                        switchValue={this.state.switchValue}
                        handleSwitch={() => this.handleSwitch()}
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