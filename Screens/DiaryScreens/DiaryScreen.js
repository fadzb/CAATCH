import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { Icons } from '../../Constants/Icon';
import { DiaryGrid } from '../../Components/DiaryGrid';
import { CalendarView } from '../../Components/CalendarView';
import { connect } from 'react-redux';
import store from '../../Redux/store';
import { updateDate } from '../../Redux/actions';
import { getDiaryPrePops } from '../../Constants/Prepopulated';

import { AppColors, ComponentStyleConst, TabStyles, themeStyles, Tiles } from '../../Styles/TabStyles';
import { SectionHeader } from '../../Constants/Constants';

class DiaryScreen extends React.Component {
  static navigationOptions = {
    title: SectionHeader.diary,
    headerStyle: {
      //backgroundColor: '#f0f0f5',
      backgroundColor: AppColors.white,
    },
    headerTitleStyle: {
      color: '#333333',
    },
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    getDiaryPrePops();
    // get all diary prepop items from DB
  }

  toggleModal = (bool) => {
    this.setState({ modalVisible: bool });
  };

  handleDateSelection = (date) => {
    store.dispatch(updateDate(Moment(date.dateString).format('YYYY-MM-DD HH:mm:ss.SSS')));

    this.toggleModal(false);
  };

  render() {
    return (
      <View style={[themeStyles.homeCrisisViewContainer, TabStyles.stackContainer]}>
        <View style={diaryStyle.dateButtonContainer}>
          <TouchableHighlight onPress={() => this.toggleModal(true)}>
            <View style={[diaryStyle.dateButton, themeStyles.diaryDatePicker]}>
              <View style={{ position: 'absolute', left: 10 }}>
                <Icon
                  name={Icons.calendar + '-outline'}
                  size={20}
                  color={ComponentStyleConst.diaryDatePickerIconColor}
                />
              </View>
              <Text style={[diaryStyle.dateButtonText, themeStyles.diaryDatePickerText]}>
                {Moment(this.props.diaryDate).format('LL')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch' }}>
          <DiaryGrid
            dbtEnabled={this.props.settings.dbt}
            navigation={this.props.navigation}
            date={Moment(this.props.diaryDate).format('LL')}
          />
        </View>
        <Modal
          animationType={'slide'}
          visible={this.state.modalVisible}
          transparent={false}
          onRequestClose={() => this.toggleModal(false)}
        >
          <CalendarView onPress={() => this.toggleModal(false)} dayPress={this.handleDateSelection} maxDate={true} />
        </Modal>
      </View>
    );
  }
}

const diaryStyle = StyleSheet.create({
  dateButton: {
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateButtonContainer: {
    marginTop: 30,
    //marginBottom: 20,
    marginLeft: 45,
    marginRight: 45,
    alignSelf: 'stretch',
    borderRadius: 5,
    //borderWidth: .5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  dateButtonText: {
    fontSize: 16,
    //paddingLeft: 10
  },
});

const mapStateToProps = (state) => ({
  diaryDate: state.diary.date,
  settings: state.setting,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(DiaryScreen);
// HOC that re-renders the component automatically every time a particular section of state is updated
