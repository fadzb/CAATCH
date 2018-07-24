import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, TouchableHighlight, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Moment from 'moment';
import {Icons} from "../../Constants/Icon";
import {DiaryGrid} from "../../Components/DiaryGrid";
import {CalendarView} from "../../Components/CalendarView";
import {connect} from 'react-redux'
import store from "../../Redux/store"
import {updateDate} from "../../Redux/actions";

import {TabStyles} from "../../Styles/TabStyles";

class DiaryScreen extends React.Component {
    static navigationOptions = {
        title: "Diary"
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
        }
    }

    toggleModal = bool => {
        this.setState({modalVisible: bool})
    };

    handleDateSelection = (date) => {
        store.dispatch(updateDate(Moment(date.dateString).format('YYYY-MM-DD HH:mm:ss.SSS')));

        this.toggleModal(false)
    };

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <View style={diaryStyle.dateButtonContainer}>
                    <TouchableOpacity onPress={() => this.toggleModal(true)}>
                        <View style={diaryStyle.dateButton}>
                            <Icon
                                name={Icons.calendar + '-outline'}
                                size={25}
                            />
                            <Text style={diaryStyle.dateButtonText}>{Moment(this.props.diaryDate).format('LL')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <DiaryGrid navigation={this.props.navigation}/>
                </View>
                <Modal animationType={'slide'} visible={this.state.modalVisible} transparent={false} onRequestClose={() => this.toggleModal(false)}>
                    <CalendarView
                        onPress={() => this.toggleModal(false)}
                        dayPress={this.handleDateSelection}
                    />
                </Modal>
            </View>
        );
    }
}

const diaryStyle = StyleSheet.create({
    dateButton: {
        paddingTop: 7,
        paddingBottom: 7,
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    dateButtonContainer: {
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 45,
        marginRight: 45,
        alignSelf: 'stretch',
    },

    dateButtonText: {
        fontSize: 18,
        paddingLeft: 10
    }
});

const mapStateToProps = state => ({
    diaryDate: state.diary.date
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(DiaryScreen)
// HOC that re-renders the component automatically every time a particular section of state is updated