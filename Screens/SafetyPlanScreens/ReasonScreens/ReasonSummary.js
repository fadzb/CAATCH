import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body } from 'native-base';
import Image from 'react-native-scalable-image';
import {ImageViewer} from "../../../Components/ImageViewer";
import Moment from 'moment';
import {Video} from 'expo';
import Icon from "react-native-vector-icons/Ionicons";


export default class ReasonSummary extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name'),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            playVideo: false
        }
    }

    toggleModal = bool => {
        this.setState({modalVisible: bool});
    };
    // modal for displaying image

    toggleVideo = bool => {
        this.player.presentFullscreenPlayer().then(res => console.log(res)).catch(err => console.log(err));

        this.setState({playVideo: bool});
    };
    // present video player in fullscreen mode

    formatDate = date => {
        return Moment(date).format('LLL');
    };

    render() {
        const mediaPath = this.props.navigation.getParam('media');
        const media = {uri: mediaPath};
        const mediaType = this.props.navigation.getParam('mediaType');

        const link = this.props.navigation.getParam('url');

        return (
            <View style={{flex: 1}}>
                <Container style={reasonSummaryStyle.viewContainer}>
                    <Content>
                        <Card style={reasonSummaryStyle.cardStyle}>
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
                                {mediaPath !== null && <View>
                                    <Image
                                        width={(Dimensions.get('window').width) - 35} // height will be calculated automatically
                                        source={mediaType === 'image' ? media : require("../../../Media/Images/video-play-button.jpg")}
                                        onPress={mediaType === 'image' ? () => this.toggleModal(true) : () => this.toggleVideo(true)}
                                    />
                                </View>}
                                <Text style={reasonSummaryStyle.text}>
                                    {this.props.navigation.getParam('desc')}
                                </Text>
                                {link !== null &&
                                <View style={reasonSummaryStyle.textLinkView}>
                                    <Icon
                                        name='ios-link'
                                        size={20}
                                        style={{paddingRight: 5}}
                                    />
                                    <Text style={reasonSummaryStyle.urlText}
                                          onPress={() => this.props.navigation.push('planWeb', {
                                              url: 'https://' + link
                                          })}>
                                        {link}
                                    </Text>
                                </View>
                                }
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
                <Video
                    ref={(ref) => {
                        this.player = ref
                    }}
                    source={media}
                    shouldPlay={this.state.playVideo}
                />
                <Modal animationType={'slide'} visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.toggleModal(false)}>
                    <ImageViewer
                        image={media}
                        onPress={() => this.toggleModal(false)}
                    />
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
        backgroundColor: '#cccccc'
    },

    textLinkView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5
    },

    text: {
        paddingTop: 10
    },

    urlText: {
        textDecorationLine: 'underline',
        color: 'blue',
        alignSelf: 'center'
    },

    linkListContainer: {
        backgroundColor: 'white',
        borderWidth: 2,
        alignSelf: 'stretch',
        padding: 5,
        borderRadius: 7,
        marginTop: 10
    }
});