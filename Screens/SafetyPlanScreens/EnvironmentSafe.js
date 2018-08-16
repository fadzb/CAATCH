import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import {TabStyles} from "../../Styles/TabStyles";
import {Icons} from "../../Constants/Icon";
import Icon from "react-native-vector-icons/Ionicons";
import {PressableIcon} from "../../Components/PressableIcon";

const EnvironmentRow = props => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1}}>
        <View style={environmentStyle.circleView}/>
        <View style={{flex: 1, marginLeft: 10, marginRight: 15}}>
            <Text style={{fontSize: 15}}>{props.description}</Text>
        </View>
        <View style={{width: 22}}>
            {props.info !== "" && <PressableIcon
                iconName={Icons.info + '-outline'}
                size={25}
                onPressFunction={props.infoFunction}
                color='#007AFF'
            />}
        </View>
    </View>
);

const EnvironmentData = [
    {
        description: "Removing or putting away items that you might be likely to use if you were thinking of killing yourself",
        info: "‘When I am feeling suicidal, I will ask my mother to hide away anything I could use to kill myself’"
    },
    {
        description: "Avoiding situations where you are likely to access these items",
        info: ""
    },
    {
        description: "Leaving a room or a location where you do not feel safe",
        info: "‘When I feel suicidal, I will leave my house and go to a place where there are people around, like a shopping centre, restaurant or library to distract myself’"
    },
    {
        description: "Telling someone that you are thinking of taking your own life",
        info: ""
    },
    {
        description: "Telling someone if you are thinking of switching suicide method",
        info: ""
    },
];

export default class EnvironmentSafe extends React.Component {
    static navigationOptions = {
        title: "Make the Environment Safe"
    };

    infoAlert = info => {
        Alert.alert(
            'For Example',
            info,
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };
    // alert for displaying skill info

    render() {
        return(
            <View style={TabStyles.stackContainer}>
                <View style={{flex: 1, paddingLeft: 15, paddingRight: 15}}>
                    <View style={environmentStyle.iconContainer}>
                        <Icon
                            name={Icons.environmentSafe + '-outline'}
                            size={Dimensions.get('window').width / 6}
                        />
                    </View>
                    <Text style={environmentStyle.headTextStyle}>These are some steps that you can take to keep your environment safe</Text>
                    <View style={{marginTop: 10, flex: 1}}>
                        {EnvironmentData.map((ed, i) => {
                            return (
                                <View key={i} style={environmentStyle.environmentRow}>
                                    <EnvironmentRow
                                        description={ed.description}
                                        info={ed.info}
                                        infoFunction={() => this.infoAlert(ed.info)}
                                    />
                                </View>
                            )
                        })}
                    </View>
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
        fontSize: 15,
        fontWeight: 'bold'
    },
    textContainer: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    circleView: {
        width: 15,
        height: 15,
        borderRadius: 15/2,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    environmentRow: {
        flex: 1,
        //borderWidth: 1,
        //justifyContent: 'center'
    }
});