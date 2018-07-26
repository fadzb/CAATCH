import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Moment from 'moment';
import { CardListItem } from '../../../Components/CardListItem';
import { readDatabaseArg } from '../../../Util/DatabaseHelper';
import { Icons } from '../../../Constants/Icon';
import { openSafetyPlanItem } from '../../../Util/Usage';

export default class SignSummary extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      copes: [],
    };
  }

  componentDidMount() {
    this.getCopeLink();

    openSafetyPlanItem(1, 'WarningSign', this.props.navigation.getParam('id'));
    // update DB for open sign function
  }

  getCopeLink = () => {
    const currentSignId = this.props.navigation.getParam('id');
    const linkTable = 'CopeSignLink';
    const columnQuery =
      'c.copeId, c.copeName, c.copeDesc, c.copeUrl, c.mediaType, c.mediaPath, c.dateEntered, c.dateDeleted';

    readDatabaseArg(
      columnQuery,
      'CopingStrategy',
      (copes) => {
        this.setState({ copes: copes });
      },
      undefined,
      'as c inner join ' +
        linkTable +
        ' as w on c.copeId = w.copeId where signId = ' +
        currentSignId +
        ' AND c.dateDeleted is null'
    );
  };
  // retrieves linked coping strategies to current warning sign. Set's state with returned array

  formatDate = (date) => {
    return Moment(date).format('LLL');
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Container style={signSummaryStyle.viewContainer}>
          <Content>
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>{this.props.navigation.getParam('name')}</Text>
                    <Text note>{this.formatDate(this.props.navigation.getParam('date'))}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={signSummaryStyle.text}>{this.props.navigation.getParam('desc')}</Text>
                  {this.state.copes.length !== 0 && (
                    <View style={signSummaryStyle.linkListContainer}>
                      <Text style={signSummaryStyle.linkText}>Coping Strategies</Text>
                      <View style={{ flex: 1, alignSelf: 'stretch' }}>
                        <FlatList
                          data={this.state.copes}
                          renderItem={({ item }) => (
                            <View>
                              <CardListItem
                                name={item.copeName}
                                iconName={Icons.copingStrategy + '-outline'}
                                onPress={() =>
                                  this.props.navigation.push('stratSummary', {
                                    id: item.copeId,
                                    name: item.copeName,
                                    date: item.dateEntered,
                                    desc: item.copeDesc,
                                    url: item.copeUrl,
                                    media: item.mediaPath,
                                    mediaType: item.mediaType,
                                  })
                                }
                              />
                            </View>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    </View>
                  )}
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </View>
    );
  }
}

const signSummaryStyle = StyleSheet.create({
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
    marginTop: 10,
  },
});
