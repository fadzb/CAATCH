import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Moment from 'moment';
import store from "../../Redux/store"
import {Icons} from "../../Constants/Icon";
import {readDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import {DbTableNames} from "../../Constants/Constants";
import App from "../../App";
import {AppColors} from "../../Styles/TabStyles";

export default class SafetyPlanSession extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const diaryDate = store.getState().diary.date;

        return {
            title: Moment(diaryDate).format('LL'),
            combinedList: []
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            safetyPlanItem: this.props.navigation.getParam('resultsArr'),
            type: this.props.navigation.getParam('type')
        }
    }
    // setting state as result array generated in SafetyPlanSummary.js

    componentDidMount() {
        const type = this.props.navigation.getParam('type');

        if(type === 'cope') {
            readDatabaseArg('copeId, copeName', DbTableNames.copingStrategy, this.combineLists, undefined, 'where dateDeleted is NULL')
        } else {
            readDatabaseArg('signId, signName', DbTableNames.warningSign, this.combineLists, undefined, 'where dateDeleted is NULL')
        }
    }

    combineLists = res => {
        const id = this.state.type === 'cope' ? 'copeId' : 'signId';

        this.setState({combinedList: res.map(t => {
            const test = this.state.safetyPlanItem.find(e => e[id] === t[id]);

            if(test) {
                return {...test}
            } else {
                return t
            }
        })})
    };

    renderItem = ({item}) => (
        <View style={spSessionStyle.listContainer}>
            <GeneralRow
                name= {this.state.type === 'cope' ? item.copeName : item.signName}
                rating={'yes'}
                icon={Icons.dividerArrow}
                selected={!isNaN(item.sessionId)}
            />
        </View>
    );

    render() {
        return (
            <View style={spSessionStyle.viewContainer}>
                <FlatList
                    data={this.state.combinedList}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const GeneralRow = (props) => (
    <View style={spSessionStyle.container}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center'}}>
            <View style={spSessionStyle.iconContainer}>
                <Icon
                    name={props.icon}
                    size={30}
                    color={AppColors.orange}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={spSessionStyle.buttonText}>{props.name}</Text>
                {props.selected && <View style={{paddingRight: 10}}>
                    <Icon
                    name={Icons.tick}
                    size={40}
                    color={AppColors.blue}/></View>}
            </View>
        </View>
    </View>
);
// stateless component for rendering each saved general rating

const spSessionStyle = StyleSheet.create({
    listContainer: {
        alignSelf: 'stretch'
    },

    viewContainer: {
        flex: 1,
    },

    container: {
        flex: 1,
        justifyContent: "space-around",
        borderBottomWidth: 1,
        marginLeft: 30,
        marginRight: 30,
        height: 80,
        borderColor: AppColors.orange
    },

    noteContainer: {
        flex: 1,
        justifyContent: "space-around",
        borderBottomWidth: 1,
        marginLeft: 30,
        marginRight: 30,
        alignItems: 'center',
    },

    buttonText: {
        fontSize: 18,
        paddingLeft: 10,
        flex: .8,
        color: AppColors.blue
    },

    ratingText: {
        fontSize: 18,
        paddingRight: 10
    },

    iconContainer: {
        paddingLeft: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    noteText: {
        fontSize: 15,
        paddingRight: 10
    }
});