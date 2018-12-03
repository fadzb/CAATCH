import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, SectionList, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Container, Header, Content, Tab, Tabs, TabHeading, StyleProvider } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import platform from '../../../native-base-theme/variables/platform';
import { readDatabaseArg, updateDatabaseArgument } from "../../../Util/DatabaseHelper";
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow'
import {connect} from 'react-redux'
import {getContact} from "../../../Redux/actions";
import store from "../../../Redux/store"
import Moment from 'moment';
import {DbTableNames, SectionHeader} from "../../../Constants/Constants";
import {themeStyles} from "../../../Styles/TabStyles";

class Contacts extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SectionHeader.contacts,
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.push('newContact')}
                ><Text style={[{ padding: 10 }, themeStyles.headerRightText]}>New +</Text>
                </TouchableOpacity>
            ),
        }
    };
    // Implementation for 'new' contact button

    componentDidMount() {
        this.getCompleteList();
    }

    getCompleteList = () => {
        readDatabaseArg("*", DbTableNames.contact, this.updateContacts, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // fetching all contacts that do not have a deleted date

    updateContacts = (contacts) => {
        store.dispatch(getContact(contacts));
        // dispatching total list of contacts from DB to global redux store
    };

    editContact = (id, firstName, surname, phone, email, image, contactType, helper, responsibility) => {
        this.props.navigation.push('editContact', {
            id: id,
            firstName: firstName,
            surname: surname,
            phone: phone,
            email: email,
            image: image,
            contactType: contactType,
            helper: helper,
            responsibility: responsibility
        });
    };

    deleteContact = id => {
        updateDatabaseArgument(DbTableNames.contact, [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')], ["dateDeleted"], "where contactId = " + id, () => console.log("deleting contact..."), (res) => this.getCompleteList())
    };
    // deleting pressed contact and updating redux global store to re-render the contact list

    showAlert = (id) => {
        Alert.alert(
            'Delete Contact',
            'Are you sure you want to delete this contact?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteContact(id), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    summaryNav = (id, firstName, surname, phone, email, image, date, contactType, helper, responsibility) => {
        this.props.navigation.push('contactSummary', {
            id: id,
            firstName: firstName,
            surname: surname,
            phone: phone,
            email: email,
            image: image,
            date: date,
            contactType: contactType,
            helper: helper,
            responsibility: responsibility,
        });
    };

    compareNames = (contact1, contact2) => {
        if(contact2.firstName === 'Samaritans') {
            return 1;
        } else if(contact1.firstName.toUpperCase() < contact2.firstName.toUpperCase()) {
            return -1;
        } else if (contact1.firstName.toUpperCase() > contact2.firstName.toUpperCase()) {
            return 1;
        } else {
            return 0;
        }
    };
    // feed into sort function to sort contacts alphabetically. Also keeping Samaritans at top

    renderItem = ({item}) => (
        <View style={contactsStyle.listContainer}>
            <SafetyPlanSectionRow
                name= {item.firstName + `${item.surname !== null ? ' ' + item.surname : ''}`}
                onPress={() => this.summaryNav(item.contactId, item.firstName, item.surname, item.phone, item.email, item.image, item.dateEntered, item.contactType, item.helper, item.responsibility)}
                deleteFunction={() => this.showAlert(item.contactId)}
                editFunction={() => this.editContact(item.contactId, item.firstName, item.surname, item.phone, item.email, item.image, item.contactType, item.helper, item.responsibility)}
                thumbnail={item.image === null ? undefined : {uri: item.image}}
                circleView={item.image === null ? item.firstName.slice(0,1).toUpperCase() : undefined}
                rightIcon={item.helper && 'ios-star'}
            />
        </View>
    );

    render() {
        const NUMBER_OF_TABS = 2;

        return (
            <View style={contactsStyle.viewContainer}>
                <Container>
                    <StyleProvider style={getTheme(platform)}>
                        <Tabs locked={true} prerenderingSiblingsNumber={NUMBER_OF_TABS}>
                            <Tab heading={"Personal"}>
                                <FlatList
                                    data={this.props.contact.sort(this.compareNames).filter(contact => contact.contactType === "Personal")}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Tab>
                            <Tab heading={"Professional"}>
                                <FlatList
                                    data={this.props.contact.sort(this.compareNames).filter(contact => contact.contactType === "Professional")}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Tab>
                        </Tabs>
                    </StyleProvider>
                </Container>

            </View>
        );
    }
}

const contactsStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    sectionHeader: {
        flex: 1,
        alignItems: 'stretch',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
        backgroundColor: '#f0f0f5',
        padding: 8,
        borderWidth: 1,
        borderRadius: 2
    }
});

const mapStateToProps = state => ({
    contact: state.contact
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(Contacts)
// HOC that re-renders the component automatically every time a particular section of state is updated