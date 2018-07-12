import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Moment from 'moment';
import Expo from 'expo'


export default class SignSummary extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name'),
        }
    };

    constructor(props) {
        super(props);
    }

    formatDate = date => {
        return Moment(date).format('LLL');
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <Container style={signSummaryStyle.viewContainer}>
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
                                <Text style={signSummaryStyle.text}>
                                    {this.props.navigation.getParam('desc')}
                                </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            </View>
        );
    }
}

const signSummaryStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    text: {
        paddingTop: 10
    },

    urlText: {
        textDecorationLine: 'underline',
        color: 'blue'
    }
});