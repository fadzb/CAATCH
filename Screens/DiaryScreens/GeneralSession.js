import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import store from '../../Redux/store';
import { Icons } from '../../Constants/Icon';
import { DiaryId } from '../../Constants/Constants';
import { AppColors } from '../../Styles/TabStyles';

export default class GeneralSession extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const diaryDate = store.getState().diary.date;

    return {
      title: Moment(diaryDate).format('LL'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      general: this.props.navigation.getParam('resultsArr'),
    };
  }
  // setting state as result array generated in GeneralSummary.js

  renderItem = ({ item }) => (
    <View style={generalSessionStyle.listContainer}>
      {item.diaryName !== 'Notes' ? (
        <GeneralRow
          name={item.diaryName}
          rating={Math.round(item.rating) + (item.diaryId === DiaryId.steps ? '' : ' / ' + item.scale)}
          circleView={item.diaryName.slice(0, 1).toUpperCase()}
          icon={Icons.dividerArrow}
        />
      ) : (
        <GeneralNote
          name={item.diaryName}
          rating={item.rating}
          circleView={item.diaryName.slice(0, 1).toUpperCase()}
          icon={Icons.dividerArrow}
        />
      )}
    </View>
  );

  render() {
    return (
      <View style={generalSessionStyle.viewContainer}>
        <FlatList
          data={this.state.general}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const GeneralRow = (props) => (
  <View style={generalSessionStyle.container}>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <View style={generalSessionStyle.iconContainer}>
        <Icon name={props.icon} size={30} color={AppColors.orange} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={generalSessionStyle.buttonText}>{props.name}</Text>
        <Text style={generalSessionStyle.ratingText}>{props.rating}</Text>
      </View>
    </View>
  </View>
);
// stateless component for rendering each saved general rating

const GeneralNote = (props) => (
  <View style={generalSessionStyle.noteContainer}>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
      }}
    >
      <View style={generalSessionStyle.iconContainer}>
        <Icon name={props.icon} size={30} color={AppColors.orange} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingRight: 10, justifyContent: 'center' }}>
          <Text style={generalSessionStyle.buttonText}>{props.rating}</Text>
        </View>
      </View>
    </View>
  </View>
);
// stateless component for rendering each saved general note

const generalSessionStyle = StyleSheet.create({
  listContainer: {
    alignSelf: 'stretch',
  },

  viewContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    marginLeft: 30,
    marginRight: 30,
    height: 80,
    borderColor: AppColors.orange,
  },

  noteContainer: {
    flex: 1,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    borderColor: AppColors.orange,
  },

  buttonText: {
    fontSize: 18,
    paddingLeft: 10,
    color: AppColors.blue,
  },

  ratingText: {
    fontSize: 18,
    paddingRight: 10,
    color: AppColors.blue,
  },

  iconContainer: {
    paddingLeft: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noteText: {
    fontSize: 15,
    paddingRight: 10,
  },
});
