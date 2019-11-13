/*
 * @Descripttion: 
 * @version: 
 * @Author: liyamei
 * @Date: 2019-11-11 18:38:12
 * @LastEditors: liyamei
 * @LastEditTime: 2019-11-13 14:22:58
 */


import React from 'react';
import {
    StyleSheet,
    YellowBox
} from 'react-native';
import Editor from './src/pages/editor/html';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        YellowBox.ignoreWarnings([
            'Warning: componentWillMount is deprecated',
            'Warning: componentWillReceiveProps is deprecated',
            'Warning: componentWillMount has been renamed',
            'Warning: componentWillReceiveProps has been renamed',
        ]);
    }


    render() {
        return <Editor></Editor>
    }
}


