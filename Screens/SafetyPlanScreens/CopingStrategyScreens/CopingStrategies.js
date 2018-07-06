import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { readDatabase } from "../../../Util/DatabaseHelper";
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow'
import {connect} from 'react-redux'
import {getCoping} from "../../../Redux/actions";
import store from "../../../Redux/store"

class CopingStrategies extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Coping Strategies",
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.push('newCoping')}
                ><Text style={{ padding: 10 }}>New +</Text>
                </TouchableOpacity>
            ),
        }
    };
    // Implementation for 'new' strategy button

    componentDidMount() {
        readDatabase("*", "CopingStrategy", this.updateStrategies)
    }

    updateStrategies = (strats) => {
        const strategies = strats.map(s => s.copeName);

        store.dispatch(getCoping(strategies));
        // dispatching total list of coping strategy names from DB to global redux store
    };

    render() {
        return (
            <View style={stratStyle.viewContainer}>
                <FlatList
                    data={this.props.coping} // comes from mapStateToProps below
                    renderItem={({item}) => <View style={stratStyle.listContainer}>
                        <SafetyPlanSectionRow
                            name= {item}
                        />
                    </View>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const stratStyle = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        flex: 1,
        alignSelf: 'stretch'
    }
});

const mapStateToProps = state => ({
    coping: state.coping
});
// function passed into connect HOC below. Allows us to map section of redux state to props that we pass into our component

export default connect(mapStateToProps)(CopingStrategies)
// HOC that re-renders the component automatically every time a particular section of state is updated