import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Alert } from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import PropTypes from 'prop-types'
import store from "../Redux/store"
import {updateSkillRating} from "../Redux/actions";
import {PressableIcon} from "./PressableIcon";
import {Icons} from "../Constants/Icon";

export default class SkillRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 1 // default to 'No'
        }
    }

    componentDidMount() {
        this.setState({
            selectedIndex: this.props.prevSelected === null ? 1 : this.props.prevSelected
        }, () => this.updateIndex(this.state.selectedIndex))
        // set state with previously saved selections, if any, and update global state
    }

    updateIndex = (selectedIndex) => {
        this.setState({selectedIndex});

        let rating;

        if(selectedIndex === 1) {
            rating = 'No'
        } else {
            rating = 'Yes'
        }

        store.dispatch(updateSkillRating({id: this.props.index, rating: rating}))
    };
    // when user selects Y or N, update global ratings store

    infoAlert = () => {
        Alert.alert(
            this.props.name,
            this.props.info,
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };
    // alert for displaying skill info

    render() {
        const buttons = ['Yes', 'No'];

        return (
            <View style={skillRowStyle.container}>
                <TouchableHighlight
                    underlayColor="#FDEDEC"
                    style={skillRowStyle.button}
                    onPress={this.props.onPress}>
                    <View style={skillRowStyle.rowContainer}>
                        <View style={skillRowStyle.textContainer}>
                            <PressableIcon
                                iconName={Icons.info + '-outline'}
                                size={25}
                                onPressFunction={this.infoAlert}
                                color='#007AFF'
                            />
                            <Text style={skillRowStyle.buttonText}>{this.props.name}</Text>
                        </View>
                        <ButtonGroup
                            onPress={this.updateIndex}
                            selectedIndex={this.state.selectedIndex}
                            buttons={buttons}
                            containerStyle={{flex: 1, borderColor: '#007AFF'}}
                            buttonStyle={{backgroundColor: 'white'}}
                            textStyle={{color: '#007AFF'}}
                            selectedButtonStyle={{backgroundColor: '#007AFF'}}
                            selectedTextStyle={{color: 'white'}}
                            innerBorderStyle={{color: 'white'}}
                        />
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
};

SkillRow.propTypes = {
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func
};
// Defining prop types for this component

const skillRowStyle = StyleSheet.create({
    button: {
        flex: 1,
        borderBottomWidth: .5,
        marginLeft: 10,
        marginRight: 10,
    },

    container: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        flex: 1,
    },
    // need to wrap button in View in order to stretch to full width of screen using flexDirection

    buttonText: {
        fontSize: 15,
        paddingLeft: 5,
        flex: 1
    },

    textContainer: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 12,
        marginBottom: 12
    }

});