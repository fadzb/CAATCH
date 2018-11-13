import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, Dimensions } from 'react-native';
import {readDatabase} from "../Util/DatabaseHelper";
import PINCode from '@haskkor/react-native-pincode'
import {DbTableNames} from "../Constants/Constants";

export default class Passcode extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userPin: "0"
        }
    }

    componentDidMount() {
        readDatabase('passcode', DbTableNames.user, res => this.setState({userPin: res[0].passcode}));
    }
    // get saved user passcode

    render() {
        return (
            <View style={{flex: 1}}>
                <PINCode
                    status={'enter'}
                    storedPin={this.state.userPin}
                    touchIDDisabled={true}
                    finishProcess={() => this.props.navigation.navigate('main')}
                    maxAttempts={100000}
                />
            </View>
        )
    }
}

