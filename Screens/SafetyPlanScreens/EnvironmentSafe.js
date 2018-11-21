import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import {TabStyles} from "../../Styles/TabStyles";
import {Icons} from "../../Constants/Icon";
import Icon from "react-native-vector-icons/Ionicons";
import {readDatabaseArg, updateDatabase, updateDatabaseArgument} from "../../Util/DatabaseHelper";
import {DbTableNames} from "../../Constants/Constants";
import {compareDates} from "../../Util/Compare";
import EnvironmentRow from "../../Components/EnvironmentRow";
import Moment from 'moment'

export default class EnvironmentSafe extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: 'Make the Environment Safe',
            headerRight: <TouchableOpacity
                onPress={() => params.handleThis()}
            ><Text style={{ padding: 10 }}>New +</Text>
            </TouchableOpacity>
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            text: '',
            inputHidden: true,
            invalidText: false,
            dataReady: false
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            handleThis: this.newStep
        });

        this.getStepsFromDb(() => this.setState({dataReady: true}));
    }
    
    getStepsFromDb = (callback) => {
        readDatabaseArg('*', DbTableNames.environment, res => this.setState({data: res}), callback, 'where dateDeleted is NULL')
    };

    renderItem = ({item}) => (
        <View style={environmentStyle.listContainer}>
            <EnvironmentRow
                description={item.environmentName}
                deleteFunction={() => this.showAlert(item.environmentId)}
            />
        </View>
    );

    handleSave = () => {
        if(!this.state.text) {
            this.setState({invalidText: true})
        } else {
            updateDatabase(DbTableNames.environment, [this.state.text, 1], ['environmentName', 'userEntry'], undefined,
                res => this.setState(prevState => ({
                    data: [{
                        environmentName: prevState.text,
                        dateEntered: new Date(),
                        environmentId: res.insertId
                    }, ...prevState.data], inputHidden: !prevState.inputHidden, text: '', invalidText: false
                })))
        }
    };
    // checks if text is a truthy value and, if yes, updates DB and state with new step

    deleteStep = id => {
        updateDatabaseArgument(DbTableNames.environment, [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')], ["dateDeleted"], "where environmentId = " + id, () => this.getStepsFromDb(undefined))
    };

    newStep = () => {
        this.setState(prevState => ({inputHidden: !prevState.inputHidden}))
    };

    showAlert = (id) => {
        Alert.alert(
            'Delete Step',
            'Are you sure you want to delete this step?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteStep(id), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    render() {
        return(
            <View style={TabStyles.stackContainer}>
                <View style={{flex: 1, marginHorizontal: 10}}>
                    <View style={environmentStyle.iconContainer}>
                        <Icon
                            name={Icons.environmentSafe + '-outline'}
                            size={Dimensions.get('window').width / 6}
                        />
                    </View>
                    <Text style={environmentStyle.headTextStyle}>These are some steps that you can take to keep your environment safe</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                        {!this.state.inputHidden &&
                        <TextInput
                            style={{height: 40, borderColor: (this.state.invalidText ? '#a94442' : 'gray'), borderWidth: 1, paddingLeft: 5, flex: 1, marginRight: 15}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            placeholder={'Please enter custom steps here'}
                            underlineColorAndroid={'transparent'}
                        />
                        }
                        <View style={{justifyContent: 'center', alignItems: (this.state.inputHidden ? 'center' : 'flex-end'), flex: (this.state.inputHidden ? 1 : undefined)}}>
                            {!this.state.inputHidden &&
                            <View style={{flexDirection: 'row', marginRight: 5}}>
                                <View style={{paddingRight: 15}}>
                                    <Icon
                                        name={Icons.tick}
                                        size={40}
                                        onPress={this.handleSave}
                                    />
                                </View>
                                <Icon
                                    name={Icons.closeModal + '-outline'}
                                    size={40}
                                    onPress={() => this.setState(prevState => ({inputHidden: !prevState.inputHidden, invalidText: false}))}
                                />
                            </View>}
                        </View>
                    </View>
                    {this.state.dataReady ? <FlatList
                        data={this.state.data.sort(compareDates)}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    /> : <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        </View>}
                </View>
            </View>
        )
    }
}

const environmentStyle = StyleSheet.create({
    iconContainer: {
        paddingTop: 10,
        //paddingBottom: 5,
        alignItems: 'center'
    },
    textStyle: {
        //textAlign: 'center',
        fontSize: 15
    },
    headTextStyle: {
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 10
    },
    textContainer: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
});