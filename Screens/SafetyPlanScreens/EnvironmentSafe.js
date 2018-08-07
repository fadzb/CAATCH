import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, ScrollView } from 'react-native';
import {TabStyles} from "../../Styles/TabStyles";
import {Icons} from "../../Constants/Icon";
import Icon from "react-native-vector-icons/Ionicons";

export default class EnvironmentSafe extends React.Component {
    static navigationOptions = {
        title: "Make the Environment Safe"
    };

    render() {
        return(
            <View style={TabStyles.stackContainer}>
                <ScrollView style={{paddingLeft: 15, paddingRight: 15}}>
                    <View style={environmentStyle.iconContainer}>
                        <Icon
                            name={Icons.environmentSafe + '-outline'}
                            size={Dimensions.get('window').width / 6}
                        />
                    </View>
                    <Text style={environmentStyle.headTextStyle}>These are some steps that you can take to keep your environment safe</Text>
                    <View style={{marginTop: 10, flex: 1}}>
                        <View style={[environmentStyle.textContainer, {borderTopWidth: 1}]}>
                            <Text style={environmentStyle.textStyle}>Removing or putting away items that you might be likely to use if you were thinking of killing yourself{"\n"}{"\n"}
                            For example, ‘When I am feeling suicidal, I will ask my mother to hide away anything I could use to kill myself’
                            </Text>
                        </View>
                        <View style={environmentStyle.textContainer}>
                            <Text style={environmentStyle.textStyle}>Avoiding situations where you are likely to access these items</Text>
                        </View>
                        <View style={environmentStyle.textContainer}>
                            <Text style={environmentStyle.textStyle}>Leaving a room or a location where you do not feel safe{"\n"}{"\n"}
                            For example, ‘When I feel suicidal, I will leave my house and go to a place where there are people around, like a shopping centre, restaurant or library to distract myself’
                            </Text>
                        </View>
                        <View style={environmentStyle.textContainer}>
                            <Text style={environmentStyle.textStyle}>Telling someone that you are thinking of taking your own life</Text>
                        </View>
                        <View style={environmentStyle.textContainer}>
                            <Text style={environmentStyle.textStyle}>Telling someone if you are thinking of switching suicide method</Text>
                        </View>
                    </View>
                </ScrollView>
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
    }
});