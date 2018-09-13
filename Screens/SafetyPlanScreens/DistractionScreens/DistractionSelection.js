import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableHighlight,
  Linking,
  FlatList,
  Alert,
  Text,
  ScrollView,
} from 'react-native';
import { CustomSelectionRow } from '../../../Components/CustomSelectionRow';
import { Icons } from '../../../Constants/Icon';
import { TabStyles } from '../../../Styles/TabStyles';
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow';

export default class DistractionSelection extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Distractions',
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={distractSelectionStyle.viewContainer}>
        <ScrollView>
          <View style={distractSelectionStyle.listContainer}>
            <SafetyPlanSectionRow
              name="Custom"
              onPress={() => this.props.navigation.push('distraction')}
              icon={Icons.dividerArrow + '-outline'}
            />
          </View>
          <View style={distractSelectionStyle.listContainer}>
            <SafetyPlanSectionRow
              name="Random Skill"
              onPress={() => this.props.navigation.push('randomSkill')}
              icon={Icons.dividerArrow + '-outline'}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const distractSelectionStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
