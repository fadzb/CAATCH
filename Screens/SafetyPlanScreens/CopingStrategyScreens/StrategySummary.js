import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body } from 'native-base';
import {PressableImage} from "../../../Components/PressableImage";
import {ImageViewer} from "../../../Components/ImageViewer";
import Moment from 'moment';
import {Video} from 'expo';
import Icon from "react-native-vector-icons/Ionicons";
import {openSafetyPlanItem, latestSafetyPlanItem} from "../../../Util/Usage";
import {Icons} from "../../../Constants/Icon";
import {PressableIcon} from "../../../Components/PressableIcon";
import {updateDatabaseArgument, readDatabaseArg} from "../../../Util/DatabaseHelper";
import {FileSystem} from 'expo'
import {getCoping} from "../../../Redux/actions";
import store from "../../../Redux/store"
import {DbTableNames, UsageFunctionIds, DbPrimaryKeys} from "../../../Constants/Constants";
import ImageView from 'react-native-image-view';
import {AppColors} from "../../../Styles/TabStyles";


export default class StrategySummary extends React.Component {

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

    componentDidMount() {
        openSafetyPlanItem(UsageFunctionIds.mostViewed.copingStrategy, DbTableNames.copingStrategy, this.props.navigation.getParam('id'), DbPrimaryKeys.copingStrategy, this.props.navigation.getParam('name'));

        latestSafetyPlanItem(UsageFunctionIds.lastViewed.copingStrategy, this.props.navigation.getParam('id'), this.props.navigation.getParam('name'))
        // update DB for open coping function most and last view
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

    showAlert = (id, path) => {
        Alert.alert(
            'Delete Strategy',
            'Are you sure you want to delete this coping strategy?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteStrat(id, path), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    editStrat = (id, name, desc, url) => {
        this.props.navigation.push('editCoping', {
            id: id,
            name: name,
            desc: desc,
            url: url,
        });
    };

    deleteStrat = (id, path) => {
        this.removeMediaFile(path);

        updateDatabaseArgument(DbTableNames.copingStrategy,
            [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
            ["dateDeleted"], "where copeId = " + id,
            () => this.props.navigation.pop(),
            (res) => this.getCompleteList());
    };
    // deleting pressed strategy and updating redux global store to re-render the strategy list.

    updateStrategies = (strats) => {
        store.dispatch(getCoping(strats));
        // dispatching total list of coping strategy names from DB to global redux store
    };

    getCompleteList = () => {
        readDatabaseArg("*", DbTableNames.copingStrategy, this.updateStrategies, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // fetching all coping strategies that do not have a deleted date

    removeMediaFile = path => {
        FileSystem.deleteAsync(path).then(res => console.log('strategy media deleted..')).catch(err => console.log(err));
    };
    // remove media file from SP media folder in documentDirectory

    formatDate = date => {
        return Moment(date).format('LLL');
    };

    render() {
        const mediaPath = this.props.navigation.getParam('media');
        const media = {uri: mediaPath};
        const mediaType = this.props.navigation.getParam('mediaType');

        const link = this.props.navigation.getParam('url');

        const images = [
            {
                source: media,
            },
        ];

        return (
            <View style={{flex: 1}}>
                <Container style={stratSummaryStyle.viewContainer}>
                    <Content>
                        <Card style={stratSummaryStyle.cardStyle}>
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
                                                    onPressFunction={() => this.editStrat(this.props.navigation.getParam('id'),
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
                                    <Text style={stratSummaryStyle.text}>
                                        {this.props.navigation.getParam('desc')}
                                    </Text>
                                    {link !== null &&
                                        <View style={stratSummaryStyle.textLinkView}>
                                            <Icon
                                                name='ios-link'
                                                size={20}
                                                style={{paddingRight: 5}}
                                            />
                                            <Text style={stratSummaryStyle.urlText}
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
                <ImageView
                    images={images}
                    imageIndex={0}
                    isVisible={this.state.modalVisible}
                    onClose={() => this.toggleModal(false)}
                    animationType={'slide'}
                />
            </View>
        );
    }
}

const stratSummaryStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },

    cardStyle: {
        backgroundColor: '#cccccc'
    },

    textLinkView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
    },

    text: {
        paddingTop: 10,
    },

    urlText: {
        textDecorationLine: 'underline',
        color: AppColors.orange,
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

});