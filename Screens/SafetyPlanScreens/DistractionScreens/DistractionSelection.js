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

export default class DistractionSelection extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Things to Do',
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <View style={{ height: Dimensions.get('window').height / 5, alignSelf: 'stretch' }}>
          <CustomSelectionRow
            name="Custom"
            icon={Icons.dividerArrow + '-outline'}
            iconSize={Dimensions.get('window').height / 20}
            iconContainer={distractSelectionStyle.iconContainer}
            onPress={() => this.props.navigation.push('distraction')}
          />
          <CustomSelectionRow
            name="Distraction"
            icon={Icons.dividerArrow + '-outline'}
            iconSize={Dimensions.get('window').height / 20}
            iconContainer={distractSelectionStyle.iconContainer}
            onPress={() => this.props.navigation.push('randomSkill')}
          />
        </View>
      </View>
    );
  }
}

const distractSelectionStyle = StyleSheet.create({
  iconContainer: {
    width: Dimensions.get('window').height / 20,
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
