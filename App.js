/*
 * @Author: your name
 * @Date: 2019-11-04 11:48:35
 * @LastEditTime: 2019-11-11 18:53:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react_native_appc:\Users\123\Desktop\top_ten\src\HomePage\html.js
 */
import React from 'react';
import {
    Button,
    LayoutAnimation,
    UIManager,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    Keyboard,
    Image,
    TextInput
} from 'react-native';
import { actions } from './src/components/richWebView/const';
import RichEditor from './src/components/richWebView/RichEditor';
import RichToolbar from './src/components/richWebView/RichToolbar';
import ImagePicker from 'react-native-image-crop-picker';
let initHTML = ``;

const spring = {
    duration: 500,
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.8,
    },
    delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
};
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
export default class App extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    
    /**
     *上传图片
     *
     * @memberof RichToolbar
     */
    _onPressAddImage(){
        
        return new Promise((resolve,reject) => {
            ImagePicker.openPicker({
                multiple: false,//启用多张图片
                includeBase64: true,
                cropping: true,//启用剪裁
                width: 400,
                height: 400,
            }).then(image => {
                resolve(image);
            }).catch(error=>{reject(error);});
        })
    }
    
    render() {
        const {RichEditorHeight}=this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <RichEditor
                        height={RichEditorHeight}
                        ref={rf => this.richText = rf}
                        initialContentHTML={initHTML}
                    />
                </ScrollView>
                <RichToolbar
                        getEditor={() => this.richText}
                        iconTint={'#666'}
                        selectedIconTint={'#E64448'}
                        onPressAddImage={()=>this._onPressAddImage()}
                    />
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1
    },
    
})