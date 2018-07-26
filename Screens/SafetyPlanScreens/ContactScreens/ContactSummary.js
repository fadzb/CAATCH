import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, TouchableOpacity, Linking, FlatList, Text } from 'react-native';
import { Thumbnail } from 'native-base';
import Image from 'react-native-scalable-image';
import {ImageViewer} from "../../../Components/ImageViewer";
import Moment from 'moment';
import Communications from 'react-native-communications'
import {PressableIcon} from "../../../Components/PressableIcon";
import {Icons} from "../../../Constants/Icon";
import {openSafetyPlanItem} from "../../../Util/Usage";


export default class ContactSummary extends React.Component {

    static navigationOptions = ({ navigation }) => {

        firstName = navigation.getParam('firstName');
        surname = navigation.getParam('surname');

        if(surname === null) {
            return {
                title: firstName
            }
        } else {
            return {
                title: firstName + " " + surname,
            }
        }

    };

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            name: ""
        }
    }

    componentDidMount() {
        this.getName();

        openSafetyPlanItem(5, "Contact", this.props.navigation.getParam('id'))
        // update DB for open contact function
    }

    toggleModal = bool => {
        this.setState({modalVisible: bool});
    };
    // modal for displaying image

    formatDate = date => {
        return Moment(date).format('LLL');
    };

    getName = () => {
        const firstName = this.props.navigation.getParam('firstName');
        const surname = this.props.navigation.getParam('surname');

        if(surname === null) {
            this.setState({name: firstName})
        } else {
            this.setState({name: firstName + " " + surname})
        }
    };

    render() {
        const mediaPath = this.props.navigation.getParam('image');
        const media = {uri: mediaPath};

        const phone = this.props.navigation.getParam('phone');
        const email = this.props.navigation.getParam('email');

        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <View style={contactSummaryStyle.thumbnailContainer}>
                    {mediaPath !== null ? <TouchableOpacity onPress={() => this.toggleModal(true)}>
                            <Thumbnail style={contactSummaryStyle.thumbnail} source={media} />
                        </TouchableOpacity> :
                        <View style={contactSummaryStyle.circleView}>
                            <Text style={{fontSize: 70}}>{this.props.navigation.getParam('firstName').slice(0,1).toUpperCase()}</Text>
                        </View>}
                </View>
                <View style={contactSummaryStyle.nameTextView}><Text style={{fontSize: 22}}>{this.state.name}</Text></View>
                <View style={contactSummaryStyle.contactTextRow}>
                    <View style={{paddingLeft: 15}}>
                        <Text style={{paddingBottom: 5, fontSize: 16, color: '#808080'}}>Mobile</Text>
                        <Text style={{fontSize: 16}}>{phone}</Text>
                    </View>
                    <View style={contactSummaryStyle.contactButtonsView}>
                        <PressableIcon
                            iconName={Icons.contacts + "-outline"}
                            size={50}
                            onPressFunction={() => Communications.phonecall(phone, true)}
                            buttonStyle={contactSummaryStyle.iconButton}
                        />
                        <PressableIcon
                            iconName={Icons.message + "-outline"}
                            size={50}
                            onPressFunction={() => Communications.text(phone, "")}
                            buttonStyle={contactSummaryStyle.iconButton}
                        />
                    </View>
                </View>
                {email !== null && <View style={contactSummaryStyle.contactTextRow}>
                    <View style={{paddingLeft: 15}}>
                        <Text style={{paddingBottom: 5, fontSize: 16, color: '#808080'}}>Email</Text>
                        <Text style={{fontSize: 16}}>{email}</Text>
                    </View>
                    <View style={contactSummaryStyle.contactButtonsView}>
                        <PressableIcon
                            iconName={Icons.email + "-outline"}
                            size={50}
                            onPressFunction={() => Communications.email([email], null, null, null, null)}
                            buttonStyle={contactSummaryStyle.iconButton}
                        />
                    </View>
                </View>}
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

const contactSummaryStyle = StyleSheet.create({
    thumbnailContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    thumbnail: {
        height: 150,
        width: 150,
        borderRadius: 150/2,
        borderWidth: 1,
        borderColor: "#E0E0E0"
    },

    circleView: {
        width: 150,
        height: 150,
        borderRadius: 150/2,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    nameTextView: {
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        borderTopWidth: 2,
        borderColor: '#E0E0E0',
        marginLeft: 20,
        marginRight: 20,
    },

    contactTextRow: {
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 2,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
    },

    contactButtonsView: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        paddingRight: 20
    },

    iconButton: {
        paddingLeft: 23
    }
});