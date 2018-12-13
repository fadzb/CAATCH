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
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { deleteDatabaseRow, readDatabaseArg, updateDatabase, updateDatabaseArgument } from '../../Util/DatabaseHelper';
import Moment from 'moment';
import { resetSleepRating, resetMoodRating } from '../../Redux/actions';
import store from '../../Redux/store';
import ButtonRating from '../../Components/ButtonRating';
import { DbTableNames, DiaryId } from '../../Constants/Constants';
import { updateNotifications } from '../../Util/Notifications';
import { PressableIcon } from '../../Components/PressableIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';
import { AppColors, themeStyles } from '../../Styles/TabStyles';

const steps = {
  title: 'Steps',
  body: 'Enter the step count that appears on your pedometer',
};

class General extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const diaryDate = store.getState().diary.date;

    return {
      title: 'General' + ' ' + Moment(diaryDate).format('DD.MM.YYYY'),
      headerRight: (
        <TouchableOpacity onPress={() => navigation.push('generalSummary')}>
          <Text style={[{ padding: 10 }, themeStyles.headerRightText]}>Archive</Text>
        </TouchableOpacity>
      ),
    };
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      stepText: '',
      keyboardViewHeight: 0,
      nonGeneralViewHeight: 0,
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
    updateDatabase(
      DbTableNames.diarySession,
      [sessionId, DiaryId.sleep, this.props.sleepRating],
      ['sessionId', 'diaryId', 'rating']
    );
    //update DB for sleep rating

    updateDatabase(
      DbTableNames.diarySession,
      [sessionId, DiaryId.mood, this.props.moodRating],
      ['sessionId', 'diaryId', 'rating']
    );
    //update DB for mood rating

    if (this.state.stepText.length > 0) {
      readDatabaseArg(
        '*',
        DbTableNames.diarySession,
        (res) => {
          if (res.length > 0) {
            deleteDatabaseRow(
              DbTableNames.diarySession,
              'where sessionId = ' + res[0].sessionId + ' and diaryId = ' + DiaryId.steps,
              (res) => {
                updateDatabase(
                  DbTableNames.diarySession,
                  [sessionId, DiaryId.steps, this.state.stepText],
                  ['sessionId', 'diaryId', 'rating']
                );
              }
            );
          } else {
            updateDatabase(
              DbTableNames.diarySession,
              [sessionId, DiaryId.steps, this.state.stepText],
              ['sessionId', 'diaryId', 'rating']
            );
          }
        },
        undefined,
        'as ds inner join Session as s on ds.sessionId = s.sessionId where diaryId = ' +
          DiaryId.steps +
          ' and DATE(diaryDate) = "' +
          Moment(this.props.diaryDate).format('YYYY-MM-DD') +
          '"'
      );
    }
    //if user inputs step text, update DB. Delete previous record for steps if already exists fdr diary date

    if (this.state.text.length > 0) {
      updateDatabase(
        DbTableNames.diarySession,
        [sessionId, DiaryId.notes, this.state.text],
        ['sessionId', 'diaryId', 'rating']
      );
    }
    //if user inputs general text, update DB

    this.resetRatings();
    //ensure mood and sleep scales revert to default state

    updateNotifications();

    this.props.navigation.pop();
  };
  // accessing global sleep + mood store and state for input and saving to DB

  resetRatings = () => {
    store.dispatch(resetSleepRating());
    store.dispatch(resetMoodRating());
  };

  infoAlert = () => {
    Alert.alert(steps.title, steps.body, [{ text: 'OK', onPress: () => console.log('OK pressed') }], {
      cancelable: false,
    });
  };
  // alert for displaying steps info

  onLayoutKeyboard = (e) => {
    this.setState({
      keyboardViewHeight: e.nativeEvent.layout.height,
    });
  };

  onLayout = (e) => {
    this.setState({
      nonGeneralViewHeight: e.nativeEvent.layout.height,
    });
  };

  render() {
    return (
      <View style={generalStyle.listContainer}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false}
          contentContainerStyle={{ flex: 1 }}
          onLayout={this.onLayoutKeyboard}
        >
          <KeyboardAvoidingView keyboardVerticalOffset={70} style={{ flex: 1 }} behavior={'position'}>
            <View onLayout={this.onLayout}>
              <View style={generalStyle.sleep}>
                <ButtonRating title="Mood Scale" />
                <ButtonRating title="Sleep Scale" />
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 25, alignItems: 'center' }}>
                <View style={generalStyle.stepStyle}>
                  <Icon name={Icons.info + '-outline'} size={30} onPress={this.infoAlert} color="#007AFF" />
                  <TextInput
                    placeholder={'Enter step count'}
                    style={{ paddingVertical: 7, paddingLeft: 10, flex: 1, color: AppColors.grey }}
                    placeholderTextColor="black"
                    keyboardType={'phone-pad'}
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.setState({ stepText: text })}
                  />
                  <Icon name={Icons.steps + '-outline'} size={30} color={AppColors.grey} />
                </View>
              </View>
            </View>
            <View style={{ marginLeft: 15, marginRight: 15 }}>
              <TextInput
                multiline={true}
                style={{
                  color: AppColors.grey,
                  backgroundColor: '#f0f0f5',
                  height: this.state.keyboardViewHeight - this.state.nonGeneralViewHeight,
                  borderColor: AppColors.orange,
                  borderRadius: 7,
                  borderWidth: 1,
                  padding: 15,
                  paddingBottom: 15,
                  paddingTop: 15,
                  textAlignVertical: 'top',
                }}
                placeholder="Enter daily personal thoughts / notes here"
                placeholderTextColor="black"
                underlineColorAndroid="transparent"
                value={this.state.text}
                onChangeText={this.handleTextChange}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={{ marginTop: 10 }}>
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
    color: AppColors.white,
    alignSelf: 'center',
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
  },
  button: {
    height: 36,
    backgroundColor: AppColors.orange,
    borderColor: AppColors.orange,
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  stepStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: AppColors.orange,
    marginHorizontal: 15,
    flex: 1,
    paddingRight: 10,
    paddingLeft: 5,
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
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
