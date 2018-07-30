import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {diaryPrePops} from "../../Constants/Prepopulated";
import SnapSlider from 'react-native-snap-slider';
import FeelingRow from '../../Components/FeelingRow'

import {TabStyles} from "../../Styles/TabStyles";

export default class Feelings extends React.Component {
    static navigationOptions = {
        title: "Feelings"
    };
    // static property called navigationOptions that belongs to all screen components

    constructor(props) {
        super(props);

        this.state = {
            feelings: []
        }
    }

    componentDidMount() {
        this.getFeelings(diaryPrePops);
    }

    getFeelings = feelingItem => {
        this.setState({ feelings: feelingItem.filter(f => f.diaryType === "Feeling") })
    };

    slidingComplete = (itemSelected) => {
        console.log("slidingComplete");
        console.log("item selected " + this.refs.slider.state.item);
        console.log("item selected(from callback)" + itemSelected);
        console.log("value " + this.sliderOptions[this.refs.slider.state.item].value);
    };

    renderItem = ({item}) => {
        return (
            <View style={feelingStyle.listContainer}>
                <FeelingRow
                    feeling={item}
                />
            </View>
        )
    };
    // prevSelected prop contains the history for that day if it was already filled in

    footer = () => (
        <TouchableOpacity style={feelingStyle.button} onPress={() => console.log('saved')}>
            <Text style={feelingStyle.buttonText}>Save</Text>
        </TouchableOpacity>
    );
    // save button

    render() {
        return (
            <View style={feelingStyle.viewContainer}>
                <FlatList
                    data={this.state.feelings}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={this.footer}
                />
            </View>
        );
    }
}

const feelingStyle = StyleSheet.create({
    listContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonText: {
        fontSize: 18,
        color: '#007AFF',
        alignSelf: 'center',
    },
    button: {
        height: 36,
        backgroundColor: '#fff',
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 8,
        margin: 30,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
});
