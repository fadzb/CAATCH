import React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Icons} from "../../Constants/Icon";

import PlanScreen from "../../Screens/SafetyPlanScreens/PlanScreen";
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
import EditContact from "../../Screens/SafetyPlanScreens/ContactScreens/EditContact";
import EditCopingStrategy from "../../Screens/SafetyPlanScreens/CopingStrategyScreens/EditCopingStrategy";
import EditDistraction from "../../Screens/SafetyPlanScreens/DistractionScreens/EditDistraction";
import EditReason from "../../Screens/SafetyPlanScreens/ReasonScreens/EditReason";
import EditWarningSign from "../../Screens/SafetyPlanScreens/WarningSignScreens/EditWarningSign";
import DistractionSelection from "../../Screens/SafetyPlanScreens/DistractionScreens/DistractionSelection";
import RandomSkill from "../../Screens/SafetyPlanScreens/DistractionScreens/RandomSkill";
import PrePopWarningSigns from "../../Screens/SafetyPlanScreens/WarningSignScreens/PrePopWarningSigns";
import {SectionHeader} from "../../Constants/Constants";
import Helper from "../../Screens/SafetyPlanScreens/HelperScreens/Helper";
import NewHelper from "../../Screens/SafetyPlanScreens/HelperScreens/NewHelper";
import ContactList from "../../Screens/SafetyPlanScreens/HelperScreens/ContactList";
import HelperSummary from "../../Screens/SafetyPlanScreens/HelperScreens/HelperSummary";
import EditHelper from "../../Screens/SafetyPlanScreens/HelperScreens/EditHelper";
import {Stacks, themeStyles} from "../../Styles/TabStyles";

const PlanStack = createStackNavigator(
    {
        main: PlanScreen,
        warning: WarningSigns,
        newWarning: NewWarningSign,
        editWarning: EditWarningSign,
        prePopSign: PrePopWarningSigns,
        copingLink: CopingStrategyLink,
        signSummary: SignSummary,
        coping: CopingStrategies,
        newCoping: NewCopingStrategy,
        editCoping: EditCopingStrategy,
        prePopCope: PrePopCopingStrategies,
        stratSummary: StrategySummary,
        planWeb: PlanWebView,
        reason: ReasonsToLive,
        newReason: NewReason,
        editReason: EditReason,
        reasonSummary: ReasonSummary,
        selectDistraction: DistractionSelection,
        randomSkill: RandomSkill,
        distraction: Distractions,
        newDistraction: NewDistraction,
        editDistraction: EditDistraction,
        prePopDistraction: PrePopDistraction,
        distractionSummary: DistractionSummary,
        contactLink: DistractContactLink,
        contact: Contacts,
        newContact: NewContact,
        editContact: EditContact,
        phoneContacts: PhoneContacts,
        contactSummary: ContactSummary,
        environment: EnvironmentSafe,
        helper: Helper,
        newHelper: NewHelper,
        contactList: ContactList,
        helperSummary: HelperSummary,
        editHelper: EditHelper
    },

    {
        initialRouteName: "main",
        ...Stacks
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
    title: SectionHeader.shortPlan
};
// setting tab icon of PlanStack to SP icon

export default PlanStack;