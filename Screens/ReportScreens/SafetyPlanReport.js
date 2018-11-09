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
import { safetyPlanHtml } from '../../Components/HTML';
import { readDatabase, readDatabaseArg } from '../../Util/DatabaseHelper';
import { DbTableNames, SafetyPlanDbTables } from '../../Constants/Constants';

export default class SafetyPlanReport extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: ' SP Report',
      headerRight: (
        <View style={{ paddingRight: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {/*{Platform.OS === 'ios' && <Icon*/}
          {/*name={Icons.share}*/}
          {/*size={30}*/}
          {/*onPress={() => params.handleThis()}*/}
          {/*style={{paddingRight: 15}}*/}
          {/*/>}*/}
          <Icon name={Icons.print + '-outline'} size={30} onPress={() => params.handlePrint()} />
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
      handlePrint: this.print,
    });

    this.getSafetyPlanData();
  }

  getSafetyPlanData = () => {
    Object.keys(SafetyPlanDbTables).forEach((key) => {
      if (key === 'helper') {
        readDatabaseArg(
          'h.*, c.firstName',
          SafetyPlanDbTables[key].tableName,
          (res) => {
            this.setState(
              (prevState) => ({ safetyPlanData: { ...prevState.safetyPlanData, [key]: res } }),
              () => {
                this.setState((prevState) => ({ safetyPlanDataTracker: prevState.safetyPlanDataTracker + 1 }));
              }
            );
          },
          undefined,
          'as h inner join ' + DbTableNames.contact + ' as c on h.contactId = c.contactId'
        );
      } else {
        readDatabase('*', SafetyPlanDbTables[key].tableName, (res) => {
          this.setState(
            (prevState) => ({ safetyPlanData: { ...prevState.safetyPlanData, [key]: res } }),
            () => {
              this.setState((prevState) => ({ safetyPlanDataTracker: prevState.safetyPlanDataTracker + 1 }));
            }
          );
        });
      }
    });
  };

  print = () => {
    Expo.DangerZone.Print.printAsync({
      html: safetyPlanHtml(this.state.safetyPlanData),
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  takeScreenShot = () => {
    Expo.takeSnapshotAsync(this.webView, {
      format: 'png',
      quality: 1,
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
