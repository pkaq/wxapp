import { createStackNavigator } from 'react-navigation';

import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
    createNavigationReducer,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import React from 'react';
import Home from './src/container/Home';

const AppNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            headerTitle:'股票补仓成本计算',
            headerRight: null,
            headerLeft: null,
            headerBackTitle:null,   
            headerTintColor: '#FFF', 
            headerTitleStyle: {
                flex: 1,
                textAlign:'center'
            },
            headerStyle: {
                backgroundColor: '#D71D05',
            }
        }
    },
});

export const routerReducer = createNavigationReducer(AppNavigator);

export const routerMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.router,
);

const App = reduxifyNavigator(AppNavigator, 'root');
const mapStateToProps = (state) => ({
    state: state.router,
});
const AppWithNavigationState = connect(mapStateToProps)(App);

export default class Root extends React.Component {
    render() {
        return (
            <AppWithNavigationState />
        );
    }
}