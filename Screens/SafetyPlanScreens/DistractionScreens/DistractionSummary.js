import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body } from 'native-base';
import {PressableImage} from "../../../Components/PressableImage";
import {ImageViewer} from "../../../Components/ImageViewer";
import Moment from 'moment';
import {Video} from 'expo';
import {readDatabaseArg, updateDatabaseArgument} from "../../../Util/DatabaseHelper";
import Icon from "react-native-vector-icons/Ionicons";
import {CardListItem} from "../../../Components/CardListItem";
import {Icons} from "../../../Constants/Icon";
import {openSafetyPlanItem} from "../../../Util/Usage";
import {PressableIcon} from "../../../Components/PressableIcon";
import {FileSystem} from 'expo'
import {getDistraction} from "../../../Redux/actions";
import store from "../../../Redux/store"
import {DbTableNames, UsageFunctionIds, DbPrimaryKeys} from "../../../Constants/Constants";

export default class DistractionSummary extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name'),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            playVideo: false,
            contacts: []
        }
    }

    componentDidMount() {
        this.getContactLink();

        openSafetyPlanItem(UsageFunctionIds.distraction, DbTableNames.distraction, this.props.navigation.getParam('id'), DbPrimaryKeys.distraction, this.props.navigation.getParam('name'))
        // update DB for open distraction function
    }

    getContactLink = () => {
        const currentDistractId = this.props.navigation.getParam('id');
        const linkTable = "DistractContactLink";
        const columnQuery = "c.contactId, c.firstName, c.surname, c.phone, c.email, c.image, c.dateEntered, c.dateDeleted";

        readDatabaseArg(
            columnQuery,
            "Contact",
            contacts => {this.setState({contacts: contacts})},
            undefined,
            'as c inner join ' + linkTable + ' as d on c.contactId = d.contactId where distractId = ' + currentDistractId + ' AND c.dateDeleted is null');
    };
    // retrieves linked coping strategies to current Distraction. Set's state with returned array

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

    updateDistractions = (distractions) => {
        store.dispatch(getDistraction(distractions));
        // dispatching total list of distraction names from DB to global redux store
    };

    getCompleteList = () => {
        readDatabaseArg("*", "Distraction", this.updateDistractions, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // fetching all distractions that do not have a deleted date

    editDistraction = (id, name, desc, url) => {
        this.props.navigation.push('editDistraction', {
            id: id,
            name: name,
            desc: desc,
            url: url,
        });
    };

    deleteDistraction = (id, path) => {
        this.removeMediaFile(path);

        updateDatabaseArgument("Distraction",
            [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
            ["dateDeleted"],
            "where distractId = " + id,
            () => this.props.navigation.pop(),
            (res) => this.getCompleteList());
    };
    // deleting pressed distraction and updating redux global store to re-render the distraction list.

    removeMediaFile = path => {
        FileSystem.deleteAsync(path).then(res => console.log('distraction media deleted..')).catch(err => console.log(err));
    };
    // remove media file from SP media folder in documentDirectory

    showAlert = (id, path) => {
        Alert.alert(
            'Delete Distraction',
            'Are you sure you want to delete this Distraction?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteDistraction(id, path), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    render() {
        const mediaPath = this.props.navigation.getParam('media');
        const media = {uri: mediaPath};
        const mediaType = this.props.navigation.getParam('mediaType');

        const link = this.props.navigation.getParam('url');

        return (
            <View style={{flex: 1}}>
                <Container style={distractSummaryStyle.viewContainer}>
                    <Content>
                        <Card style={distractSummaryStyle.cardStyle}>
                            <CardItem>
                                <Left>
                                    <Body>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <View style={{flex: 4, paddingRight: 9}}>
                                                <Text>{this.props.navigation.getParam('name')}</Text>
                                                <Text note>{this.formatDate(this.props.navigation.getParam('date'))}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                                                <PressableIcon
                                                    iconName={Icons.edit + '-outline'}
                                                    size={35}
                                                    onPressFunction={() => this.editDistraction(this.props.navigation.getParam('id'),
                                                        this.props.navigation.getParam('name'),
                                                        this.props.navigation.getParam('desc'),
                                                        link)}
                                                />
                                                <PressableIcon
                                                    iconName={Icons.delete + '-outline'}
                                                    size={35}
                                                    onPressFunction={() => this.showAlert(this.props.navigation.getParam('id'), mediaPath)}
                                                    color='red'
                                                />
                                            </View>
                                        </View>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body>
                                {mediaPath !== null && <View>
                                    <PressableImage
                                        source={mediaType === 'image' ? media : require("../../../Media/Images/video-play-button.jpg")}
                                        onPressFunction={mediaType === 'image' ? () => this.toggleModal(true) : () => this.toggleVideo(true)}
                                    />
                                </View>}
                                <Text style={distractSummaryStyle.text}>
                                    {this.props.navigation.getParam('desc')}
                                </Text>
                                {link !== null &&
                                <View style={distractSummaryStyle.textLinkView}>
                                    <Icon
                                        name='ios-link'
                                        size={20}
                                        style={{paddingRight: 5}}
                                    />
                                    <Text style={distractSummaryStyle.urlText}
                                          onPress={() => this.props.navigation.push('planWeb', {
                                              url: 'https://' + link
                                          })}>
                                        {link}
                                    </Text>
                                </View>
                                }
                                {this.state.contacts.length !== 0 && <View style={distractSummaryStyle.linkListContainer}>
                                    <Text style={distractSummaryStyle.linkText}>Contacts</Text>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                                        <FlatList
                                            data={this.state.contacts}
                                            renderItem={({item}) =>
                                                <View>
                                                    <CardListItem
                                                        name= {item.surname === null ? item.firstName : item.firstName + " " + item.surname}
                                                        iconName={Icons.contacts + "-outline"}
                                                        onPress={() => this.props.navigation.push('contactSummary', {
                                                            id: item.contactId,
                                                            firstName: item.firstName,
                                                            surname: item.surname,
                                                            phone: item.phone,
                                                            email: item.email,
                                                            image: item.image,
                                                            date: item.dateEntered
                                                        })}
                                                    />
                                                </View>}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                </View>}
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

const distractSummaryStyle = StyleSheet.create({
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
    },

    linkText: {
        fontWeight: 'bold',
        padding: 10
    }
});