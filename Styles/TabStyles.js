import { StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';

// globally shared TabStyles

export const TabStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: Constants.statusBarHeight,
  },

  stackContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  // for screens that already have default header bar

  planContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export const ComponentStyleConst = {
  //diaryDatePickerIconColor: '#2E9797'
  diaryDatePickerIconColor: '#333333',
};

export const Tiles = {
  iconColor: '#333333',
  //iconColor: 'white',
};

export const Stacks = {
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#31548B',
    //backgroundColor: '#7E57C2'
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
};

export const themeStyles = StyleSheet.create({
  tiles: {
    backgroundColor: 'white',
    //backgroundColor: '#31548B',
    borderWidth: 1,
    //borderColor: '#C7D4EA',
    borderColor: '#2E9797',
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
    color: '#333333',
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
  background: {
    //backgroundColor: '#F8FAFF'
    backgroundColor: '#EEF1FE',
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
});
