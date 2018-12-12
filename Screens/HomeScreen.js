import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions, Image, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../Constants/Icon";
import ImageView from 'react-native-image-view';

import {TabStyles, themeStyles} from "../Styles/TabStyles";
import {HomeScreenTileRow} from "../Components/HomeScreenTileRow";
import {SectionHeader} from "../Constants/Constants";
import {connect} from 'react-redux'

class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
        headerTitle: 'Home'
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        }
    }

    toggleModal = bool => {
        this.setState({modalVisible: bool});
    };
    // modal for displaying image

    render() {
        return (
            <View style={[themeStyles.homeCrisisViewContainer, TabStyles.container]}>
                <TouchableOpacity onPress={() => this.toggleModal(true)}>
                    <Image resizeMode={'cover'}
                           style={[themeStyles.homeScreenImage, {width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height / 2.8, marginTop: 35}]}
                           source={this.props.wallpaperImage ? {uri: this.props.wallpaperImage} : require('../Media/Images/lavenderCropped.jpg')}
                    />
                </TouchableOpacity>
                <View style={homeStyle.tileContainer}>
                    <HomeScreenTileRow
                        name2={SectionHeader.diary}
                        iconName2= {Icons.diary + "-outline"}
                        onPress2={() => this.props.navigation.navigate('Diary')}
                        name1={SectionHeader.shortPlan}
                        iconName1= {Icons.plan + "-outline"}
                        onPress1={() => this.props.navigation.navigate('Plan')}
                        third={true}
                        name3="Reports"
                        onPress3={() => this.props.navigation.navigate('reportSelection')}
                        iconName3= {Icons.report + "-outline"}
                    />
                    <HomeScreenTileRow
                        name1={SectionHeader.stats}
                        iconName1= {Icons.stats + "-outline"}
                        onPress1={() => this.props.navigation.navigate('statSelection')}
                        name3="My Cal"
                        iconName3= {Icons.calendar + "-outline"}
                        onPress3={() => this.props.navigation.navigate('schedule')}
                        third={true}
                        name2={SectionHeader.goals}
                        onPress2={() => this.props.navigation.navigate('goals')}
                        iconName2= {Icons.goals + "-outline"}
                    />
                </View>
                <ImageView
                    images={this.props.wallpaperImage ? [{source: {uri: this.props.wallpaperImage}}] : [
                        {
                            source: require('../Media/Images/lavenderCropped.jpg'),
                            width: 652,
                            height: 454,
                        }]}
                    imageIndex={0}
                    isVisible={this.state.modalVisible}
                    onClose={() => this.toggleModal(false)}
                    animationType={'slide'}
                />
            </View>
        );
    }
}

const homeStyle = StyleSheet.create({
    banner: {
        //justifyContent: "flex-start"
    },

    tileContainer: {
        flex: 1,
        flexDirection: "column",
        alignSelf: "stretch",
        marginHorizontal: 10,
        //marginVertical: 20,
        marginBottom: 35
    },

});

const mapStateToProps = state => ({
    wallpaperImage: state.setting.wallpaperImage,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(HomeScreen)
// HOC that re-renders the component automatically every time a particular section of state is updated

