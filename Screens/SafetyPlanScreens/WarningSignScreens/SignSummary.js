import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import Moment from 'moment';
import {CardListItem} from "../../../Components/CardListItem";
import {readDatabaseArg, updateDatabaseArgument} from "../../../Util/DatabaseHelper";
import {Icons} from "../../../Constants/Icon";
import {openSafetyPlanItem} from "../../../Util/Usage";
import {PressableIcon} from "../../../Components/PressableIcon";
import {getSign} from "../../../Redux/actions";
import store from "../../../Redux/store"
import {DbTableNames, UsageFunctionIds, DbPrimaryKeys} from "../../../Constants/Constants";

export default class SignSummary extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name'),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            copes: [],
        }
    }

    componentDidMount() {
        this.getCopeLink();

        openSafetyPlanItem(UsageFunctionIds.warningSign, DbTableNames.warningSign, this.props.navigation.getParam('id'), DbPrimaryKeys.warningSign, this.props.navigation.getParam('name'));
        // update DB for open sign function
    }

    getCopeLink = () => {
        const currentSignId = this.props.navigation.getParam('id');
        const linkTable = "CopeSignLink";
        const columnQuery = "c.copeId, c.copeName, c.copeDesc, c.copeUrl, c.mediaType, c.mediaPath, c.dateEntered, c.dateDeleted";

        readDatabaseArg(
            columnQuery,
            "CopingStrategy",
            copes => {this.setState({copes: copes})},
            undefined,
            'as c inner join ' + linkTable + ' as w on c.copeId = w.copeId where signId = ' + currentSignId + ' AND c.dateDeleted is null');
    };
    // retrieves linked coping strategies to current warning sign. Set's state with returned array

    formatDate = date => {
        return Moment(date).format('LLL');
    };

    getCompleteList = () => {
        readDatabaseArg("*", "WarningSign", this.updateSigns, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // fetching all warning signs that do not have a deleted date

    updateSigns = (signs) => {
        store.dispatch(getSign(signs));
        // dispatching total list of warning signs names from DB to global redux store
    };

    editSign = (id, name, desc) => {
        this.props.navigation.push('editWarning', {
            id: id,
            name: name,
            desc: desc,
        });
    };

    deleteSign = id => {
        updateDatabaseArgument("WarningSign",
            [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
            ["dateDeleted"],
            "where signId = " + id,
            () => this.props.navigation.pop(),
            (res) => this.getCompleteList())
    };
    // deleting pressed strategy and updating redux global store to re-render the strategy list

    showAlert = (id) => {
        Alert.alert(
            'Delete Sign',
            'Are you sure you want to delete this warning sign?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteSign(id), style: 'destructive'},
            ],
            { cancelable: false }
        )
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
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View style={{flex: 4, paddingRight: 9}}>
                                            <Text>{this.props.navigation.getParam('name')}</Text>
                                            <Text note>{this.formatDate(this.props.navigation.getParam('date'))}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                                            <PressableIcon
                                                iconName={Icons.edit + '-outline'}
                                                size={35}
                                                onPressFunction={() => this.editSign(this.props.navigation.getParam('id'),
                                                    this.props.navigation.getParam('name'),
                                                    this.props.navigation.getParam('desc'))}
                                            />
                                            <PressableIcon
                                                iconName={Icons.delete + '-outline'}
                                                size={35}
                                                onPressFunction={() => this.showAlert(this.props.navigation.getParam('id'))}
                                                color='red'
                                            />
                                        </View>
                                    </View>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body>
                                <Text style={signSummaryStyle.text}>
                                    {this.props.navigation.getParam('desc')}
                                </Text>
                                {this.state.copes.length !== 0 && <View style={signSummaryStyle.linkListContainer}>
                                    <Text style={signSummaryStyle.linkText}>Coping Strategies</Text>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                                        <FlatList
                                            data={this.state.copes}
                                            renderItem={({item}) =>
                                                <View>
                                                    <CardListItem
                                                        name= {item.copeName}
                                                        iconName={Icons.copingStrategy + "-outline"}
                                                        onPress={() => this.props.navigation.push('stratSummary', {
                                                            id: item.copeId,
                                                            name: item.copeName,
                                                            date: item.dateEntered,
                                                            desc: item.copeDesc,
                                                            url: item.copeUrl,
                                                            media: item.mediaPath,
                                                            mediaType: item.mediaType
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
    },

    linkText: {
        fontWeight: 'bold',
        padding: 10
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