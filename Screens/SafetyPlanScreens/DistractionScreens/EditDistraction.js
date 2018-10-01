import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native'
import { PressableIcon } from "../../../Components/PressableIcon";
import store from "../../../Redux/store"
import {updateDistraction, getDistraction} from "../../../Redux/actions";
import Expo from 'expo';
import {Icons} from "../../../Constants/Icon";

import {TabStyles} from "../../../Styles/TabStyles";
import {updateDatabase, updateDatabaseArgument, readDatabaseArg, deleteDatabaseRow} from "../../../Util/DatabaseHelper";

const Form = t.form.Form;

const distraction = t.struct({
    distractName: t.String,
    distractDesc: t.String,
    distractUrl: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
    fields: {
        distractName: {
            placeholder: 'Name',
            auto: 'none'
        },
        distractDesc: {
            placeholder: 'Description',
            auto: 'none'
        },
        distractUrl: {
            placeholder: 'URL (eg. www.google.ie)',
            auto: 'none',
            autoCapitalize: 'none'
        },
    }
};
// for customizing form UI

export default class EditDistraction extends React.Component {
    static navigationOptions = {
        title: "Edit Thing"
    };

    constructor(props) {
        super(props);

        this.state = {
            value: {
                distractName: this.props.navigation.getParam('name'),
                distractDesc: this.props.navigation.getParam('desc'),
                distractUrl: this.props.navigation.getParam('url')
            },
            selectedMediaUri: "",
            selectedMediaName: "",
            selectedMediaType: ""
        }
    }

    componentWillReceiveProps(nextProps) {
        const checkedDistractions = nextProps.navigation.getParam('checkedDistractions', null);

        if(checkedDistractions !== this.props.navigation.getParam('checkedDistractions', null)) {
            if (checkedDistractions !== null) {
                this.setState({
                    value: {
                        distractName: checkedDistractions[0],
                        distractDesc: "",
                        distractUrl: ""
                    }
                })
            } else {
                console.log("no distraction checked");
            }
        }
    }
    // listen for new props coming from pre-populated screen and update accordingly

    onChange = (value) => {
        this.setState({ value: value })
    };

    updateDistractionList = (distraction) => {
        store.dispatch(updateDistraction(distraction));
        // dispatching new Distraction name to global redux store
    };

    refreshDb = func => {
        readDatabaseArg("*", "Distraction", func, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // for refreshing global state from Distraction table in DB

    updateGlobalDistractions = (distractions) => store.dispatch(getDistraction(distractions));

    checkMediaSelected = () => {
        if(this.state.selectedMediaUri !== "") {
            this.updateDBMedia(this.props.navigation.getParam('id'))
        }

        this.refreshDb(this.updateGlobalDistractions);

        this.updateLinkDbTable(this.props.navigation.getParam('id'));
    };
    // if media was selected -> update that row with path

    updateLinkDbTable = (distractId) => {
        const checkedContacts = this.props.navigation.getParam('checkedContacts', null);

        if(checkedContacts !== null) {
            deleteDatabaseRow("DistractContactLink", "where distractId = " + distractId);

            checkedContacts.forEach(contactId => {
                updateDatabase("DistractContactLink", [contactId, distractId], ["contactId", "distractId"]);
            });
        }

        readDatabaseArg("*", "Distraction", (distractions) => store.dispatch(getDistraction(distractions)), () => console.log("DB read success"), 'where dateDeleted is NULL');
    };

    updateDBMedia = distractId => {

        const mediaDirectory = 'SafetyplanMedia/';

        updateDatabaseArgument('Distraction',
            [Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName, this.state.selectedMediaType],
            ['mediaPath', 'mediaType'],
            'where distractId = ' + distractId,
        );

        Expo.FileSystem.moveAsync(
            {
                from: this.state.selectedMediaUri,
                to: Expo.FileSystem.documentDirectory + mediaDirectory + this.state.selectedMediaName
            }
        )
    };
    // update selected row with media path and copy file from cache to permanent directory

    takePhoto = () => {
        Expo.Permissions.askAsync(Expo.Permissions.CAMERA)
            .then(response => {
                if (response.status !== "granted") {
                    console.error("Camera permission not granted!");
                    return;
                }

                Expo.ImagePicker.launchCameraAsync()
                    .then(mediaShot => {
                        console.log(mediaShot);

                        if(!mediaShot.cancelled) {
                            const splitName = mediaShot.uri.split('/');
                            const shortName = splitName[splitName.length - 1];

                            this.setState(
                                {
                                    selectedMediaUri: mediaShot.uri,
                                    selectedMediaName: shortName,
                                    selectedMediaType: mediaShot.type
                                });
                        }
                    })
            })
    };
    // sets the state based on the media item that is taken via camera

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
                                    selectedMediaType: selectedMedia.type
                                });
                        }
                    })
            })
    };
    // sets the state based on the media item that is selected

    contactLinkNav = () => {
        const currentDistractId = this.props.navigation.getParam('id');
        const linkTable = "DistractContactLink";
        const columnQuery = "c.contactId, c.firstName, c.surname, c.phone, c.email, c.image, c.dateEntered, c.dateDeleted";

        readDatabaseArg(
            columnQuery,
            "Contact",
            contacts => {this.props.navigation.push('contactLink', {selectedContacts: contacts, edit: true}); console.log(contacts)},
            undefined,
            'as c inner join ' + linkTable + ' as d on c.contactId = d.contactId where distractId = ' + currentDistractId + ' AND c.dateDeleted is null');
    };

    onPress = () => {
        const value = this.refs.form.getValue();
        // returns values captured in form as object

        if (value) { // if validation fails, value will be null
            console.log(value);
            updateDatabaseArgument("Distraction",
                Object.values(value),
                Object.keys(value),
                'where distractId = ' + this.props.navigation.getParam('id'),
                this.updateDistractionList(value),
                this.checkMediaSelected);
            // write the saved values to DB if valid

            this.props.navigation.navigate('distraction');
            // pop to distraction list once saved
        }
    };

    render() {
        return(
            <View style={TabStyles.planContainer}>
                <View style={distractionStyle.formContainer}>
                    <Form
                        ref="form"
                        type={distraction}
                        value={this.state.value}
                        onChange={this.onChange}
                        options={options}
                    />
                    <PressableIcon
                        iconName="ios-arrow-dropright-outline"
                        size={25}
                        onPressFunction={() => this.props.navigation.push('prePopDistraction', {edit: true})}
                        name="Import"
                        buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                        buttonStyle={distractionStyle.listButton}
                        textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                        iconStyle={{alignSelf: 'center', flex: 1, alignItems: 'center'}}
                    />
                    <PressableIcon
                        iconName="ios-arrow-dropright-outline"
                        size={25}
                        onPressFunction={this.contactLinkNav}
                        name="Contact"
                        buttonContainerStyle={{flex: 1, flexDirection: 'row'}}
                        buttonStyle={distractionStyle.listButton}
                        textStyle={{alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6}}
                        iconStyle={{alignSelf: 'center', flex: 1, alignItems: 'center'}}
                    />
                    <TouchableHighlight style={distractionStyle.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={distractionStyle.buttonText}>Save</Text>
                    </TouchableHighlight>
                </View>
                <View style={distractionStyle.iconContainer}>
                    <PressableIcon
                        iconName={Icons.media + "-outline"}
                        size={80}
                        onPressFunction={this.captureMedia}
                        buttonStyle={distractionStyle.iconButton}
                    />
                    <PressableIcon
                        iconName={Icons.camera + "-outline"}
                        size={80}
                        onPressFunction={this.takePhoto}
                        buttonStyle={distractionStyle.iconButton}
                    />
                </View>
            </View>
        )
    }
}

const distractionStyle = StyleSheet.create({
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
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    }
});