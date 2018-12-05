import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import { PressableIcon } from '../../Components/PressableIcon';
import store from '../../Redux/store';
import { updateGoal, getGoal } from '../../Redux/actions';
import { TabStyles, themeStyles } from '../../Styles/TabStyles';
import { updateDatabase, updateDatabaseArgument, readDatabaseArg } from '../../Util/DatabaseHelper';
import { DbTableNames, UsageFunctionIds } from '../../Constants/Constants';
import { latestSafetyPlanItem } from '../../Util/Usage';
import t from 'tcomb-form-native';
import RNPickerSelect from 'react-native-picker-select';

const Form = t.form.Form;

const goal = t.struct({
  goalName: t.String,
  goalDescription: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
  fields: {
    goalName: {
      placeholder: 'Goal Name',
      auto: 'none',
    },
    goalDescription: {
      placeholder: 'Goal Description',
      auto: 'none',
    },
  },
};
// for customizing form UI

export default class NewGoal extends React.Component {
  static navigationOptions = {
    title: 'New Goal',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: null,
      diaryItem: 'Diary Item',
      validDiaryItem: true,
      ratings: [],
      selectedRating: 'Target Rating',
      validRating: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const checkedItem = nextProps.navigation.getParam('checkedItem', null);

    if (checkedItem !== this.props.navigation.getParam('checkedItem', null)) {
      if (checkedItem !== null) {
        this.setState({
          diaryItem: checkedItem.diaryName,
          ratings: [...this.createRatingArr(checkedItem.minRating, checkedItem.diaryScale)],
          selectedRating: 'Target Rating',
        });
      } else {
        console.log('no item checked');
      }
    }
  }
  // listen for new props coming from pre-populated screen and update accordingly

  createRatingArr = (min, max) => {
    let ratingArr = [];

    for (let i = min; i <= max; i++) {
      ratingArr.push({ label: i.toString(), value: i });
    }

    return ratingArr;
  };

  updateGoalList = (goal) => {
    store.dispatch(updateGoal(goal));
    // dispatching new Goal name to global redux store
  };

  refreshDb = (func) => {
    readDatabaseArg(
      'g.*, d.diaryName, d.diaryId, d.scale, d.minRating, d.defaultRating',
      DbTableNames.goal,
      func,
      () => console.log('DB read success'),
      ' as g inner join ' + DbTableNames.diary + ' as d' + ' on g.diaryId = d.diaryId'
    );
  };
  // for refreshing global state from Goal table in DB

  updateGlobalGoals = (goals) => store.dispatch(getGoal(goals));

  postSaveFunctions = (goalId) => {
    this.refreshDb(this.updateGlobalGoals);
  };

  onPress = () => {
    const value = this.refs.form.getValue();
    // returns values captured in form as object

    if (this.state.diaryItem === 'Diary Item') {
      this.setState({ validDiaryItem: false });
    } else if (this.state.selectedRating === null || this.state.selectedRating === 'Target Rating') {
      this.setState({ validRating: false, validDiaryItem: true });
    } else {
      this.setState({ validDiaryItem: true, validRating: true });

      if (value) {
        // if validation fails, value will be null
        console.log(value);
        updateDatabase(
          DbTableNames.goal,
          [...Object.values(value), this.props.navigation.getParam('checkedItem').diaryId, this.state.selectedRating],
          [...Object.keys(value), 'diaryId', 'rating'],
          undefined,
          this.postSaveFunctions
        );
        // write the saved values to DB if valid

        this.props.navigation.pop();
        // pop to goal list once saved
      }
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={goalStyle.formContainer}>
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('diaryItemList')}
            name={this.state.diaryItem}
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={[goalStyle.listButton, this.state.validDiaryItem ? {} : { borderColor: '#a94442' }]}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          {this.state.diaryItem !== 'Steps' && this.state.diaryItem !== 'Diary Item' && (
            <RNPickerSelect
              placeholder={{
                label: 'Target Rating',
                value: null,
              }}
              items={this.state.ratings}
              onValueChange={(value) => {
                this.setState({
                  selectedRating: value,
                });
              }}
              hideIcon={true}
              disabled={this.state.diaryItem === 'Diary Item'}
            >
              <View
                style={[
                  goalStyle.listButton,
                  { justifyContent: 'center' },
                  this.state.validRating ? {} : { borderColor: '#a94442' },
                ]}
              >
                <Text style={{ paddingLeft: 7, fontSize: 17 }}>
                  {this.state.selectedRating === null ? 'Target Rating' : this.state.selectedRating}
                </Text>
              </View>
            </RNPickerSelect>
          )}
          {this.state.diaryItem === 'Steps' && (
            <View
              style={[
                goalStyle.listButton,
                { justifyContent: 'center', backgroundColor: 'white' },
                this.state.validRating ? {} : { borderColor: '#a94442' },
              ]}
            >
              <TextInput
                placeholder={'Target Steps'}
                style={{ paddingLeft: 7, fontSize: 17 }}
                underlineColorAndroid="transparent"
                keyboardType={'phone-pad'}
                onChangeText={(text) => this.setState({ selectedRating: text })}
              />
            </View>
          )}
          <Form ref="form" type={goal} value={this.state.value} onChange={this.onChange} options={options} />
          <TouchableHighlight
            style={[goalStyle.button, themeStyles.planFormSaveButton]}
            onPress={this.onPress}
            underlayColor="#99d9f4"
          >
            <Text style={[goalStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Save</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const pickerStyle = {
  inputIOS: {
    flex: 1,
  },
  inputAndroid: {
    flex: 1,
    backgroundColor: 'red',
  },
  underline: { borderTopWidth: 0 },
};

const goalStyle = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
  },
  button: {
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  formContainer: {
    margin: 40,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  listButton: {
    height: 36,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
  respInput: {
    height: 36,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: 'white',
    paddingHorizontal: 7,
    fontSize: 17,
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
