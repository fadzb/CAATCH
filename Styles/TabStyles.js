import { StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';

// globally shared TabStyles

export const AppColors = {
  orange: '#F09100',
  blue: '#31548B',
  grey: '#333333',
  white: 'white',
};

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
  diaryDatePickerIconColor: AppColors.grey,
  headerRightIconColor: AppColors.white,
  safetyPlanIconColor: AppColors.orange,
  settingsIconColor: AppColors.orange,
  bottomTabBarTint: AppColors.orange,
};

export const Tiles = {
  iconColor: AppColors.orange,
};

export const Stacks = {
  navigationOptions: {
    headerTintColor: AppColors.white,
    headerStyle: {
      backgroundColor: AppColors.blue,
    },
    headerTitleStyle: {
      color: AppColors.white,
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
      color: AppColors.white,
    },
  },
  cardStyle: {
    backgroundColor: AppColors.white,
  },
};

export const themeStyles = StyleSheet.create({
  headerRightText: {
    color: AppColors.white,
  },
  tiles: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.orange,
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
    color: AppColors.blue,
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
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.orange,
  },
  diaryDatePickerText: {
    color: AppColors.grey,
  },
  planScreenTextContainer: {
    borderColor: AppColors.orange,
  },
  planScreenText: {
    color: AppColors.blue,
  },
  settingsScreenText: {
    color: AppColors.blue,
  },
  settingsButtons: {
    borderBottomWidth: 0.5,
    borderColor: AppColors.orange,
  },
  homeCrisisViewContainer: {
    backgroundColor: AppColors.blue,
  },
  homeScreenImage: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: AppColors.orange,
    opacity: 0.9,
  },
  planFormSaveButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
  },
  planFormSaveButton: {
    height: 36,
    backgroundColor: AppColors.orange,
    borderColor: AppColors.orange,
    borderWidth: 1,
    borderRadius: 8,
  },
  multiSelectSaveButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
  },
  multiSelectSaveButton: {
    height: 36,
    backgroundColor: AppColors.orange,
    borderColor: AppColors.orange,
    borderWidth: 1,
    borderRadius: 8,
  },
});
