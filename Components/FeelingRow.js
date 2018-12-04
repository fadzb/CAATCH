import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, Alert } from 'react-native';
import Slider from "react-native-slider";
import store from "../Redux/store"
import {updateFeelingRating} from "../Redux/actions";
import {PressableIcon} from "./PressableIcon";
import {Icons} from "../Constants/Icon";
import {AppColors} from "../Styles/TabStyles";

export default class FeelingRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
            value: 0,
            width: 0,
            scale: 0
        }
    }

    componentDidMount() {
        this.setState({
            options: this.getSliderOptions(this.props.feeling),
            scale: this.props.feeling.scale
        });
    }

    getSliderOptions = feeling => {
        let arr = [];

        for (let i = 0; i <= feeling.scale; i++) {
            arr.push({value: i, label: i.toString()})
        }

        return arr;
    };
    //create array of objects for each rating in feeling

    tapSliderHandler = (evt) => {
        const pressPosition = evt.nativeEvent.locationX;

        this.setState({value: Math.round(((pressPosition - sliderMargin) / this.state.width) * this.state.scale) },
            () => store.dispatch(updateFeelingRating({id: this.props.feeling.diaryId, rating: this.state.value})));
    };
    //enable pressing on slider. Taking 10 from pixel position as that is length of border. Pass rating to global redux store on callback

    valueChangeHandler = val => {
        this.setState({ value: val });

        store.dispatch(updateFeelingRating({id: this.props.feeling.diaryId, rating: val}));
    };

    onLayout = (e) => {
        this.setState({
            width: e.nativeEvent.layout.width,
        })
    };
    //retrieves width of view containing slider component

    infoAlert = () => {
        Alert.alert(
            this.props.feeling.diaryName,
            this.props.feeling.info,
            [
                {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
            { cancelable: false }
        )
    };
    // alert for displaying feeling info

    render() {
        return (
            <View style={feelingRowStyle.viewContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 7}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <PressableIcon
                            iconName={Icons.info + '-outline'}
                            size={25}
                            onPressFunction={this.infoAlert}
                            color='#007AFF'
                        />
                        <Text style={feelingRowStyle.text}>{this.props.feeling.diaryName}</Text>
                    </View>
                    {this.props.feeling.deletable === 1 && <PressableIcon
                        iconName={Icons.delete + '-outline'}
                        size={30}
                        onPressFunction={this.props.deleteFunction}
                        color='red'
                    />}
                </View>
                <View onLayout={this.onLayout} ref="slider">
                    <TouchableWithoutFeedback onPressIn={this.tapSliderHandler}>
                        <Slider
                            minimumValue={0}
                            maximumValue={this.props.feeling.scale}
                            step={1}
                            value={this.state.value}
                            onValueChange={this.valueChangeHandler}
                            thumbTintColor={AppColors.blue}
                            minimumTrackTintColor={AppColors.orange}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {this.state.options.map((m, i) => <View style={feelingRowStyle.labelContainer} key={i.toString()}>
                        <Text style={{color: AppColors.blue, fontSize: 15}} >{i.toString()}</Text>
                    </View>)}
                </View>
            </View>
        );
    }
};

const sliderMargin = 15;

const feelingRowStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingVertical: 10,
        borderBottomWidth: .5,
        borderColor: AppColors.orange,
        marginLeft: sliderMargin,
        marginRight: sliderMargin,
    },
    text: {
        paddingLeft: 10,
        fontSize: 15,
        color: AppColors.blue
    },
    labelContainer: {
        height: 20,
        width: 20,
        alignItems: 'center'
    }

});