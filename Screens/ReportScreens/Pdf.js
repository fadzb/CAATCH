import React from 'react';
import {Button, ScrollView, StyleSheet, Text, View, WebView, TouchableOpacity} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import Icon from "react-native-vector-icons/Ionicons";
import {Icons} from "../../Constants/Icon";

export default class Pdf extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Report",
            headerRight: (
                <View style={{justifyContent: 'center', paddingRight: 10, flex: 1}}>
                    <Icon
                        name={Icons.print + '-outline'}
                        size={30}
                        onPress={() => {
                            Expo.DangerZone.Print.printAsync({
                                uri: "http://localhost:3000/pdf"
                            }).then(res => console.log(res)).catch(err => console.log(err))
                        }}
                    />
                </View>
            ),
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={pdfStyle.container}>
                <PDFReader source={{ uri: "http://localhost:3000/pdf" }}/>
            </View>
        )
    }
    // for android need to change 'localhost' to local IP address of server -> System Preferences (Network)
}

const pdfStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },

});