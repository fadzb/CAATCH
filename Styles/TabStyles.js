import { StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';

// globally shared TabStyles

export const TabStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight
    },

    stackContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    // for screens that already have default header bar

    planContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export const Tiles = {
    //iconColor: 'white',
};

export const themeStyles = StyleSheet.create({
    tiles: {
        backgroundColor: 'white',
        //borderWidth: .5,
        //borderColor: '#F3E9D2',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5
            },
        }),
    },
    tileFont: {
        //color: 'white',
        ...Platform.select({
            ios: {
                //fontFamily: 'normal',
            },
            android: {
                //fontFamily: 'Roboto',
            },
        }),
    },
    background: {
        //backgroundColor: '#114B5F'
    },
    stackHeader: {
        backgroundColor: '#1A936F'
    },
    stackHeaderTitleFont: {
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
    diaryDatePicker: {
        backgroundColor: 'white',
    },
    diaryDatePickerText: {

    },

});