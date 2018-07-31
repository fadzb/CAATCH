import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Moment from 'moment';
import SkillRow from '../../Components/SkillRow';
import { connect } from 'react-redux';
import store from '../../Redux/store';
import { resetSkillRating } from '../../Redux/actions';
import { deleteDatabaseRow, readDatabaseArg, updateDatabase, updateDatabaseArgument } from '../../Util/DatabaseHelper';
import { diaryPrePops } from '../../Constants/Prepopulated';

class Skills extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      skills: [],
      sessionDate: new Date(),
      prevSelected: false,
      historyChecked: false,
    };
  }

  componentDidMount() {
    this.getSkills(diaryPrePops);

    this.checkPreviousEntry();
  }

  createSession = () => {
    updateDatabase(
      'Session',
      [Moment(this.state.sessionDate).format('YYYY-MM-DD HH:mm:ss.SSS'), this.props.diaryDate],
      ['dateEntered', 'diaryDate'],
      undefined,
      (res) => this.handleSave(res.insertId)
    );
  };
  // when user presses save - create session in DB with date recorded at screen opening

  getSkills = (diaryItem) => {
    this.setState({ skills: diaryItem.filter((d) => d.diaryType === 'Skill') });
  };

  checkPreviousEntry = () => {
    const selectedDate = Moment(this.props.diaryDate).format('YYYY-MM-DD');
    const columns = 'd.sessionId, s.diaryDate, d.diaryId, d.rating, di.diaryName, di.info';

    readDatabaseArg(
      columns,
      'DiarySession',
      this.savePrevSelected,
      undefined,
      " as d inner join Session as s on d.sessionId = s.sessionId inner join Diary as di on d.diaryId = di.diaryId where DATE(diaryDate) = '" +
        selectedDate +
        "'"
    );
  };
  // check if previous entry is saved for this date and, if yes, get that info for current state

  savePrevSelected = (res) => {
    if (res.length !== 0) {
      this.setState(
        {
          skills: res.map((sk) => {
            if (sk.rating === 'No') {
              return { ...sk, rating: 1 };
            } else {
              return { ...sk, rating: 0 };
            }
          }),
        },
        () => {
          this.setState({ historyChecked: true, prevSelected: true });
        }
      );
    } else {
      this.setState({ historyChecked: true });
    }
  };
  // need to keep track of when we checked through callback in order to delay render of flatlist component

  renderItem = ({ item }) => (
    <View style={skillStyle.listContainer}>
      <SkillRow
        name={item.diaryName}
        info={item.info}
        index={item.diaryId}
        prevSelected={
          this.state.skills.filter((sk) => sk.diaryId === item.diaryId)[0].rating !== undefined
            ? this.state.skills.filter((sk) => sk.diaryId === item.diaryId)[0].rating
            : null
        }
      />
    </View>
  );
  // prevSelected prop contains the history for that day if it was already filled in

  handleSave = (sessionId) => {
    this.props.skillRating.forEach((rating) => {
      updateDatabase('DiarySession', [sessionId, rating.id, rating.rating], ['sessionId', 'diaryId', 'rating'], () =>
        store.dispatch(resetSkillRating())
      );
    });

    if (this.state.prevSelected) {
      this.state.skills.forEach((rating) => {
        deleteDatabaseRow('DiarySession', 'where diaryId = ' + rating.diaryId + ' and sessionId = ' + rating.sessionId);
      });
    }

    this.props.navigation.pop();
  };
  //after creating session transaction in DB - write ratings to DB, reset global ratings store and pop back to previous screen
  //if there was already data saved for that day - delete. Only storing one entry for skills

  render() {
    return (
      <View style={skillStyle.viewContainer}>
        {this.state.historyChecked ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.skills}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity style={skillStyle.button} onPress={this.createSession}>
              <Text style={skillStyle.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
    );
  }
  // rendering flatlist conditionally in order to display previously filled in entries
}

const skillStyle = StyleSheet.create({
  listContainer: {
    alignSelf: 'stretch',
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

const mapStateToProps = (state) => ({
  skillRating: state.diary.skillRating,
  diaryDate: state.diary.date,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Skills);
// HOC that re-renders the component automatically every time a particular section of state is updated
