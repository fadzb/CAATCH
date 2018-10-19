import React from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, Linking, FlatList, Alert } from 'react-native';
import { CustomSelectionRow } from '../../Components/CustomSelectionRow';
import { Icons } from '../../Constants/Icon';
import { TabStyles } from '../../Styles/TabStyles';
import { connect } from 'react-redux';
import store from '../../Redux/store';

class StatSelection extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'My Stats',
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <View style={{ alignSelf: 'stretch' }}>
          <CustomSelectionRow
            name="Charts - Feelings"
            icon={Icons.charts + '-outline'}
            iconSize={Dimensions.get('window').height / 20}
            iconContainer={statSelectionStyle.iconContainer}
            onPress={() => this.props.navigation.push('victory')}
            containerStyle={{ flex: 0, height: Dimensions.get('window').height / 11 }}
          />
          {this.props.settings.dbt && (
            <CustomSelectionRow
              name="Charts - DBT Skills"
              icon={Icons.charts + '-outline'}
              iconSize={30}
              iconContainer={statSelectionStyle.iconContainer}
              onPress={() => this.props.navigation.push('vicSkills')}
              containerStyle={{ flex: 0, height: Dimensions.get('window').height / 11 }}
            />
          )}
          <CustomSelectionRow
            name="App Usage"
            icon={Icons.insights + '-outline'}
            iconSize={Dimensions.get('window').height / 20}
            iconContainer={statSelectionStyle.iconContainer}
            onPress={() => this.props.navigation.push('insights')}
            containerStyle={{ flex: 0, height: Dimensions.get('window').height / 11 }}
          />
        </View>
      </View>
    );
  }
}

const statSelectionStyle = StyleSheet.create({
  iconContainer: {
    width: Dimensions.get('window').height / 20,
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({
  settings: state.setting,
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(StatSelection);
// HOC that re-renders the component automatically every time a particular section of state is updated
