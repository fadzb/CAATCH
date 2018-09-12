import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body } from 'native-base';
import { PressableImage } from '../../../Components/PressableImage';
import { ImageViewer } from '../../../Components/ImageViewer';
import Moment from 'moment';
import { Video } from 'expo';
import Icon from 'react-native-vector-icons/Ionicons';
import { openSafetyPlanItem, latestSafetyPlanItem } from '../../../Util/Usage';
import { Icons } from '../../../Constants/Icon';
import { PressableIcon } from '../../../Components/PressableIcon';
import { updateDatabaseArgument, readDatabaseArg } from '../../../Util/DatabaseHelper';
import { FileSystem } from 'expo';
import { getReason } from '../../../Redux/actions';
import store from '../../../Redux/store';
import { DbTableNames, UsageFunctionIds, DbPrimaryKeys } from '../../../Constants/Constants';

export default class ReasonSummary extends React.Component {
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
    openSafetyPlanItem(
      UsageFunctionIds.mostViewed.reason,
      DbTableNames.reason,
      this.props.navigation.getParam('id'),
      DbPrimaryKeys.reason,
      this.props.navigation.getParam('name')
    );

    latestSafetyPlanItem(
      UsageFunctionIds.lastViewed.reason,
      this.props.navigation.getParam('id'),
      this.props.navigation.getParam('name')
    );
    // update DB for open reason function most and last viewed
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

  updateReasons = (reasons) => {
    store.dispatch(getReason(reasons));
    // dispatching total list of reason names from DB to global redux store
  };

  getCompleteList = () => {
    readDatabaseArg(
      '*',
      'Reason',
      this.updateReasons,
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
  };
  // fetching all reasons that do not have a deleted date

  editReason = (id, name, desc, url) => {
    this.props.navigation.push('editReason', {
      id: id,
      name: name,
      desc: desc,
      url: url,
    });
  };

  deleteReason = (id, path) => {
    this.removeMediaFile(path);

    updateDatabaseArgument(
      'Reason',
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateDeleted'],
      'where reasonId = ' + id,
      () => this.props.navigation.pop(),
      (res) => this.getCompleteList()
    );
  };
  // deleting pressed reason and updating redux global store to re-render the reason list.

  removeMediaFile = (path) => {
    FileSystem.deleteAsync(path)
      .then((res) => console.log('reason media deleted..'))
      .catch((err) => console.log(err));
  };
  // remove media file from SP media folder in documentDirectory

  showAlert = (id, path) => {
    Alert.alert(
      'Delete Reason',
      'Are you sure you want to delete this Reason?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteReason(id, path), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  render() {
    const mediaPath = this.props.navigation.getParam('media');
    const media = { uri: mediaPath };
    const mediaType = this.props.navigation.getParam('mediaType');

    const link = this.props.navigation.getParam('url');

    return (
      <View style={{ flex: 1 }}>
        <Container style={reasonSummaryStyle.viewContainer}>
          <Content>
            <Card style={reasonSummaryStyle.cardStyle}>
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
                          onPressFunction={() =>
                            this.editReason(
                              this.props.navigation.getParam('id'),
                              this.props.navigation.getParam('name'),
                              this.props.navigation.getParam('desc'),
                              link
                            )
                          }
                        />
                        <PressableIcon
                          iconName={Icons.delete + '-outline'}
                          size={35}
                          onPressFunction={() => this.showAlert(this.props.navigation.getParam('id'), mediaPath)}
                          color="red"
                        />
                      </View>
                    </View>
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
                  <Text style={reasonSummaryStyle.text}>{this.props.navigation.getParam('desc')}</Text>
                  {link !== null && (
                    <View style={reasonSummaryStyle.textLinkView}>
                      <Icon name="ios-link" size={20} style={{ paddingRight: 5 }} />
                      <Text
                        style={reasonSummaryStyle.urlText}
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

const reasonSummaryStyle = StyleSheet.create({
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
