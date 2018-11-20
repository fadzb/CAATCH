import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Moment from 'moment';
import store from "../../Redux/store"
import {Icons} from "../../Constants/Icon";

export default class FeelingsSession extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const diaryDate = store.getState().diary.date;

        return {
            title: Moment(diaryDate).format('LL'),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            feelings: this.props.navigation.getParam('resultsArr'),
        }
    }
    // setting state as result array generated in FeelingsSummary.js

    renderItem = ({item}) => (
        <View style={feelingSessionStyle.listContainer}>
            <FeelingRow
                name= {item.diaryName}
                rating={Math.round(item.rating) + " / " + item.scale}
                onPress={() => console.log('pressed')}
                icon={Icons.dividerArrow}
            />
        </View>
    );

    render() {
        return (
            <View style={feelingSessionStyle.viewContainer}>
                <FlatList
                    data={this.state.feelings}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const FeelingRow = (props) => (
    <View style={feelingSessionStyle.container}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center'}}>
            <View style={feelingSessionStyle.iconContainer}>
                <Icon
                name={props.icon}
                size={30}
                color={props.iconColor}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={feelingSessionStyle.buttonText}>{props.name}</Text>
                <Text style={feelingSessionStyle.ratingText}>{props.rating}</Text>
            </View>
        </View>
    </View>
);
// stateless component for rendering each saved feeling rating

const feelingSessionStyle = StyleSheet.create({
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
        height: 80
    },

    buttonText: {
        fontSize: 18,
        paddingLeft: 10,
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
    }
});