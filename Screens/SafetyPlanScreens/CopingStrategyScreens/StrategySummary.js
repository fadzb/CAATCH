import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Image from 'react-native-scalable-image';
import { ImageViewer } from '../../../Components/ImageViewer';
import Moment from 'moment';
import Expo from 'expo';

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
    };
  }

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

  text: {
    paddingTop: 10,
  },

  urlText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});
