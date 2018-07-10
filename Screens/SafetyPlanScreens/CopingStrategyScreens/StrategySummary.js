import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';


export default class CardShowcaseExample extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name'),
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container style={stratSummaryStyle.viewContainer}>
                <Content>
                    <Card style={{flex: 0}}>
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
                            <Image source={require("../../../Media/Images/HD-Peaceful-Image.jpg")} style={{flex: 1}}/>
                            <Text>
                                {this.props.navigation.getParam('desc')}
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

const stratSummaryStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
});