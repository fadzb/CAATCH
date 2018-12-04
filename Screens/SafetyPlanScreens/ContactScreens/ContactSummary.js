import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Linking,
  FlatList,
  Text,
  Alert,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { ImageViewer } from '../../../Components/ImageViewer';
import Moment from 'moment';
import Communications from 'react-native-communications';
import { PressableIcon } from '../../../Components/PressableIcon';
import { Icons } from '../../../Constants/Icon';
import { openSafetyPlanItem, latestSafetyPlanItem } from '../../../Util/Usage';
import { updateDatabaseArgument, readDatabaseArg } from '../../../Util/DatabaseHelper';
import { getContact } from '../../../Redux/actions';
import store from '../../../Redux/store';
import { DbTableNames, UsageFunctionIds, DbPrimaryKeys } from '../../../Constants/Constants';
import ImageView from 'react-native-image-view';
import { AppColors } from '../../../Styles/TabStyles';

export default class ContactSummary extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const firstName = navigation.getParam('firstName');
    const surname = navigation.getParam('surname');

    if (surname === null) {
      return {
        title: firstName,
      };
    } else {
      return {
        title: firstName + ' ' + surname,
      };
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      name: '',
    };
  }

  componentDidMount() {
    this.getName(() => {
      openSafetyPlanItem(
        UsageFunctionIds.mostViewed.contact,
        DbTableNames.contact,
        this.props.navigation.getParam('id'),
        DbPrimaryKeys.contact,
        this.state.name
      );

      latestSafetyPlanItem(UsageFunctionIds.lastViewed.contact, this.props.navigation.getParam('id'), this.state.name);
    });
    // update DB for open contact function most view and last view
  }

  toggleModal = (bool) => {
    this.setState({ modalVisible: bool });
  };
  // modal for displaying image

  formatDate = (date) => {
    return Moment(date).format('LLL');
  };

  getCompleteList = () => {
    readDatabaseArg(
      '*',
      DbTableNames.contact,
      this.updateContacts,
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
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
      responsibility: responsibility,
    });
  };

  deleteContact = (id) => {
    updateDatabaseArgument(
      DbTableNames.contact,
      [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
      ['dateDeleted'],
      'where contactId = ' + id,
      () => this.props.navigation.pop(),
      (res) => this.getCompleteList()
    );
  };
  // deleting pressed contact and updating redux global store to re-render the contact list

  showAlert = (id) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteContact(id), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  getName = (func) => {
    const firstName = this.props.navigation.getParam('firstName');
    const surname = this.props.navigation.getParam('surname');

    if (surname === null) {
      this.setState({ name: firstName }, func);
    } else {
      this.setState({ name: firstName + ' ' + surname }, func);
    }
  };

  render() {
    const mediaPath = this.props.navigation.getParam('image');
    const media = { uri: mediaPath };

    const phone = this.props.navigation.getParam('phone');
    const email = this.props.navigation.getParam('email');
    const helper = this.props.navigation.getParam('helper');
    const responsibility = this.props.navigation.getParam('responsibility');
    const contactType = this.props.navigation.getParam('contactType');

    const iconSize = Dimensions.get('window').height / 16;

    const images = [
      {
        source: media,
      },
    ];

    return (
      <View style={{ flex: 1 }}>
        <View style={contactSummaryStyle.thumbnailContainer}>
          {mediaPath !== null ? (
            <TouchableOpacity onPress={() => this.toggleModal(true)}>
              <Thumbnail style={contactSummaryStyle.thumbnail} source={media} />
            </TouchableOpacity>
          ) : (
            <View style={contactSummaryStyle.circleView}>
              <Text style={{ fontSize: 70, color: AppColors.blue }}>
                {this.props.navigation.getParam('firstName').slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={contactSummaryStyle.deleteEditButtons}>
            <PressableIcon
              iconName={Icons.edit + '-outline'}
              size={35}
              onPressFunction={() =>
                this.editContact(
                  this.props.navigation.getParam('id'),
                  this.props.navigation.getParam('firstName'),
                  this.props.navigation.getParam('surname'),
                  phone,
                  email,
                  mediaPath,
                  contactType,
                  helper,
                  responsibility
                )
              }
              buttonStyle={{ marginRight: 15 }}
              color={AppColors.blue}
            />
            <PressableIcon
              iconName={Icons.delete + '-outline'}
              size={35}
              onPressFunction={() => this.showAlert(this.props.navigation.getParam('id'))}
              color="red"
            />
          </View>
        </View>
        <View style={contactSummaryStyle.nameTextView}>
          <Text style={{ fontSize: 22, color: AppColors.blue }}>{this.state.name}</Text>
        </View>
        <View style={contactSummaryStyle.contactTextRow}>
          <View style={{ flex: 0.55, paddingLeft: 10 }}>
            <Text style={{ paddingBottom: 5, fontSize: 16, color: '#808080' }}>Mobile</Text>
            <Text style={{ fontSize: 16, color: AppColors.blue }}>{phone}</Text>
          </View>
          <View style={contactSummaryStyle.contactButtonsView}>
            <PressableIcon
              iconName={Icons.contacts + '-outline'}
              size={iconSize}
              onPressFunction={() => Communications.phonecall(phone, true)}
              color={AppColors.orange}
            />
            <PressableIcon
              iconName={Icons.message + '-outline'}
              size={iconSize}
              onPressFunction={() => Communications.text(phone, '')}
              color={AppColors.orange}
            />
            <PressableIcon
              iconName={Icons.whatsapp}
              size={iconSize}
              color={'#4FCE5D'}
              onPressFunction={() =>
                Linking.openURL('whatsapp://send?text=&phone=' + phone).catch((err) => console.log(err))
              }
            />
          </View>
        </View>
        {email !== null && (
          <View style={contactSummaryStyle.contactTextRow}>
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ paddingBottom: 5, fontSize: 16, color: '#808080' }}>Email</Text>
              <Text style={{ fontSize: 16, color: AppColors.blue }}>{email}</Text>
            </View>
            <View style={contactSummaryStyle.emailContactButtonsView}>
              <PressableIcon
                iconName={Icons.email + '-outline'}
                size={iconSize}
                onPressFunction={() => Communications.email([email], null, null, null, null)}
                color={AppColors.orange}
              />
            </View>
          </View>
        )}
        {helper && (
          <View style={contactSummaryStyle.contactTextRow}>
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ paddingBottom: 5, fontSize: 16, color: '#808080' }}>How they can help me</Text>
              <Text style={{ fontSize: 16, color: AppColors.blue }}>{responsibility}</Text>
            </View>
          </View>
        )}
        <ImageView
          images={images}
          imageIndex={0}
          isVisible={this.state.modalVisible}
          onClose={() => this.toggleModal(false)}
          animationType={'slide'}
        />
      </View>
    );
  }
}

const contactSummaryStyle = StyleSheet.create({
  thumbnailContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbnail: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    borderWidth: 1,
    borderColor: AppColors.orange,
  },

  circleView: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppColors.orange,
  },

  nameTextView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 2,
    borderColor: '#E0E0E0',
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },

  contactTextRow: {
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 2,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
  },

  contactButtonsView: {
    flexDirection: 'row',
    flex: 0.45,
    justifyContent: 'space-between',
    paddingRight: 10,
    alignItems: 'center',
    paddingLeft: 10,
  },

  emailContactButtonsView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    alignItems: 'center',
    paddingLeft: 10,
    flex: 1,
  },

  deleteEditButtons: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    margin: 20,
  },
});
