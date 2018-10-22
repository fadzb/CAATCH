import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions, Image } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../Constants/Icon";

import {TabStyles} from "../Styles/TabStyles";
import {HomeScreenTileRow} from "../Components/HomeScreenTileRow";
import {SectionHeader} from "../Constants/Constants";
import {connect} from 'react-redux'

class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
        headerTitle: 'Home'
    };
    // static property called navigationOptions that belongs to all screen components

    render() {
        return (
            <View style={TabStyles.container}>
                <Image resizeMode={'cover'}
                       style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2.8}}
                       source={this.props.wallpaperImage ? {uri: this.props.wallpaperImage} : require('../Media/Images/lavender.jpg')} />
                <View style={homeStyle.tileContainer}>
                    <HomeScreenTileRow
                        name2={SectionHeader.diary}
                        iconName2= {Icons.diary + "-outline"}
                        onPress2={() => this.props.navigation.navigate('Diary')}
                        name1={SectionHeader.shortPlan}
                        iconName1= {Icons.plan + "-outline"}
                        onPress1={() => this.props.navigation.navigate('Plan')}
                        third={true}
                        name3="My Reports"
                        onPress3={() => this.props.navigation.navigate('reports')}
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
        margin: 10
    },

});

const mapStateToProps = state => ({
    wallpaperImage: state.setting.wallpaperImage,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(HomeScreen)
// HOC that re-renders the component automatically every time a particular section of state is updated

