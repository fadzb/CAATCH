import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Image from 'react-native-scalable-image';
import {ImageViewer} from "../../../Components/ImageViewer";


export default class CardShowcaseExample extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name'),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        }
    }

    toggleModal = bool => {
        this.setState({modalVisible: bool});
    };
    // modal for displaying image

    render() {
        const image = require("../../../Media/Images/HD-Peaceful-Image.jpg");

        return (
            <View style={{flex: 1}}>
                <Container style={stratSummaryStyle.viewContainer}>
                    <Content>
                        <Card>
                            <CardItem>
                                <Left>
                                    <Body>
                                        <Text>{this.props.navigation.getParam('name')}</Text>
                                        <Text note>{this.props.navigation.getParam('date')}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <View>
                                        <Image
                                            width={(Dimensions.get('window').width) - 35} // height will be calculated automatically
                                            source={image}
                                            onPress={() => this.toggleModal(true)}
                                        />
                                    </View>
                                    <Text style={stratSummaryStyle.descText}>
                                        {this.props.navigation.getParam('desc')}
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
                <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.toggleModal(false)}>
                    <ImageViewer
                        image={image}
                        onPress={() => this.toggleModal(false)}
                    />
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

    descText: {
        paddingTop: 10
    }
});