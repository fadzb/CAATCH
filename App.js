import React from 'react';
import {createBottomTabNavigator, createSwitchNavigator} from 'react-navigation';
import { checkDB } from "./Util/DatabaseConnector";
import { mediaDirectoryCheck } from "./Util/Media";
import {Provider} from 'react-redux'
import store from './Redux/store'
import {readDatabase, updateDatabase} from "./Util/DatabaseHelper";
import Moment from 'moment';
import {updateUsage, updateDbtSetting} from "./Redux/actions";
import { AppLoading } from 'expo';

import TwitterScreen from "./Screens/TwitterScreen";
import PlanStack from "./Components/StackNavigators/SafetyPlanStack";
import DiaryStack from "./Components/StackNavigators/DiaryStack"
import SettingsStack from "./Components/StackNavigators/SettingsStack";
import Passcode from "./Screens/Passcode";
import HomeStack from "./Components/StackNavigators/HomeStack";

//Initial Tab screens/stack navs

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            passcodeEnabled: false
        }
    }

    postCheckDbFunctions = () => {
        mediaDirectoryCheck();
        // checks to ensure media directory exists and creates if not

        this.createNewUsage();
        // new usage session added to DB

        this.checkSettings();
    };

    checkSettings = () => {
        readDatabase('*',
            'User',
            (res) => {
                if(res[0].enabled === 1) {
                    this.setState({passcodeEnabled: true})
                }
                // check passcode

                if(res[0].dbt === 1) {
                    store.dispatch(updateDbtSetting(true))
                } else {
                    store.dispatch(updateDbtSetting(false))
                }
                // check DBT setting
            },
            () => this.setState({ isReady: true }))
    };
    // checks if user has passcode enabled

    createNewUsage = () => {
        updateDatabase("Usage",
            [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')],
            ["dateEntered"],
            undefined,
            res => store.dispatch(updateUsage(res.insertId)))
    };
    // creating new usage transaction in DB and storing usageId in global store

    loadData = () => {
        checkDB(this.postCheckDbFunctions)

        //Return promise here for home screen media so it is loaded during splash screen
    };

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this.loadData}
                    //onFinish={this.postCheckDbFunctions}
                    onFinish={() => console.log("loading finished")}
                    onError={console.warn}
                />
            );
        }
        //splashscreen

        if (this.state.passcodeEnabled) {
            return (
                <Provider store={store}>
                    <SwitchNav/>
                </Provider>
            );
        }
        //passcode

        return (
            <Provider store={store}>
                <TabBar/>
            </Provider>
        )
    }
    // Wrapping entire application in Provider component imported from 'react-redux'. Needed so every child component has access to store
}

const TabBar = createBottomTabNavigator(
    {
        Home: HomeStack,
        Plan: PlanStack,
        Diary: DiaryStack,
        News: TwitterScreen,
        Settings: SettingsStack
    },

    {
        tabBarOptions: {
            activeTintColor: "#a41034"
        }
    }
);
//Creating TabBar

const SwitchNav = createSwitchNavigator(
    {
        pass: Passcode,
        main: TabBar
    }
);
