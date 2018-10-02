import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import { PressableIcon } from "../../../Components/PressableIcon";
import store from "../../../Redux/store"
import {updateHelper, getHelper} from "../../../Redux/actions";
import {TabStyles} from "../../../Styles/TabStyles";
import {updateDatabase, updateDatabaseArgument, readDatabaseArg} from "../../../Util/DatabaseHelper";
import {DbTableNames, UsageFunctionIds} from "../../../Constants/Constants";
import {latestSafetyPlanItem} from "../../../Util/Usage";

export default class EditHelper extends React.Component {
    static navigationOptions = {
        title: "Edit Helper"
    };

    constructor(props) {
        super(props);

        this.state = {
            resp: this.props.navigation.getParam('resp'),
            contact: this.props.navigation.getParam('name'),
            validResp: true,
            validContact: true,
            contactId: this.props.navigation.getParam('contactId'),
        }
    }

    componentWillReceiveProps(nextProps) {
        const checkedContact = nextProps.navigation.getParam('checkedContact', null);

        if(checkedContact !== this.props.navigation.getParam('checkedContact', null)) {
            if (checkedContact !== null) {
                this.setState({
                    contact: checkedContact.contactName,
                    contactId: checkedContact.contactId
                })
            } else {
                console.log("no contact checked");
            }
        }
    }
    // listen for new props coming from pre-populated screen and update accordingly

    updateHelperList = (helper) => {
        store.dispatch(updateHelper(helper));
        // dispatching new Helper name to global redux store
    };

    refreshDb = func => {
        readDatabaseArg("h.*, c.contactId, c.firstName, c.surname", DbTableNames.helper, func, () => console.log("DB read success"), ' as h inner join ' + DbTableNames.contact + ' as c' +
            ' on h.contactId = c.contactId where h.dateDeleted is NULL');
    };
    // for refreshing global state from Helper table in DB

    updateGlobalHelpers = (helpers) => store.dispatch(getHelper(helpers));

    postSaveFunctions = (helperId) => {
        this.refreshDb(this.updateGlobalHelpers);
    };
    // if media was selected -> update that row with path

    onPress = () => {
        if(this.state.resp.length === 0 && this.state.contact === 'Contact') {
            this.setState({
                validResp: false,
                validContact: false
            })
        } else if(this.state.resp.length === 0) {
            this.setState({
                validResp: false,
                validContact: true
            })
        } else if(this.state.contact === 'Contact') {
            this.setState({
                validContact: false,
                validResp: true,
            })
        } else {
            updateDatabaseArgument(DbTableNames.helper,
                [this.state.resp, this.state.contactId],
                ['responsibility', 'contactId'],
                'where helperId = ' + this.props.navigation.getParam('id'),
                this.updateHelperList({firstName: this.state.contact, responsibility: this.state.resp}),
                this.postSaveFunctions);
            // write the saved values to DB if valid

            this.props.navigation.navigate('helper');
            // pop to helper list once saved
        }
    };

    render() {
        return(
            <View style={TabStyles.planContainer}>
                <View style={helperStyle.formContainer}>
                    <PressableIcon
                        iconName="ios-arrow-dropright-outline"
                        size={25}
                        onPressFunction={() => this.props.navigation.push('contactList', {edit: true})}
                        name={this.state.contact}
                        buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                        buttonStyle={[helperStyle.listButton, this.state.validContact ? {} : {borderColor: '#a94442'}]}
                        textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                        iconStyle={{alignSelf: 'center', flex: 1, alignItems: 'center'}}
                    />
                    <TextInput
                        style={[helperStyle.respInput, this.state.validResp ? {} : {borderColor: '#a94442'}]}
                        placeholder={'Responsibility'}
                        value={this.state.resp}
                        onChangeText={text => this.setState({resp: text})}
                    />
                    <TouchableHighlight style={helperStyle.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={helperStyle.buttonText}>Save</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const helperStyle = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    formContainer: {
        margin: 40,
    },
    iconButton: {
        alignItems: "center",
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    listButton: {
        height: 36,
        borderColor: '#cccccc', // <= relevant style here
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: '#f2f2f2'
    },
    respInput: {
        height: 36,
        borderColor: '#cccccc', // <= relevant style here
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: 'white',
        paddingHorizontal: 7,
        fontSize: 17
    },
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    }
});