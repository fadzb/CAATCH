import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {diaryPrePops} from "../../Constants/Prepopulated";
import FeelingRow from '../../Components/FeelingRow'
import {updateDatabase} from "../../Util/DatabaseHelper";
import Moment from 'moment';
import {connect} from 'react-redux'
import {resetFeelingRating} from "../../Redux/actions";
import store from "../../Redux/store"

class Feelings extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        }
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            feelings: [],
            sessionDate: new Date(),
        }
    }

    componentDidMount() {
        this.getFeelings(diaryPrePops);
    }

    getFeelings = feelingItem => {
        this.setState({ feelings: feelingItem.filter(f => f.diaryType === "Feeling") })
    };
    // retrieve feelings array from DB

    createSession = () => {
        updateDatabase('Session',
            [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), this.props.diaryDate],
            ["dateEntered", "diaryDate"],
            undefined,
            (res) => this.handleSave(res.insertId))
    };
    // when user presses save - create session in DB with date recorded at screen opening

    handleSave = (sessionId) => {
        this.props.feelingRating.forEach(rating => {
            updateDatabase('DiarySession',
                [sessionId, rating.id, rating.rating],
                ['sessionId', 'diaryId', 'rating'],
                () => store.dispatch(resetFeelingRating()))
        });

        this.props.navigation.pop();
    };
    // iterate through global rating store for feelings and save in DB

    renderItem = ({item}) => {
        return (
            <View style={feelingStyle.listContainer}>
                <FeelingRow
                    feeling={item}
                />
            </View>
        )
    };
    // prevSelected prop contains the history for that day if it was already filled in

    render() {
        return (
            <View style={feelingStyle.viewContainer}>
                <FlatList
                    data={this.state.feelings}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity style={feelingStyle.button} onPress={this.createSession}>
                    <Text style={feelingStyle.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const feelingStyle = StyleSheet.create({
    listContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
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
    feelingRating: state.diary.feelingRating,
    diaryDate: state.diary.date
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Feelings)
// HOC that re-renders the component automatically every time a particular section of state is updated