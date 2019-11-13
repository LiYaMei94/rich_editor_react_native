/*
 * @Author: your name
 * @Date: 2019-11-04 11:54:44
 * @LastEditTime: 2019-11-06 19:20:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react_native_appc:\Users\123\Desktop\top_ten\src\assets\css\common.js
 */


import React, { Component } from 'react';
import { StatusBar, Platform, Dimensions } from "react-native";
//判断手机设备
// iPhone X、iPhone XS
const X_WIDTH = 375;
const X_HEIGHT = 812;

// iPhone XR、iPhone XS Max
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const DEVICE_SIZE = Dimensions.get('window');
const { height: D_HEIGHT, width: D_WIDTH } = DEVICE_SIZE;

export const isiOS = () => Platform.OS === 'ios'

export const isiPhoneX = () => {
    return (
        isiOS() &&
        ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
            (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)) ||
        ((D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
            (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT))
    );
};

//获取状态栏的高度
export const STATUS_BAR_HEIGHT = isiOS() ? (isiPhoneX() ? 34 : 20) : StatusBar.currentHeight;

export const headerHeight = STATUS_BAR_HEIGHT + 44;//标题栏的高度
export const headerPaddingTop = STATUS_BAR_HEIGHT;//标题栏的paddingtop
export const headerRightMarginRight = 15;//标题栏右边按钮距边界的距离


export const Size = Dimensions.get('window');
export const ScreenWidth = Size.width;
export const ScreenHeight = Size.height;


export const borderColor = '#EEEDEB';//边框颜色

export const greyBG = '#F3F3F3';//灰色背景

export const themeColor = '#4f77e6';//主题色

export const RightArrowIcon='\ue770';//右边箭头

export const headerStyle={//标题栏样式
    height: headerHeight,
    paddingTop: headerPaddingTop,
    elevation: 0,  // android去除阴影
    backgroundColor:"#fff",
    borderBottomWidth:1,
    borderBottomColor:borderColor
}

export const headerTitleStyle={//标题栏标题样式
    fontWeight: 'normal',
    fontSize:15
}

export const headerTintColor='#666';//标题栏标题颜色

export const tabBarOptions={//底部导航栏样式
    activeTintColor: '#333',
    inactiveTintColor: '#999',
    style: {
        backgroundColor: '#fff',
        borderTopColor: borderColor
    },
}
