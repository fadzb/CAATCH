import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { updateDatabase } from '../../Util/DatabaseHelper';
import Moment from 'moment';
import { resetSleepRating, resetMoodRating } from '../../Redux/actions';
import store from '../../Redux/store';
import ButtonRating from '../../Components/ButtonRating';
import { DbTableNames } from '../../Constants/Constants';

class General extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const diaryDate = store.getState().diary.date;

    return {
      title: 'General' + ' ' + Moment(diaryDate).format('DD.MM.YYYY'),
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('generalSummary')}>
          <Text style={{ padding: 10 }}>Archive</Text>
        </TouchableOpacity>
      ),
    };
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  handleTextChange = (text) => this.setState({ text: text });

  createSession = () => {
    updateDatabase(
      DbTableNames.session,
      [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), this.props.diaryDate],
      ['dateEntered', 'diaryDate'],
      undefined,
      (res) => this.handleSave(res.insertId)
    );
  };
  // when user presses save - create session in DB with date recorded at screen opening

  handleSave = (sessionId) => {
    const sleepId = 28;
    const notesId = 29;
    const moodId = 30;

    updateDatabase(
      DbTableNames.diarySession,
      [sessionId, sleepId, this.props.sleepRating],
      ['sessionId', 'diaryId', 'rating']
    );
    //update DB for sleep rating

    updateDatabase(
      DbTableNames.diarySession,
      [sessionId, moodId, this.props.moodRating],
      ['sessionId', 'diaryId', 'rating']
    );
    //update DB for mood rating

    if (this.state.text.length > 0) {
      updateDatabase(
        DbTableNames.diarySession,
        [sessionId, notesId, this.state.text],
        ['sessionId', 'diaryId', 'rating'],
        () => {
          this.resetRatings();
        }
      );
    }
    //if user inputs general text, update DB

    this.resetRatings();
    //ensure mood and sleep scales revert to default state

    this.props.navigation.pop();
  };
  // accessing global sleep + mood store and state for input and saving to DB

  resetRatings = () => {
    store.dispatch(resetSleepRating());
    store.dispatch(resetMoodRating());
  };

  render() {
    return (
      <View style={generalStyle.listContainer}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'position'}>
          <View style={generalStyle.sleep}>
            <ButtonRating title="Mood Scale" />
            <ButtonRating title="Sleep Scale" />
          </View>
          <View style={{ marginTop: 10, marginLeft: 15, marginRight: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingBottom: 15 }}>General Notes</Text>
            <TextInput
              multiline={true}
              style={{
                backgroundColor: '#f0f0f5',
                height: Dimensions.get('window').height / 4,
                borderRadius: 7,
                borderWidth: 1,
                padding: 15,
                paddingBottom: 15,
                paddingTop: 15,
                textAlignVertical: 'top',
              }}
              placeholder="User can enter personal thoughts and notes here"
              placeholderTextColor="black"
              underlineColorAndroid="transparent"
              value={this.state.text}
              onChangeText={this.handleTextChange}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity style={generalStyle.button} onPress={this.createSession}>
              <Text style={generalStyle.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const generalStyle = StyleSheet.create({
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },

  sleep: {
    marginTop: 10,
  },

  sleepText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 15,
    fontWeight: 'bold',
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

const mapStateToProps = (state) => ({
  sleepRating: state.diary.sleepRating,
  moodRating: state.diary.moodRating,
  diaryDate: state.diary.date,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(General);
// HOC that re-renders the component automatically every time a particular section of state is updated
