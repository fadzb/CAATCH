import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native'

import {TabStyles} from "../../Styles/TabStyles";
import {updateDatabase} from "../../Util/DatabaseHelper";

const Form = t.form.Form;

const cope = t.struct({
    copeName: t.String,
    copeDesc: t.String,
    copeUrl: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {};

export default class CopingStrategies extends React.Component {
    static navigationOptions = {
        title: "Coping Strategies"
    };

    constructor(props) {
        super(props);

        this.state = {
            value: null
        }
    }

    clearForm = () => {
        this.setState({ value: null });
    };
    // clear content from all form inputs

    onChange = (value) => {
        this.setState({ value: value })
    };

    onPress = () => {
        const value = this.refs.form.getValue();
        // returns values captured in form as object

        if (value) { // if validation fails, value will be null
            console.log(value);
            updateDatabase("CopingStrategy", Object.values(value), Object.keys(value))
            // write the saved values to DB if valid

            this.clearForm();
            // clear form once DB is updated
        }
    };

    render() {
        return(
            <View style={TabStyles.planContainer}>
                <Form
                    ref="form"
                    type={cope}
                    value={this.state.value}
                    onChange={this.onChange}
                    options={options}
                />
                <TouchableHighlight style={copeStyle.button} onPress={this.onPress} underlayColor='#99d9f4'>
                    <Text style={copeStyle.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const copeStyle = StyleSheet.create({
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
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});