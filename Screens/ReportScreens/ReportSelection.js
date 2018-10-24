import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import {CustomSelectionRow} from "../../Components/CustomSelectionRow";
import {Icons} from "../../Constants/Icon";
import {TabStyles} from "../../Styles/TabStyles";

export default class ReportSelection extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'My Reports',
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <View style={{alignSelf: 'stretch'}}>
                    <CustomSelectionRow
                        name="Safety Plan"
                        icon={Icons.plan + '-outline'}
                        iconSize={30}
                        iconContainer={reportSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('spReport')}
                        containerStyle={{flex: 0, height: Dimensions.get('window').height / 11}}
                    />
                    <CustomSelectionRow
                        name="Diary"
                        icon={Icons.diary + '-outline'}
                        iconSize={30}
                        iconContainer={reportSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('diaryReport')}
                        containerStyle={{flex: 0, height: Dimensions.get('window').height / 11}}
                    />
                </View>
            </View>
        );
    }
}

const reportSelectionStyle = StyleSheet.create({
    iconContainer: {
        width: Dimensions.get('window').height / 20,
        height: Dimensions.get('window').height / 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
