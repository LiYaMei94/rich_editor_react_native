/*
 * @Descripttion: 使用编辑器
 * @version: 
 * @Author: liyamei
 * @Date: 2019-11-12 17:05:53
 * @LastEditors: liyamei
 * @LastEditTime: 2019-11-14 11:22:15
 */
import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import { actions } from '../../components/richWebView/const';
import RichEditor from '../../components/richWebView/RichEditor';
import RichToolbar from '../../components/richWebView/RichToolbar';
import ImagePicker from 'react-native-syan-image-picker';
import {STATUS_BAR_HEIGHT,ScreenHeight} from '../../assets/css/common';
const options = {
    imageCount: 1,//最大选择图片数目
    isRecordSelected: true,//记录当前已选中的图片
    isCamera: false,//是否允许用户在内部拍照
    isCrop: false,//是否允许裁剪，imageCount 为1才生效
    enableBase64: true
};
export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    /**
     *
     *上传图片
     * @returns
     * @memberof Editor
     */
    _onPressAddImage() {
        return new Promise((resolve, reject) => {
            ImagePicker.asyncShowImagePicker(options)
                .then(photos => {
                    resolve(photos);
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <RichEditor
                        height={ScreenHeight-90}
                        ref={ref => this.richText = ref}
                        editorInitializedCallback={()=>{
                            this.richText.focusContentEditor();
                        }}
                    />
                </ScrollView>
                <RichToolbar
                        getEditor={() => this.richText}
                        onPressAddImage={() => this._onPressAddImage()}
                    />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})