import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body } from 'native-base';
import { PressableImage } from '../../../Components/PressableImage';
import { ImageViewer } from '../../../Components/ImageViewer';
import Moment from 'moment';
import { Video } from 'expo';
import Icon from 'react-native-vector-icons/Ionicons';
import { openSafetyPlanItem } from '../../../Util/Usage';

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
      playVideo: false,
    };
  }

  componentDidMount() {
    openSafetyPlanItem(2, 'CopingStrategy', this.props.navigation.getParam('id'));
    // update DB for open coping function
  }

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
                      <PressableImage
                        source={mediaType === 'image' ? media : require('../../../Media/Images/video-play-button.jpg')}
                        onPressFunction={
                          mediaType === 'image' ? () => this.toggleModal(true) : () => this.toggleVideo(true)
                        }
                      />
                    </View>
                  )}
                  <Text style={stratSummaryStyle.text}>{this.props.navigation.getParam('desc')}</Text>
                  {link !== null && (
                    <View style={stratSummaryStyle.textLinkView}>
                      <Icon name="ios-link" size={20} style={{ paddingRight: 5 }} />
                      <Text
                        style={stratSummaryStyle.urlText}
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
        <Modal
          animationType={'slide'}
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => this.toggleModal(false)}
        >
          <ImageViewer image={media} onPress={() => this.toggleModal(false)} />
        </Modal>
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
});
