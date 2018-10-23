import React from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity,
  Share,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';
import { safetyPlanHtml } from './HTML';
import { readDatabase } from '../../Util/DatabaseHelper';
import { SafetyPlanDbTables } from '../../Constants/Constants';

export default class SafetyPlanReport extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Report',
      headerRight: (
        <View style={{ paddingRight: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={Icons.share} size={30} onPress={() => params.handleThis()} style={{ paddingRight: 15 }} />
          <Icon
            name={Icons.print + '-outline'}
            size={30}
            onPress={() => {
              Expo.DangerZone.Print.printAsync({
                html: safetyPlanHtml,
              })
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            }}
          />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      safetyPlanDataTracker: 0,
      safetyPlanData: {},
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.takeScreenShot,
    });

    this.getSafetyPlanData();
  }

  getSafetyPlanData = () => {
    Object.keys(SafetyPlanDbTables).forEach((key) => {
      readDatabase('*', SafetyPlanDbTables[key].tableName, (res) => {
        this.setState(
          (prevState) => ({ safetyPlanData: { ...prevState.safetyPlanData, [key]: res } }),
          () => {
            this.setState((prevState) => ({ safetyPlanDataTracker: prevState.safetyPlanDataTracker + 1 }));
          }
        );
      });
    });
  };

  takeScreenShot = () => {
    Expo.takeSnapshotAsync(this.webView, {
      format: 'jpg',
      quality: 0.4,
      result: 'file',
    }).then((res) => {
      Share.share(
        {
          ...Platform.select({
            ios: {
              message: 'Have a look on : ',
              url: res,
            },
            android: {
              message: 'Have a look on : \n' + res,
            },
          }),
          title: 'Wow, did you see that?',
        },
        {
          ...Platform.select({
            android: {
              // Android only:
              dialogTitle: 'Share : ',
            },
          }),
        }
      )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
  };

  render() {
    return (
      <View collapsable={false} style={{ flex: 1 }} ref={(ref) => (this.webView = ref)}>
        {this.state.safetyPlanDataTracker === Object.keys(SafetyPlanDbTables).length ? (
          <WebView originWhitelist={['*']} source={{ html: safetyPlanHtml(this.state.safetyPlanData) }} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
    );
  }
}

const spReportStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});
