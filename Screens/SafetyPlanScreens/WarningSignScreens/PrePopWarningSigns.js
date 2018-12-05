import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from 'react-native-multiple-select-list';
import { safetyPlanPrePops } from '../../../Constants/Prepopulated';
import { SafetyPlanConstants } from '../../../Constants/Constants';
import CustomMultiSelectList from '../../../Components/CustomMultiSelectList';
import { themeStyles } from '../../../Styles/TabStyles';

export default class PrePopWarningSigns extends React.Component {
  static navigationOptions = {
    title: 'Select Sign',
  };

  constructor(props) {
    super(props);

    this.state = {
      signs: [],
      checkedSigns: [],
    };
  }

  componentDidMount() {
    this.updateSigns(safetyPlanPrePops);
  }

  updateSigns = (signs) => {
    this.setState({
      signs: signs.filter((item) => item.category === SafetyPlanConstants.warningSign).map((sign) => sign.name),
    });
  };
  // update checklist with signs from pre-populated array

  getCheckedSigns = (signs) => {
    this.setState({
      checkedSigns: signs.filter((s) => s !== undefined),
    });
  };
  // Updates state everytime option is checked/unchecked

  render() {
    return (
      <View style={preSignStyle.viewContainer}>
        <View style={{ flex: 1, marginBottom: 50 }}>
          <CustomMultiSelectList
            options={this.state.signs}
            multiple={false} //
            returnValue={'label'} // label or value
            callback={this.getCheckedSigns} // callback, array of selected items
            rowBackgroundColor={'#fff'}
            rowRadius={5}
            iconColor={'#00a2dd'}
            iconSize={25}
            itemStyle={preSignStyle.itemStyle}
            selectedIconName={'ios-checkmark-circle-outline'}
            unselectedIconName={'ios-radio-button-off-outline'}
            search={true}
          />
        </View>
        <TouchableHighlight
          style={[preSignStyle.button, themeStyles.multiSelectSaveButton]}
          onPress={
            this.props.navigation.getParam('edit')
              ? () => this.props.navigation.navigate('editWarning', { checkedSigns: this.state.checkedSigns })
              : () => this.props.navigation.navigate('newWarning', { checkedSigns: this.state.checkedSigns })
          }
          underlayColor="#99d9f4"
        >
          <Text style={[preSignStyle.buttonText, themeStyles.multiSelectSaveButtonText]}>Done</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const preSignStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  itemStyle: {
    //borderBottomWidth: 3,
    //flex: 1,
    //marginRight: 30
  },
  buttonText: {
    alignSelf: 'center',
  },
  button: {
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
