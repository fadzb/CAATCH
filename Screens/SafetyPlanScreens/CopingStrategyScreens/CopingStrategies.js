import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { readDatabaseArg, updateDatabaseArgument } from "../../../Util/DatabaseHelper";
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow'
import {connect} from 'react-redux'
import {getCoping} from "../../../Redux/actions";
import store from "../../../Redux/store"
import Moment from 'moment';
import {FileSystem} from 'expo'
import {Icons} from "../../../Constants/Icon";
import {compareDates} from "../../../Util/Compare";
import {DbTableNames, SectionHeader} from "../../../Constants/Constants";

class CopingStrategies extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: SectionHeader.strategies,
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.push('newCoping')}
                ><Text style={{ padding: 10 }}>New +</Text>
                </TouchableOpacity>
            ),
        }
    };
    // Implementation for 'new' strategy button

    componentDidMount() {
        this.getCompleteList();
    }

    updateStrategies = (strats) => {
        store.dispatch(getCoping(strats));
        // dispatching total list of coping strategy names from DB to global redux store
    };

    getCompleteList = () => {
        readDatabaseArg("*", DbTableNames.copingStrategy, this.updateStrategies, () => console.log("DB read success"), 'where dateDeleted is NULL');
    };
    // fetching all coping strategies that do not have a deleted date

    editStrat = (id, name, desc, url) => {
        this.props.navigation.push('editCoping', {
            id: id,
            name: name,
            desc: desc,
            url: url,
        });
    };

    deleteStrat = (id, path) => {
        this.removeMediaFile(path);

        updateDatabaseArgument(DbTableNames.copingStrategy, [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')], ["dateDeleted"], "where copeId = " + id, () => console.log("deleting strategy..."), (res) => this.getCompleteList());
    };
    // deleting pressed strategy and updating redux global store to re-render the strategy list.

    removeMediaFile = path => {
        FileSystem.deleteAsync(path).then(res => console.log('strategy media deleted..')).catch(err => console.log(err));
    };
    // remove media file from SP media folder in documentDirectory

    showAlert = (id, path) => {
        Alert.alert(
            'Delete Strategy',
            'Are you sure you want to delete this coping strategy?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
                {text: 'Delete', onPress: () => this.deleteStrat(id, path), style: 'destructive'},
            ],
            { cancelable: false }
        )
    };

    summaryNav = (id, name, date, desc, url, media, mediaType) => {
        this.props.navigation.push('stratSummary', {
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
        <View style={stratStyle.listContainer}>
            <SafetyPlanSectionRow
                name= {item.copeName}
                onPress={() => this.summaryNav(item.copeId, item.copeName, item.dateEntered, item.copeDesc, item.copeUrl, item.mediaPath, item.mediaType)}
                deleteFunction={() => this.showAlert(item.copeId, item.mediaPath)}
                editFunction={() => this.editStrat(item.copeId, item.copeName, item.copeDesc, item.copeUrl)}
                videoThumbnail={(item.mediaPath !== null && item.mediaType === 'video') ? {uri: item.mediaPath} : undefined}
                thumbnail={(item.mediaPath !== null && item.mediaType === 'image') ? {uri: item.mediaPath} : undefined}
                icon={item.mediaPath === null ? Icons.copingStrategy + "-outline" : undefined}
            />
        </View>
    );

    render() {
        return (
            <View style={stratStyle.viewContainer}>
                <FlatList
                    data={this.props.coping.sort(compareDates)} // comes from mapStateToProps below
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const stratStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
        alignSelf: 'stretch'
    }
});

const mapStateToProps = state => ({
    coping: state.coping
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(CopingStrategies)
// HOC that re-renders the component automatically every time a particular section of state is updated