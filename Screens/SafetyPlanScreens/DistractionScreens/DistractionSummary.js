import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body } from 'native-base';
import Image from 'react-native-scalable-image';
import { ImageViewer } from '../../../Components/ImageViewer';
import Moment from 'moment';
import { Video } from 'expo';
import { readDatabaseArg } from '../../../Util/DatabaseHelper';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardListItem } from '../../../Components/CardListItem';
import { Icons } from '../../../Constants/Icon';

export default class DistractionSummary extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name'),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      playVideo: false,
      contacts: [],
    };
  }

  componentDidMount() {
    this.getContactLink();
  }

  getContactLink = () => {
    const currentDistractId = this.props.navigation.getParam('id');
    const linkTable = 'DistractContactLink';
    const columnQuery = 'c.contactId, c.firstName, c.surname, c.phone, c.email, c.image, c.dateEntered, c.dateDeleted';

    readDatabaseArg(
      columnQuery,
      'Contact',
      (contacts) => {
        this.setState({ contacts: contacts });
      },
      undefined,
      'as c inner join ' +
        linkTable +
        ' as d on c.contactId = d.contactId where distractId = ' +
        currentDistractId +
        ' AND c.dateDeleted is null'
    );
  };
  // retrieves linked coping strategies to current Distraction. Set's state with returned array

  toggleModal = (bool) => {
    this.setState({ modalVisible: bool });
  };
  // modal for displaying image

  toggleVideo = (bool) => {
    this.player
      .presentFullscreenPlayer()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    this.setState({ playVideo: bool });
  };
  // present video player in fullscreen mode

  formatDate = (date) => {
    return Moment(date).format('LLL');
  };

  render() {
    const mediaPath = this.props.navigation.getParam('media');
    const media = { uri: mediaPath };
    const mediaType = this.props.navigation.getParam('mediaType');

    const link = this.props.navigation.getParam('url');

    return (
      <View style={{ flex: 1 }}>
        <Container style={distractSummaryStyle.viewContainer}>
          <Content>
            <Card style={distractSummaryStyle.cardStyle}>
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
                        source={mediaType === 'image' ? media : require('../../../Media/Images/video-play-button.jpg')}
                        onPress={mediaType === 'image' ? () => this.toggleModal(true) : () => this.toggleVideo(true)}
                      />
                    </View>
                  )}
                  <Text style={distractSummaryStyle.text}>{this.props.navigation.getParam('desc')}</Text>
                  {link !== null && (
                    <View style={distractSummaryStyle.textLinkView}>
                      <Icon name="ios-link" size={20} style={{ paddingRight: 5 }} />
                      <Text
                        style={distractSummaryStyle.urlText}
                        onPress={() =>
                          this.props.navigation.push('planWeb', {
                            url: 'https://' + link,
                          })
                        }
                      >
                        {link}
                      </Text>
                    </View>
                  )}
                  {this.state.contacts.length !== 0 && (
                    <View style={distractSummaryStyle.linkListContainer}>
                      <Text style={distractSummaryStyle.linkText}>Contacts</Text>
                      <View style={{ flex: 1, alignSelf: 'stretch' }}>
                        <FlatList
                          data={this.state.contacts}
                          renderItem={({ item }) => (
                            <View>
                              <CardListItem
                                name={item.surname === null ? item.firstName : item.firstName + ' ' + item.surname}
                                iconName={Icons.contacts + '-outline'}
                                onPress={() =>
                                  this.props.navigation.push('contactSummary', {
                                    id: item.contactId,
                                    firstName: item.firstName,
                                    surname: item.surname,
                                    phone: item.phone,
                                    email: item.email,
                                    image: item.image,
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
        <Video
          ref={(ref) => {
            this.player = ref;
          }}
          source={media}
          shouldPlay={this.state.playVideo}
        />
        <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.toggleModal(false)}>
          <ImageViewer image={media} onPress={() => this.toggleModal(false)} />
        </Modal>
      </View>
    );
  }
}

const distractSummaryStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  cardStyle: {
    backgroundColor: '#cccccc',
  },

  textLinkView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },

  text: {
    paddingTop: 10,
  },

  urlText: {
    textDecorationLine: 'underline',
    color: 'blue',
    alignSelf: 'center',
  },

  linkListContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    alignSelf: 'stretch',
    padding: 5,
    borderRadius: 7,
    marginTop: 10,
  },

  linkText: {
    fontWeight: 'bold',
    padding: 10,
  },
});
