import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import SkillRow from '../../Components/SkillRow';
import { connect } from 'react-redux';
import store from '../../Redux/store';
import { resetSkillRating } from '../../Redux/actions';
import { readDatabaseArg, updateDatabase } from '../../Util/DatabaseHelper';
import { diaryPlanPrePops } from '../../Constants/Prepopulated';

class Skills extends React.Component {
  static navigationOptions = {
    title: 'Skills',
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      skills: [],
      sessionDate: new Date(),
    };
  }

  componentDidMount() {
    this.getSkills(diaryPlanPrePops);
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

  renderItem = ({ item }) => (
    <View style={skillStyle.listContainer}>
      <SkillRow name={item.diaryName} index={item.diaryId} />
    </View>
  );

  handleSave = (sessionId) => {
    this.props.skillRating.forEach((rating) => {
      updateDatabase('DiarySession', [sessionId, rating.id, rating.rating], ['sessionId', 'diaryId', 'rating'], () =>
        store.dispatch(resetSkillRating())
      );
    });

    this.props.navigation.pop();
  };
  //after creating session transaction in DB - write ratings to DB, reset global ratings store and pop back to previous screen

  footer = () => (
    <TouchableOpacity style={skillStyle.button} onPress={this.createSession}>
      <Text style={skillStyle.buttonText}>Save</Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={skillStyle.viewContainer}>
        <FlatList
          data={this.state.skills}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.footer}
        />
      </View>
    );
  }
}

const skillStyle = StyleSheet.create({
  listContainer: {
    flex: 1,
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
    margin: 30,
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
