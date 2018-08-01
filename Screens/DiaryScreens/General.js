import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import {connect} from 'react-redux'
import SleepScale from "../../Components/SleepScale"
import {updateDatabase} from "../../Util/DatabaseHelper";
import Moment from 'moment';
import {resetSleepRating} from "../../Redux/actions";
import store from "../../Redux/store"

class General extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        }
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            text: ""
        }
    }

    handleTextChange = text => this.setState({text: text});

    createSession = () => {
        updateDatabase('Session',
            [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), this.props.diaryDate],
            ["dateEntered", "diaryDate"],
            undefined,
            (res) => this.handleSave(res.insertId))
    };
    // when user presses save - create session in DB with date recorded at screen opening

    handleSave = (sessionId) => {
        const sleepId = 28;
        const notesId = 29;

        updateDatabase('DiarySession',
            [sessionId, sleepId, this.props.sleepRating],
            ['sessionId', 'diaryId', 'rating']);

        updateDatabase('DiarySession',
            [sessionId, notesId, this.state.text],
            ['sessionId', 'diaryId', 'rating'],
            () => store.dispatch(resetSleepRating()));

        this.props.navigation.pop();
    };
    // accessing global sleep store and state for input and saving to DB

    render() {
        return (
            <View style={generalStyle.listContainer}>
                <View style={generalStyle.sleep}>
                    <Text style={generalStyle.sleepText}>Sleep Scale</Text>
                    <SleepScale/>
                </View>
                <View style={{flex: 2, marginLeft: 15, marginRight: 15}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16, paddingBottom: 15}}>General Notes</Text>
                    <TextInput
                        multiline={true}
                        style={{backgroundColor: '#f0f0f5', flex: 1, borderRadius: 7, borderWidth: 1, padding: 15, paddingBottom: 15, paddingTop: 15, textAlignVertical: "top"}}
                        placeholder="User can enter personal thoughts and notes here"
                        placeholderTextColor="black"
                        underlineColorAndroid='transparent'
                        value={this.state.text}
                        onChangeText={this.handleTextChange}
                    />
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity style={generalStyle.button} onPress={this.createSession}>
                        <Text style={generalStyle.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const generalStyle = StyleSheet.create({
    listContainer: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'white'
    },

    sleep: {
        //flex: 2
    },

    sleepText: {
        fontSize: 16,
        marginLeft: 15,
        marginTop: 15,
        fontWeight: 'bold'
    },
    buttonText: {
        fontSize: 18,
        color: '#007AFF',
        alignSelf: 'center',
    },
    button: {
        height: 36,
        backgroundColor: '#fff',
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 8,
        margin: 15,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
});

const mapStateToProps = state => ({
    sleepRating: state.diary.sleepRating,
    diaryDate: state.diary.date
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(General)
// HOC that re-renders the component automatically every time a particular section of state is updated