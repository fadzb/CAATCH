import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native'
import { PressableIcon } from "../../../Components/PressableIcon";
import store from "../../../Redux/store"
import {updateContact, getContact} from "../../../Redux/actions";
import Expo from 'expo';
import {Icons} from "../../../Constants/Icon";

import {TabStyles} from "../../../Styles/TabStyles";
import {updateDatabase, updateDatabaseArgument, readDatabaseArg} from "../../../Util/DatabaseHelper";

const Form = t.form.Form;

const contact = t.struct({
    firstName: t.String,
    surname: t.maybe(t.String),
    phone: t.String,
    email: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
    fields: {
        firstName: {
            placeholder: 'First Name',
            auto: 'none'
        },
        surname: {
            placeholder: 'Surname',
            auto: 'none'
        },
        phone: {
            placeholder: 'Phone',
            auto: 'none',
        },
        email: {
            placeholder: 'Email',
            auto: 'none',
        },
    }
};
// for customizing form UI

export default class NewContact extends React.Component {
    static navigationOptions = {
        title: "New Contact"
    };

    constructor(props) {
        super(props);

        this.state = {
            value: null,
            selectedMediaUri: "",
            selectedMediaName: "",
        }
    }

    componentWillReceiveProps(nextProps) {
        const checkedContact = nextProps.navigation.getParam('checkedContact', null);

        if(checkedContact !== this.props.navigation.getParam('checkedStrats', null)) {
            if (checkedContact !== null) {
                this.setState({
                    value: {
                        firstName: checkedContact.firstName,
                        surname: checkedContact.surname,
                        email: checkedContact.email,
                        phone: checkedContact.phone
                    }
                })
            } else {
                console.log("no contact selected");
            }
        }
    }
    // listen for new props coming from phone contacts screen and update accordingly

    onChange = (value) => {
        this.setState({ value: value })
    };

    updateContactList = (contact) => {
        store.dispatch(updateContact(contact));
        // dispatching new Coping Strategy name to global redux store
    };

    refreshDb = func => {
        readDatabaseArg("*", "Contact", func, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // for refreshing global state from Coping Strategy table in DB

    updateGlobalContacts = (contacts) => store.dispatch(getContact(contacts));

    checkMediaSelected = (contactId) => {
        if(this.state.selectedMediaUri !== "") {
            this.updateDBMedia(contactId)
        }

        this.refreshDb(this.updateGlobalContacts);
    };
    // if media was selected -> update that row with path

    updateDBMedia = contactId => {

        const mediaDirectory = 'SafetyplanMedia/';

        updateDatabaseArgument('Contact',
            [Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName],
            ['mediaPath'],
            'where contactId = ' + contactId.insertId,
        );

        Expo.FileSystem.moveAsync(
            {
                from: this.state.selectedMediaUri,
                to: Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName
            }
        )
    };
    // update selected row with media path and copy file from cache to permanent directory

    captureMedia = () => {
        Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL)
            .then(response => {
                if (response.status !== "granted") {
                    console.error("Camera roll permission not granted!");
                    return;
                }

                Expo.ImagePicker.launchImageLibraryAsync({mediaTypes: Expo.ImagePicker.MediaTypeOptions.All})
                    .then(selectedMedia => {
                        console.log(selectedMedia);

                        if(!selectedMedia.cancelled) {
                            const splitName = selectedMedia.uri.split('/');
                            const shortName = splitName[splitName.length - 1];

                            this.setState(
                                {
                                    selectedMediaUri: selectedMedia.uri,
                                    selectedMediaName: shortName,
                                });
                        }
                    })
            })
    };
    // sets the state based on the media item that is selected

    onPress = () => {
        const value = this.refs.form.getValue();
        // returns values captured in form as object

        if (value) { // if validation fails, value will be null
            console.log(value);
            updateDatabase("Contact", Object.values(value), Object.keys(value), this.updateContactList(value), this.checkMediaSelected);
            // write the saved values to DB if valid

            this.props.navigation.pop();
            // pop to contact list once saved
        }
    };

    getPhoneContacts = () => {
        Expo.Permissions.askAsync(Expo.Permissions.CONTACTS)
            .then(response => {
                if (response.status !== "granted") {
                    console.error("Contacts permission not granted!");
                    return;
                }

                Expo.Contacts.getContactsAsync({fields: [Expo.Contacts.PHONE_NUMBERS,
                    Expo.Contacts.EMAILS,
                    Expo.Contacts.THUMBNAIL,
                    Expo.Contacts.IMAGE], pageSize: 10000})
                    .then(res => {
                        this.props.navigation.push('phoneContacts', {contacts: res.data})
                    })
            })
    };

    render() {
        return(
            <View style={TabStyles.planContainer}>
                <View style={contactStyle.formContainer}>
                    <Form
                        ref="form"
                        type={contact}
                        value={this.state.value}
                        onChange={this.onChange}
                        options={options}
                    />
                    <PressableIcon
                        iconName="ios-arrow-dropright-outline"
                        size={25}
                        onPressFunction={this.getPhoneContacts}
                        name="Import Phone Contacts"
                        buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                        buttonStyle={contactStyle.listButton}
                        textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                        iconStyle={{alignSelf: 'center', flex: 1, alignItems: 'center'}}
                    />
                    <TouchableHighlight style={contactStyle.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={contactStyle.buttonText}>Save</Text>
                    </TouchableHighlight>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
                    <PressableIcon
                        iconName={Icons.media + "-outline"}
                        size={80}
                        onPressFunction={this.captureMedia}
                        buttonStyle={contactStyle.iconButton}
                    />
                </View>
            </View>
        )
    }
}

const contactStyle = StyleSheet.create({
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
    },
    listButton: {
        height: 36,
        borderColor: '#cccccc', // <= relevant style here
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: '#f2f2f2'
    }
});