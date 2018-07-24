import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import SkillRow from '../../Components/SkillRow';
import { connect } from 'react-redux';

import { TabStyles } from '../../Styles/TabStyles';
import { readDatabaseArg, updateDatabase } from '../../Util/DatabaseHelper';

class Skills extends React.Component {
  static navigationOptions = {
    title: 'Skills',
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      skills: [],
      sessionId: null,
    };
  }

  componentDidMount() {
    const diaryType = '"Skill"';

    readDatabaseArg('*', 'Diary', this.getSkills, undefined, 'where diaryType = ' + diaryType);
    //get skills

    this.createSession();
    //create new session
  }

  createSession = () => {
    updateDatabase(
      'Session',
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateEntered'],
      undefined,
      (res) => this.setState({ sessionId: res.insertId })
    );
  };

  getSkills = (skills) => {
    this.setState({ skills: skills });
  };

  renderItem = ({ item }) => (
    <View style={skillStyle.listContainer}>
      <SkillRow name={item.diaryName} index={item.diaryId} />
    </View>
  );

  handleSave = () => {
    this.props.skillRating.forEach((rating) => {
      updateDatabase(
        'DiarySession',
        [this.state.sessionId, rating.id, rating.rating],
        ['sessionId', 'diaryId', 'rating']
      );
    });
  };

  footer = () => (
    <TouchableOpacity style={skillStyle.button} onPress={this.handleSave}>
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
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Skills);
// HOC that re-renders the component automatically every time a particular section of state is updated
