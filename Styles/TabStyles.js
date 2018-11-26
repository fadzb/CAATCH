import { StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';

// globally shared TabStyles

export const TabStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: Constants.statusBarHeight
    },

    stackContainer: {
        flex: 1,
        alignItems: 'center'
    },
    // for screens that already have default header bar

    planContainer: {
        flex: 1,
    },
});

export const ComponentStyleConst = {
    //diaryDatePickerIconColor: '#2E9797'
    diaryDatePickerIconColor: '#333333',
    headerRightIconColor: 'white',
    safetyPlanIconColor: '#2E9797'
};

export const Tiles = {
    //iconColor: '#31548B',
    //iconColor: 'white',
    iconColor: '#2E9797',
};

export const Stacks = {
    navigationOptions: {
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#31548B',
            //backgroundColor: '#275DAD',
            //backgroundColor: '#1A936F'
        },
        headerTitleStyle: {
            color: 'white',
            ...Platform.select({
                ios: {
                    //fontFamily: 'normal',
                },
                android: {
                    //fontFamily: 'Roboto',
                },
            }),
        },
        headerBackTitle: null,
        headerBackTitleStyle: {
            color: 'white'
        },
    },
    cardStyle: {
        //backgroundColor: "#EEF1FE",
        backgroundColor: "white",
        //backgroundColor: '#F2F3F4'
        //backgroundColor: '#ABB2BC'
    }
};

export const themeStyles = StyleSheet.create({
    headerRightText: {
        color: 'white'
    },
    tiles: {
        backgroundColor: 'white',
        //backgroundColor: '#31548B',
        borderWidth: 1,
        //borderColor: '#C7D4EA',
        borderColor: '#2E9797',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
            },
            android: {
                elevation: 7
            },
        }),
    },
    tileFont: {
        color: '#31548B',
        //color: 'white',
        //fontWeight: 'bold',
        ...Platform.select({
            ios: {
                //fontFamily: 'normal',
            },
            android: {
                //fontFamily: 'Roboto',
            },
        }),
    },
    diaryDatePicker: {
        backgroundColor: 'white',
        borderWidth: 1,
        //borderColor: '#C7D4EA',
        borderColor: '#2E9797',
    },
    diaryDatePickerText: {
        color: '#333333',
        //color: '#2E9797',
    },
    planScreenTextContainer: {
        borderColor: '#2E9797'
    },
    planScreenText: {
        color: '#31548B'
    },
    homeCrisisViewContainer: {
        //backgroundColor: '#294572',
        //backgroundColor: '#31548B',
        backgroundColor: '#D5E3F8'
        //backgroundColor: 'white',
    }
});