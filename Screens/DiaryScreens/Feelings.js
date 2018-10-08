import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { diaryPrePops } from '../../Constants/Prepopulated';
import FeelingRow from '../../Components/FeelingRow';
import { updateDatabase } from '../../Util/DatabaseHelper';
import Moment from 'moment';
import { connect } from 'react-redux';
import { resetFeelingRating } from '../../Redux/actions';
import store from '../../Redux/store';
import { DbTableNames, SectionHeader } from '../../Constants/Constants';
import { updateNotifications } from '../../Util/Notifications';
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

class Feelings extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const diaryDate = store.getState().diary.date;

    return {
      title: SectionHeader.info + ' ' + Moment(diaryDate).format('DD.MM.YYYY'),
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('feelingsSummary')}>
          <Text style={{ padding: 10 }}>Archive</Text>
        </TouchableOpacity>
      ),
    };
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      feelings: [],
      sessionDate: new Date(),
    };
  }

  componentWillReceiveProps(nextProps) {
    const newFeeling = nextProps.navigation.getParam('newFeeling', null);

    if (newFeeling !== this.props.navigation.getParam('newFeeling', null)) {
      if (newFeeling !== null) {
        this.getFeelings();
      } else {
        console.log('no feeling added');
      }
    }
  }
  // listen for new props coming from pre-populated screen and update accordingly

  componentDidMount() {
    this.getFeelings();
  }

  getFeelings = () => {
    this.setState({ feelings: diaryPrePops.filter((f) => f.diaryType === 'Feeling') });
  };

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
    this.props.feelingRating.forEach((rating) => {
      updateDatabase(
        DbTableNames.diarySession,
        [sessionId, rating.id, rating.rating],
        ['sessionId', 'diaryId', 'rating'],
        () =>
          store.dispatch(
            resetFeelingRating(
              diaryPrePops.filter((t) => t.diaryType === 'Feeling').map((f) => ({ id: f.diaryId, rating: 0 }))
            )
          )
      );
    });

    updateNotifications();

    this.props.navigation.pop();
  };
  // iterate through global rating store for feelings and save in DB

  renderItem = ({ item }) => {
    return (
      <View style={feelingStyle.listContainer}>
        <FeelingRow feeling={item} />
      </View>
    );
  };
  // prevSelected prop contains the history for that day if it was already filled in

  render() {
    const urges = 1;
    const feelings = 2;
    const usedSkills = 3;

    const NUMBER_OF_TABS = 3;

    return (
      <View style={feelingStyle.viewContainer}>
        <Container>
          <StyleProvider style={getTheme(platform)}>
            <Tabs locked={true} prerenderingSiblingsNumber={NUMBER_OF_TABS}>
              <Tab heading={'Urges'}>
                <FlatList
                  data={this.state.feelings.filter((f) => f.subType === urges)}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={feelingStyle.twoButtonContainer}>
                  <TouchableOpacity
                    style={feelingStyle.buttonsNew}
                    onPress={() => this.props.navigation.push('newUrge', { subType: urges })}
                  >
                    <Text style={feelingStyle.buttonNewText}>New</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={feelingStyle.buttons} onPress={this.createSession}>
                    <Text style={feelingStyle.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </Tab>
              <Tab heading={'Feelings'}>
                <FlatList
                  data={this.state.feelings.filter((f) => f.subType === feelings)}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={feelingStyle.twoButtonContainer}>
                  <TouchableOpacity style={feelingStyle.buttonsNew} onPress={() => console.log('saving ...')}>
                    <Text style={feelingStyle.buttonNewText}>New</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={feelingStyle.buttons} onPress={this.createSession}>
                    <Text style={feelingStyle.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </Tab>
              <Tab heading={'Used Skills'}>
                <FlatList
                  data={this.state.feelings.filter((f) => f.subType === usedSkills)}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity style={feelingStyle.button} onPress={this.createSession}>
                  <Text style={feelingStyle.buttonText}>Save</Text>
                </TouchableOpacity>
              </Tab>
            </Tabs>
          </StyleProvider>
        </Container>
      </View>
    );
  }
}

const feelingStyle = StyleSheet.create({
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
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  buttons: {
    height: 36,
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonNewText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  buttonsNew: {
    height: 36,
    flex: 1,
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  twoButtonContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 5,
  },
});

const mapStateToProps = (state) => ({
  feelingRating: state.diary.feelingRating,
  diaryDate: state.diary.date,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Feelings);
// HOC that re-renders the component automatically every time a particular section of state is updated
