import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { readDatabaseArg, updateDatabaseArgument } from "../../../Util/DatabaseHelper";
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow'
import {connect} from 'react-redux'
import {getReason} from "../../../Redux/actions";
import store from "../../../Redux/store"
import Moment from 'moment';
import {FileSystem} from 'expo'
import {Icons} from "../../../Constants/Icon";
import {compareDates} from "../../../Util/Compare";
import {DbTableNames} from "../../../Constants/Constants";

class ReasonsToLive extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Life Worth Living",
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.push('newReason')}
                ><Text style={{ padding: 10 }}>New +</Text>
                </TouchableOpacity>
            ),
        }
    };
    // Implementation for 'new' reason button

    componentDidMount() {
        this.getCompleteList();
    }

    updateReasons = (reasons) => {
        store.dispatch(getReason(reasons));
        // dispatching total list of reason names from DB to global redux store
    };

    getCompleteList = () => {
        readDatabaseArg("*", DbTableNames.reason, this.updateReasons, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // fetching all reasons that do not have a deleted date

    editReason = (id, name, desc, url) => {
        this.props.navigation.push('editReason', {
            id: id,
            name: name,
            desc: desc,
            url: url,
        });
    };

    deleteReason = (id, path) => {
        this.removeMediaFile(path);

        updateDatabaseArgument(DbTableNames.reason, [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')], ["dateDeleted"], "where reasonId = " + id, () => console.log("deleting reason..."), (res) => this.getCompleteList());
    };
    // deleting pressed reason and updating redux global store to re-render the reason list.

    removeMediaFile = path => {
        FileSystem.deleteAsync(path).then(res => console.log('reason media deleted..')).catch(err => console.log(err));
    };
    // remove media file from SP media folder in documentDirectory

    showAlert = (id, path) => {
        Alert.alert(
            'Delete Reason',
                'Are you sure you want to delete this Reason?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteReason(id, path), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    summaryNav = (id, name, date, desc, url, media, mediaType) => {
        this.props.navigation.push('reasonSummary', {
            id: id,
            name: name,
            date: date,
            desc: desc,
            url: url,
            media: media,
            mediaType: mediaType
        });
    };

    renderItem = ({item}) => (
        <View style={reasonStyle.listContainer}>
            <SafetyPlanSectionRow
                name= {item.reasonName}
                onPress={() => this.summaryNav(item.reasonId, item.reasonName, item.dateEntered, item.reasonDesc, item.reasonUrl, item.mediaPath, item.mediaType)}
                deleteFunction={() => this.showAlert(item.reasonId, item.mediaPath)}
                editFunction={() => this.editReason(item.reasonId, item.reasonName, item.reasonDesc, item.reasonUrl)}
                videoThumbnail={(item.mediaPath !== null && item.mediaType === 'video') ? {uri: item.mediaPath} : undefined}
                thumbnail={(item.mediaPath !== null && item.mediaType === 'image') ? {uri: item.mediaPath} : undefined}
                icon={item.mediaPath === null ? Icons.lifeWorthLiving + "-outline" : undefined}
            />
        </View>
    );

    render() {
        return (
            <View style={reasonStyle.viewContainer}>
                <FlatList
                    data={this.props.reason.sort(compareDates)} // comes from mapStateToProps below
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const reasonStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
        alignSelf: 'stretch'
    }
});

const mapStateToProps = state => ({
    reason: state.reason
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(ReasonsToLive)
// HOC that re-renders the component automatically every time a particular section of state is updated