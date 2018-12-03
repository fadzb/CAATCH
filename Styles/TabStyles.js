import { StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';

// globally shared TabStyles

export const TabStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Constants.statusBarHeight,
  },

  stackContainer: {
    flex: 1,
    alignItems: 'center',
  },
  // for screens that already have default header bar

  planContainer: {
    flex: 1,
  },
});

export const ComponentStyleConst = {
  diaryDatePickerIconColor: '#333333',
  headerRightIconColor: 'white',
  safetyPlanIconColor: '#F09100',
  settingsIconColor: '#F09100',
  bottomTabBarTint: '#F09100',
};

export const Tiles = {
  iconColor: '#F09100',
};

export const Stacks = {
  navigationOptions: {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#31548B',
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
      color: 'white',
    },
  },
  cardStyle: {
    backgroundColor: 'white',
  },
};

export const themeStyles = StyleSheet.create({
  headerRightText: {
    color: 'white',
  },
  tiles: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F09100',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  tileFont: {
    color: '#31548B',
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
    borderColor: '#F09100',
  },
  diaryDatePickerText: {
    color: '#333333',
  },
  planScreenTextContainer: {
    borderColor: '#F09100',
  },
  planScreenText: {
    color: '#31548B',
  },
  settingsScreenText: {
    color: '#31548B',
  },
  homeCrisisViewContainer: {
    backgroundColor: '#31548B',
  },
  homeScreenImage: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#F09100',
    opacity: 0.9,
  },
});
