import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import PropTypes from 'prop-types'
import store from "../Redux/store"
import {updateSkillRating} from "../Redux/actions";

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

    render() {
        const buttons = ['Yes', 'No'];

        return (
            <View style={skillRowStyle.container}>
                <TouchableHighlight
                    underlayColor="#FDEDEC"
                    style={skillRowStyle.button}
                    onPress={this.props.onPress}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                        <Text style={skillRowStyle.buttonText}>{this.props.name}</Text>
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
        height: 70,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    // need to wrap button in View in order to stretch to full width of screen using flexDirection

    buttonText: {
        fontSize: 15,
        flex: 1.5,
        paddingLeft: 5,
        paddingRight: 5
    },

});