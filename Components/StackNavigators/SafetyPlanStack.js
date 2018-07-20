import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../../Constants/Icon";

import PlanScreen from "../../Screens/PlanScreen";
import WarningSigns from "../../Screens/SafetyPlanScreens/WarningSignScreens/WarningSigns";
import NewCopingStrategy from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/NewCopingStrategy";
import ReasonsToLive from "../../Screens/SafetyPlanScreens/ReasonScreens/ReasonsToLive";
import Distractions from "../../Screens/SafetyPlanScreens/DistractionScreens/Distractions";
import Contacts from "../../Screens/SafetyPlanScreens/ContactScreens/Contacts";
import NewContact from "../../Screens/SafetyPlanScreens/ContactScreens/NewContact";
import EnvironmentSafe from "../../Screens/SafetyPlanScreens/EnvironmentSafe";
import CopingStrategies from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/CopingStrategies";
import PrePopCopingStrategies from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/PrePopCopingStrategies";
import StrategySummary from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/StrategySummary";
import PlanWebView from "../../Screens/SafetyPlanScreens/PlanWebView";
import NewWarningSign from "../../Screens/SafetyPlanScreens/WarningSignScreens/NewWarningSign";
import CopingStrategyLink from "../../Screens/SafetyPlanScreens/WarningSignScreens/CopingStrategyLink";
import SignSummary from "../../Screens/SafetyPlanScreens/WarningSignScreens/SignSummary";
import PhoneContacts from "../../Screens/SafetyPlanScreens/ContactScreens/PhoneContacts";
import ContactSummary from "../../Screens/SafetyPlanScreens/ContactScreens/ContactSummary";
import NewReason from "../../Screens/SafetyPlanScreens/ReasonScreens/NewReason";
import ReasonSummary from "../../Screens/SafetyPlanScreens/ReasonScreens/ReasonSummary";
import NewDistraction from "../../Screens/SafetyPlanScreens/DistractionScreens/NewDistraction";
import PrePopDistraction from "../../Screens/SafetyPlanScreens/DistractionScreens/PrePopDistraction";
import DistractionSummary from "../../Screens/SafetyPlanScreens/DistractionScreens/DistractionSummary";
import DistractContactLink from "../../Screens/SafetyPlanScreens/DistractionScreens/DistractContactLink";

const PlanStack = createStackNavigator(
    {
        main: PlanScreen,
        warning: WarningSigns,
        newWarning: NewWarningSign,
        copingLink: CopingStrategyLink,
        signSummary: SignSummary,
        coping: CopingStrategies,
        newCoping: NewCopingStrategy,
        prePopCope: PrePopCopingStrategies,
        stratSummary: StrategySummary,
        planWeb: PlanWebView,
        reason: ReasonsToLive,
        newReason: NewReason,
        reasonSummary: ReasonSummary,
        distraction: Distractions,
        newDistraction: NewDistraction,
        prePopDistraction: PrePopDistraction,
        distractionSummary: DistractionSummary,
        contactLink: DistractContactLink,
        contact: Contacts,
        newContact: NewContact,
        phoneContacts: PhoneContacts,
        contactSummary: ContactSummary,
        environment: EnvironmentSafe
    },

    {
        initialRouteName: "main"
    }
);
// Safety Plan stack navigator

PlanStack.navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
        <Ionicons
            name={Icons.plan + `${focused ? "" : "-outline"}`}
            // if icon is not pressed use outline
            size={25}
            color={tintColor}
        />
    ),
};
// setting tab icon of PlanStack to SP icon

export default PlanStack;