<!--
 * @Descripttion: 
 * @version: 
 * @Author: liyamei
 * @Date: 2019-11-13 18:40:00
 * @LastEditors: liyamei
 * @LastEditTime: 2019-11-13 18:56:50
 -->
# 富文本编辑器demo（react-native）
## 使用

### 安装依赖

```JavaScript
yarn add react-native-syan-image-picker//图片选择
yarn add react-native-webview//和h5交互
```

### 放入字体
在项目`android/app/src/main/assets/fonts`目录下放入你的字体图标，同时修改项目根目录`src/components/richWebView/`下的`RichToolbar.js`文件，修改内容如下

```JavaScript
editorIconfont: {
   fontFamily: "你的字体文件名",
    fontSize: 24
},
```

## 参数

属性     | 类型|默认值     | 描述
-------- | -----| -----| -----
电脑  | $1600| $1600| $1600
手机  | $12 | $12 | $12
导管  | $1| $1| $1
## 效果图
![效果图](src/assets/images/1573641462949.gif)
