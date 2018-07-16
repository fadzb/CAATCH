import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native'
import { PressableIcon } from "../../../Components/PressableIcon";
import store from "../../../Redux/store"
import {updateSign, getSign} from "../../../Redux/actions";
import Expo from 'expo'

import {TabStyles} from "../../../Styles/TabStyles";
import {updateDatabase, updateDatabaseArgument, readDatabaseArg} from "../../../Util/DatabaseHelper";

const Form = t.form.Form;

const sign = t.struct({
    signName: t.String,
    signDesc: t.String,
});
// data structure for values to be capture in form below

const options = {
    fields: {
        signName: {
            placeholder: 'Name',
            auto: 'none'
        },
        signDesc: {
            placeholder: 'Description',
            auto: 'none'
        },
    }
};
// for customizing form UI

export default class NewWarningSign extends React.Component {
    static navigationOptions = {
        title: "New Strategy"
    };

    constructor(props) {
        super(props);

        this.state = {
            value: null,
        }
    }

    onChange = (value) => {
        this.setState({ value: value })
    };

    updateSignList = (sign) => {
        store.dispatch(updateSign(sign));
        // dispatching new Warning Sign name to global redux store
    };

    updateLinkDbTable = (signId) => {
        const checkedCopes = this.props.navigation.getParam('checkedCopes', null);

        if (checkedCopes !== null) {
            checkedCopes.forEach(copeId => {
                updateDatabase("CopeSignLink", [copeId, signId.insertId], ["copeId", "signId"]);
            });
        } else {
            console.log("no copes checked");
        }

        readDatabaseArg("*", "WarningSign", (signs) => store.dispatch(getSign(signs)), () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // function that checks if any copes were linked and, if yes, updates CopeSignLink table with respective ID's

    onPress = () => {
        const value = this.refs.form.getValue();
        // returns values captured in form as object

        if (value) { // if validation fails, value will be null
            console.log(value);
            updateDatabase("WarningSign", Object.values(value), Object.keys(value), this.updateSignList(value), this.updateLinkDbTable);
            // write the saved values to DB if valid

            this.props.navigation.pop();
            // pop to sign list once saved
        }
    };

    render() {
        return(
            <View style={TabStyles.planContainer}>
                <View style={signStyle.formContainer}>
                    <Form
                        ref="form"
                        type={sign}
                        value={this.state.value}
                        onChange={this.onChange}
                        options={options}
                    />
                    <PressableIcon
                        iconName="ios-arrow-dropright-outline"
                        size={25}
                        onPressFunction={() => this.props.navigation.push('copingLink')}
                        name="Coping Strategy"
                        buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                        buttonStyle={signStyle.listButton}
                        textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                        iconStyle={{alignSelf: 'center', flex: 1, alignItems: 'center'}}
                    />
                    <TouchableHighlight style={signStyle.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={signStyle.buttonText}>Save</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const signStyle = StyleSheet.create({
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
        flex: 2,
        margin: 40,
    },
    iconButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    listButton: {
        height: 36,
        borderColor: '#cccccc', // <= relevant style here
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: '#f2f2f2'
    }
});