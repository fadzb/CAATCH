import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Platform } from 'react-native';
import t from 'tcomb-form-native';
import store from '../../Redux/store';
import { newFeeling } from '../../Redux/actions';
import { AppColors, TabStyles } from '../../Styles/TabStyles';
import { updateDatabase } from '../../Util/DatabaseHelper';
import { DbTableNames, UsageFunctionIds } from '../../Constants/Constants';
import { updateDiaryPrePops } from '../../Constants/Prepopulated';

const Form = t.form.Form;

const reason = t.struct({
    diaryName: t.String,
    info: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
    fields: {
        diaryName: {
            placeholder: 'Name',
            auto: 'none'
        },
        info: {
            placeholder: 'Info',
            auto: 'none'
        },
    }
};
// for customizing form UI

export default class NewDbtItem extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const subType = navigation.getParam('subType');

        return {
            title: `New ${subType === 1 ? 'Urge' : 'Feeling'}`,
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            value: null,
        }
    }

    onChange = (value) => {
        this.setState({ value: value })
    };

    onPress = () => {
        const value = this.refs.form.getValue();
        // returns values captured in form as object

        if (value) { // if validation fails, value will be null
            console.log(value);
            updateDatabase(DbTableNames.diary, [...Object.values(value), this.props.navigation.getParam('subType'), 'Feeling', 5, 1, 0, 0],
                [...Object.keys(value), 'subType', 'diaryType', 'scale', 'deletable', 'defaultRating', 'minRating'],
                () => updateDiaryPrePops(() => {
                    this.props.navigation.navigate('feelings', {newFeeling: value.diaryName});
                }),
                res => store.dispatch(newFeeling({id: res.insertId, rating: 0})));
            // write the saved values to DB if valid
        }
    };

    if (value) {
      // if validation fails, value will be null
      console.log(value);
      updateDatabase(
        DbTableNames.diary,
        [...Object.values(value), this.props.navigation.getParam('subType'), 'Feeling', 5, 1, 0, 0],
        [...Object.keys(value), 'subType', 'diaryType', 'scale', 'deletable', 'defaultRating', 'minRating'],
        () =>
          updateDiaryPrePops(() => {
            this.props.navigation.navigate('feelings', { newFeeling: value.diaryName });
          }),
        (res) => store.dispatch(newFeeling({ id: res.insertId, rating: 0 }))
      );
      // write the saved values to DB if valid
    }
}

const dbtItemStyle = StyleSheet.create({
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
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
