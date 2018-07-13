import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Image from 'react-native-scalable-image';
import { ImageViewer } from '../../../Components/ImageViewer';
import Moment from 'moment';
import { CardListItem } from '../../../Components/CardListItem';
import { readDatabaseArg } from '../../../Util/DatabaseHelper';

export default class StrategySummary extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      signs: [],
    };
  }

  componentDidMount() {
    this.getSignLink();
  }

  getSignLink = () => {
    currentCopeId = this.props.navigation.getParam('id');
    linkTable = 'CopeSignLink';
    columnQuery = 'w.signId, w.signName, w.signDesc, w.dateEntered';

    readDatabaseArg(
      columnQuery,
      'WarningSign',
      (signs) => {
        this.setState({ signs: signs });
      },
      undefined,
      'as w inner join ' + linkTable + ' as c on w.signId = c.signId where copeId = ' + currentCopeId
    );
  };
  // retrieves linked warning signs to current coping strategy. Set's state with returned array

  toggleModal = (bool) => {
    this.setState({ modalVisible: bool });
  };
  // modal for displaying image

  formatDate = (date) => {
    return Moment(date).format('LLL');
  };

  render() {
    const mediaPath = this.props.navigation.getParam('media');
    const image = { uri: mediaPath };

    const link = this.props.navigation.getParam('url');

    return (
      <View style={{ flex: 1 }}>
        <Container style={stratSummaryStyle.viewContainer}>
          <Content>
            <Card style={stratSummaryStyle.cardStyle}>
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
                  {mediaPath !== null && (
                    <View>
                      <Image
                        width={Dimensions.get('window').width - 35} // height will be calculated automatically
                        source={image}
                        onPress={() => this.toggleModal(true)}
                      />
                    </View>
                  )}
                  <Text style={stratSummaryStyle.text}>{this.props.navigation.getParam('desc')}</Text>
                  {link !== null && (
                    <Text style={stratSummaryStyle.text}>
                      url:{' '}
                      <Text
                        style={stratSummaryStyle.urlText}
                        onPress={() =>
                          this.props.navigation.push('copeWeb', {
                            url: 'https://' + link,
                          })
                        }
                      >
                        {link}
                      </Text>
                    </Text>
                  )}
                  {this.state.signs.length !== 0 && (
                    <View style={stratSummaryStyle.linkListContainer}>
                      <View style={{ flex: 1, alignSelf: 'stretch' }}>
                        <FlatList
                          data={this.state.signs}
                          renderItem={({ item }) => (
                            <View>
                              <CardListItem
                                name={item.signName}
                                onPress={() =>
                                  this.props.navigation.push('signSummary', {
                                    name: item.signName,
                                    desc: item.signDesc,
                                    date: item.dateEntered,
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
        {mediaPath !== null && (
          <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.toggleModal(false)}>
            <ImageViewer image={image} onPress={() => this.toggleModal(false)} />
          </Modal>
        )}
      </View>
    );
  }
}

const stratSummaryStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  cardStyle: {
    backgroundColor: '#cccccc',
  },

  text: {
    paddingTop: 10,
  },

  urlText: {
    textDecorationLine: 'underline',
    color: 'blue',
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
