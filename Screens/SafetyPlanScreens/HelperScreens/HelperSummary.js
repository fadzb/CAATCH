import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Moment from 'moment';
import { CardListItem } from '../../../Components/CardListItem';
import { readDatabaseArg, updateDatabaseArgument } from '../../../Util/DatabaseHelper';
import { Icons } from '../../../Constants/Icon';
import { openSafetyPlanItem, latestSafetyPlanItem } from '../../../Util/Usage';
import { PressableIcon } from '../../../Components/PressableIcon';
import { getHelper } from '../../../Redux/actions';
import store from '../../../Redux/store';
import { DbTableNames, UsageFunctionIds, DbPrimaryKeys } from '../../../Constants/Constants';

export default class HelperSummary extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name'),
    };
  };

  componentDidMount() {
    openSafetyPlanItem(
      UsageFunctionIds.mostViewed.helper,
      DbTableNames.helper,
      this.props.navigation.getParam('id'),
      DbPrimaryKeys.helper,
      this.props.navigation.getParam('name')
    );

    latestSafetyPlanItem(
      UsageFunctionIds.lastViewed.helper,
      this.props.navigation.getParam('id'),
      this.props.navigation.getParam('name')
    );
    // update DB for open helper function most and last viewed
  }

  formatDate = (date) => {
    return Moment(date).format('LLL');
  };

  getCompleteList = () => {
    readDatabaseArg(
      'h.*, c.contactId, c.firstName, c.surname',
      DbTableNames.helper,
      this.updateHelpers,
      () => console.log('DB read success'),
      ' as h inner join ' + DbTableNames.contact + ' as c' + ' on h.contactId = c.contactId where h.dateDeleted is NULL'
    );
  };
  // fetching all helpers that do not have a deleted date

  updateHelpers = (helpers) => {
    store.dispatch(getHelper(helpers));
    // dispatching total list of helpers names from DB to global redux store
  };

  editHelper = (id, name, responsibility, contactId) => {
    this.props.navigation.push('editHelper', {
      id: id,
      name: name,
      resp: responsibility,
      contactId: contactId,
    });
  };

  deleteHelper = (id) => {
    updateDatabaseArgument(
      DbTableNames.helper,
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateDeleted'],
      'where helperId = ' + id,
      () => this.props.navigation.pop(),
      (res) => this.getCompleteList()
    );
  };
  // deleting pressed helper and updating redux global store to re-render the strategy list

  showAlert = (id) => {
    Alert.alert(
      'Delete Helper',
      'Are you sure you want to delete this helper?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteHelper(id), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Container style={helperSummaryStyle.viewContainer}>
          <Content>
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 4, paddingRight: 9 }}>
                        <Text>{this.props.navigation.getParam('name')}</Text>
                        <Text note>{this.formatDate(this.props.navigation.getParam('date'))}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                        <PressableIcon
                          iconName={Icons.edit + '-outline'}
                          size={35}
                          onPressFunction={() => this.editHelper(c)}
                        />
                        <PressableIcon
                          iconName={Icons.delete + '-outline'}
                          size={35}
                          onPressFunction={() => this.showAlert(this.props.navigation.getParam('id'))}
                          color="red"
                        />
                      </View>
                    </View>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={helperSummaryStyle.text}>{this.props.navigation.getParam('responsibility')}</Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </View>
    );
  }
}

const helperSummaryStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  text: {
    paddingTop: 10,
  },

  urlText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },

  linkText: {
    fontWeight: 'bold',
    padding: 10,
  },

  linkListContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    alignSelf: 'stretch',
    padding: 5,
    borderRadius: 7,
    marginTop: 25,
  },
});
