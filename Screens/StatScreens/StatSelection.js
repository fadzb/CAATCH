import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import {CustomSelectionRow} from "../../Components/CustomSelectionRow";
import {Icons} from "../../Constants/Icon";
import {TabStyles} from "../../Styles/TabStyles";
import {connect} from 'react-redux'
import store from "../../Redux/store"
import {readDatabase, readDatabaseArg} from "../../Util/DatabaseHelper";
import {DbTableNames} from "../../Constants/Constants";

class StatSelection extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'My Stats',
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            emailRecipients: {}
        }
    }

    componentDidMount() {
        this.getEmailRecipients();
    }

    getEmailRecipients = () => {
        let emailArr = [];

        readDatabase('email', DbTableNames.user, res => {
            if(res[0].email) {

                emailArr.push(res[0].email);

                readDatabaseArg('email', DbTableNames.contact, res => {
                    res.forEach(r => {
                        if(r.email) {
                            emailArr.push(r.email)
                        }
                    });

                    this.setState({emailRecipients: emailArr.reduce((obj, email, i) => {
                        obj[(i + 1).toString()] = email;

                        return obj
                    }, {})})

                }, undefined, 'where dateDeleted is NULL and helper = 1')
            } else {
                readDatabaseArg('email', DbTableNames.contact, res => {
                    res.forEach(r => {
                        if(r.email) {
                            emailArr.push(r.email)
                        }
                    });

                    this.setState({emailRecipients: emailArr.reduce((obj, email, i) => {
                        obj[(i + 1).toString()] = email;

                        return obj
                    }, {})})

                }, undefined, 'where dateDeleted is NULL and helper = 1')
            }
        });
    };
    // reading user and helper db tables for email info (have restricted email recipients to user or helper)

    render() {
        return (
            <View style={TabStyles.stackContainer}>
                <View style={{alignSelf: 'stretch'}}>
                    <CustomSelectionRow
                        name="Charts"
                        icon={Icons.charts + '-outline'}
                        iconSize={30}
                        iconContainer={statSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('victory', {recipients: this.state.emailRecipients})}
                        containerStyle={{flex: 0, height: Dimensions.get('window').height / 11}}
                    />
                    {this.props.settings.dbt && <CustomSelectionRow
                        name="DBT Skills"
                        icon={Icons.charts + '-outline'}
                        iconSize={30}
                        iconContainer={statSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('vicSkills', {recipients: this.state.emailRecipients})}
                        containerStyle={{flex: 0, height: Dimensions.get('window').height / 11}}
                    />}
                    <CustomSelectionRow
                        name="App Usage"
                        icon={Icons.insights + '-outline'}
                        iconSize={30}
                        iconContainer={statSelectionStyle.iconContainer}
                        onPress={() => this.props.navigation.push('insights', {recipients: this.state.emailRecipients})}
                        containerStyle={{flex: 0, height: Dimensions.get('window').height / 11}}
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

const mapStateToProps = state => ({
    settings: state.setting
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(StatSelection)
// HOC that re-renders the component automatically every time a particular section of state is updated