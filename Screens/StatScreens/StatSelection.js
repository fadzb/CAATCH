import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import {CustomSelectionRow} from "../../Components/CustomSelectionRow";
import {Icons} from "../../Constants/Icon";
import {TabStyles} from "../../Styles/TabStyles";

export default class StatSelection extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'My Stats',
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <View style={{height: (Dimensions.get('window').height / 11) * 3, alignSelf: 'stretch'}}>
                    <CustomSelectionRow
                        name="Charts - Feelings"
                        icon={Icons.charts + '-outline'}
                        iconSize={30}
                        iconContainer={statSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('victory')}
                    />
                    <CustomSelectionRow
                        name="Charts - DBT Skills"
                        icon={Icons.charts + '-outline'}
                        iconSize={30}
                        iconContainer={statSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('vicSkills')}
                    />
                    <CustomSelectionRow
                        name="Insights"
                        icon={Icons.insights + '-outline'}
                        iconSize={30}
                        iconContainer={statSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('insights')}
                    />
                </View>
            </View>
        );
    }
}

const statSelectionStyle = StyleSheet.create({
    iconContainer: {
        width: Dimensions.get('window').height / 20,
        height: Dimensions.get('window').height / 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});