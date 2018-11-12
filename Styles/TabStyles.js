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

export const themeStyles = StyleSheet.create({
  tiles: {
    backgroundColor: '#F3E9D2',
  },
  tileFont: {
    ...Platform.select({
      ios: {
        //fontFamily: 'normal',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  background: {
    //backgroundColor: '#114B5F'
  },
  stackHeader: {
    backgroundColor: '#1A936F',
  },
  stackHeaderTitleFont: {
    color: 'white',
    ...Platform.select({
      ios: {
        //fontFamily: 'normal',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
});
