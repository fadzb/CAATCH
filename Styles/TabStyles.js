import { StyleSheet } from 'react-native';
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
