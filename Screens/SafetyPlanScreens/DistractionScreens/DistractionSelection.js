import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import { CustomSelectionRow } from '../../../Components/CustomSelectionRow';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body } from 'native-base';
import { PressableImage } from '../../../Components/PressableImage';
import { ImageViewer } from '../../../Components/ImageViewer';
import Moment from 'moment';
import { Video } from 'expo';
import { readDatabaseArg, updateDatabaseArgument } from '../../../Util/DatabaseHelper';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardListItem } from '../../../Components/CardListItem';
import { Icons } from '../../../Constants/Icon';
import { openSafetyPlanItem } from '../../../Util/Usage';
import { PressableIcon } from '../../../Components/PressableIcon';
import { FileSystem } from 'expo';
import { getDistraction } from '../../../Redux/actions';
import store from '../../../Redux/store';
import { TabStyles } from '../../../Styles/TabStyles';

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
            name="Random Skill"
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
