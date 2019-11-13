/*
 * @Descripttion: 编辑器工具栏
 * @version: 
 * @Author: liyamei
 * @Date: 2019-11-11 18:46:15
 * @LastEditors: liyamei
 * @LastEditTime: 2019-11-13 17:59:20
 */

import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { actions } from './const';
import PropTypes from 'prop-types';


const ScreenWidth = Dimensions.get("window").width;
const defaultActions = [
    actions.fontColor,
    actions.fontSize,
    actions.insertImage,//图片
    actions.setUnderline,//下划线
    actions.setBold,//加粗
    actions.setItalic,//斜线
    actions.textAlign,
    actions.heading,
    actions.insertBulletsList,//无序列表
    actions.insertOrderedList,//有序列表

];

function getDefaultIcon() {
    const texts = {};
    texts[actions.fontColor] = '\ue6df';
    texts[actions.fontSize] = '\ue65c';
    texts[actions.insertImage] = '\ue620';
    texts[actions.setUnderline] = '\ue611';
    texts[actions.setBold] = '\ue720';
    texts[actions.setItalic] = '\ue61a';
    texts[actions.textAlign] = '\ue63d';
    texts[actions.heading] = '\ue65d';
    texts[actions.insertBulletsList] = '\ue80c';
    texts[actions.insertOrderedList] = '\ue807';

    return texts;
}

const textAlignObj={
    justifyLeft:'\ue63d',
    justifyCenter:'\ue65b',
    justifyRight:'\ue63e'
}
export default class RichToolbar extends Component {

    static propTypes = {
        getEditor: PropTypes.func.isRequired,//编辑器
        actions: PropTypes.array,//操作栏
        onPressAddImage: PropTypes.func,//上传图片
        iconTint: PropTypes.any,//没选中的图标颜色
        selectedIconTint: PropTypes.any,//选中的图标颜色
        renderAction: PropTypes.func,//图标列表
        iconMap: PropTypes.object,
        fontColorArr: PropTypes.array,//字体颜色的数组
        fontSizeArr: PropTypes.array,//字体大小的数组
        headingArr:PropTypes.array,//标题数组
        textAlign:PropTypes.array,
        toolBarBackgroundColor: PropTypes.string//工具栏背景颜色
    };

    static defaultProps = {
        iconTint: '#666',
        selectedIconTint: '#E64448',
        toolBarBackgroundColor: '#E9E9E9',
        fontColorArr: ['black', 'red', 'yellow', 'pink', 'skyblue'],
        fontSizeArr: [1, 2, 3, 4, 5, 6, 7],
        headingArr:['h1','h2','h3','h4','h5'],
        textAlign:[
            {
                icon:'\ue63d',
                type:'justifyLeft'
            },
            {
                icon:'\ue65b',
                type:'justifyCenter'
            },
            {
                icon:'\ue63e',
                type:'justifyRight'
            },
        ]

    }
    constructor(props) {
        super(props);
        const actions = this.props.actions ? this.props.actions : defaultActions;
        this.state = {
            editor: undefined,
            selectedItems: [],
            actions,
            data: this.getRows(actions, []),
            selectFontColor: props.iconTint,//字体颜色选中的颜色值
            selectFontSize: 0,//字体颜色选中的颜色值
            selectToolName: '',
            selectHeading:'',//标题选中的值
            selectTextAlign:''
        };
    }

    


    UNSAFE_componentWillReceiveProps(newProps) {
        const actions = newProps.actions ? newProps.actions : defaultActions;
        this.setState({
            actions,
            data: this.getRows(actions, this.state.selectedItems)
        });
    }

    getRows(actions, selectedItems) {
        //console.log(selectedItems)
        return actions.map((action) => { return { action, selected: selectedItems.includes(action) }; });
    }

    componentDidMount() {
        const editor = this.props.getEditor();
        if (!editor) {
            throw new Error('Toolbar has no editor!');
        } else {
            editor.registerToolbar((selectedItems) => this.setSelectedItems(selectedItems));
            this.setState({ editor });
        }
    }

    setSelectedItems(selectedItems) {
        //console.log(selectedItems)
        if (selectedItems !== this.state.selectedItems) {
            this.setState({
                selectedItems,
                data: this.getRows(this.state.actions, selectedItems)
            });
        }
    }

    /**
     *获取图标
     *
     * @param {*} action
     * @returns
     * @memberof RichToolbar
     */
    _getButtonIcon(action) {
        if (this.props.iconMap && this.props.iconMap[action]) {
            return this.props.iconMap[action];
        } else if (getDefaultIcon()[action]) {
            return getDefaultIcon()[action];
        } else {
            return undefined;
        }
    }

    /**
     *渲染图标
     *
     * @param {*} action
     * @param {*} selected
     * @param {*} icon
     * @returns
     * @memberof RichToolbar
     */
    _getButtonEle(action, selected, icon) {
        const { selectFontColor } = this.state;
        //console.log(selectFontColor)
        return this.props.renderActionEle ?
            this.props.renderActionEle(action, selected) :
            icon ? <Text
                style={[styles.editorIconfont,
                action != 'fontColor' ? { color: selected ? this.props.selectedIconTint : this.props.iconTint }
                    : { color: selectFontColor }
                ]}
            >{icon}</Text> : null;
    }

    /**
     *
     *弹出的气泡框内容的按压事件
     * @param {*} action
     * @param {*} selected
     * @param {*} item
     * @param {*} index
     * @memberof RichToolbar
     */
    _modalActionPress(selectToolName,item,index){
        let {selectFontColor,selectFontSize,selectHeading,selectTextAlign}=this.state;
        if(selectToolName=='fontColor'){
            selectFontColor=item;
        }else if(selectToolName=='fontSize'){
            selectFontSize=item;
        }else if(selectToolName=='heading'){
            selectHeading=item;
        }else if(selectToolName=='textAlign'){
            selectTextAlign=item.type;
            selectToolName=item.type;
        }
        //console.log(selectToolName)
        //console.log(item)
        this.setState({
            selectFontColor:selectFontColor,
            selectFontSize:selectFontSize,
            selectHeading:selectHeading,
            selectTextAlign:selectTextAlign
        },()=>{
            //console.log(selectTextAlign)
            this.state.editor._sendAction(selectToolName, 'result',item);
        })
    }
    /**
     *弹出的气泡渲染
     *
     * @param {*} action
     * @param {*} selected
     * @returns
     * @memberof RichToolbar
     */
    _modalRenderAction() {
        const { selectFontSize,selectToolName,selectHeading,selectTextAlign } = this.state;
        let tempArr = selectToolName == 'fontColor' ? 
                        this.props.fontColorArr : 
                        selectToolName == 'fontSize' ? this.props.fontSizeArr  : 
                        selectToolName=='heading'?this.props.headingArr:
                        selectToolName=='textAlign'?this.props.textAlign:[];
        //console.log('selectToolName==='+selectToolName)
        //console.log('selectTextAlign==='+selectTextAlign)
        return (
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                {
                    tempArr.length != 0 ?
                    tempArr.map((item, index) => {
                        return (
                            <TouchableOpacity key={index}
                                onPress={() => this._modalActionPress(selectToolName,item,index)}
                                style={[styles.toolBarModalItem, {
                                    backgroundColor: selectToolName == 'fontColor' ? item : '#fff',
                                }]}>
                                {
                                    selectToolName == 'fontSize'||selectToolName == 'heading' ? 
                                    <Text style={{ fontSize: 17, color: selectFontSize==item||selectHeading==item?this.props.selectedIconTint : this.props.iconTint }}>{item}</Text> : null
                                }
                                {
                                    selectToolName=='textAlign'?
                                    <Text style={{ fontSize: 22, color: selectTextAlign==item.type||selectHeading==item?this.props.selectedIconTint : this.props.iconTint,fontFamily:"iconfont" }}>
                                    {item.icon}</Text>:null
                                }
                            </TouchableOpacity>
                        )
                    }) : null
                }
            </View>
        )
    }
    /**
     *默认的工具栏标签渲染
     *
     * @param {*} action
     * @param {*} selected
     * @returns
     * @memberof RichToolbar
     */
    _defaultRenderAction(action, selected, index) {
        const icon = this._getButtonIcon(action);
        const { toolBarBackgroundColor } = this.props;
        const { selectToolName } = this.state;
        return (
            <View style={styles.toolBarContainer}>
                <TouchableOpacity
                    key={action}
                    style={[
                        styles.editorIconfontContainer,
                        { backgroundColor: selectToolName == action ? '#fff' : toolBarBackgroundColor }
                    ]}
                    onPress={() => {
                        this.setState({
                            selectToolName: action
                        })
                        this._onPress(action);
                    }}
                >
                    {
                        this._getButtonEle(action, selected, icon)
                    }
                </TouchableOpacity>
            </View>
        );
    }

    /**
     *
     *工具栏标签的渲染
     * @param {*} action
     * @param {*} selected
     * @returns
     * @memberof RichToolbar
     */
    _renderAction(item) {
        let { item: { action, selected }, index } = item;
        return this.props.renderAction ?
            this.props.renderAction(action, selected, index) :
            this._defaultRenderAction(action, selected, index);
    }

    /**
     *上传图片
     *
     * @memberof RichToolbar
     */
    _onPressAddImage() {
        let that = this;
        if (that.props.onPressAddImage) {
            that.props.onPressAddImage().then((res) => {
                let src = res[0].base64;
                //console.log(src)
                that.state.editor.insertImage(src);
            })
        }
    }

    render() {
        const { toolBarBackgroundColor } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.toolBarModal}>
                    {this._modalRenderAction()}
                </View>
                <View style={[styles.toolBarContainer, { backgroundColor: toolBarBackgroundColor }]}>
                    <FlatList
                        horizontal
                        keyExtractor={(item, index) => item.action + '-' + index}
                        data={this.state.data}
                        alwaysBounceHorizontal={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this._renderAction.bind(this)}
                    />
                </View>
            </View>
        );
    }

    /**
     *
     *工具栏中每个标签的按压事件
     *
     * @param {*} action
     * @memberof RichToolbar
     */
    _onPress(action) {
        switch (action) {
            case actions.setBold:
            case actions.setItalic:
            case actions.insertBulletsList:
            case actions.insertOrderedList:
            case actions.setUnderline:
            case actions.setParagraph:
            case actions.setSubscript:
            case actions.setSuperscript:
            case actions.setStrikethrough:
            case actions.setIndent:
            case actions.setOutdent:
                this.state.editor._sendAction(action, "result");
                break;
            case actions.insertImage:
                this._onPressAddImage();
                break;

        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        position:"absolute",
        bottom:0
    },
    toolBarContainer: {
        height: 50,
    },
    editorIconfontContainer: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#D3D3D3',
    },
    editorIconfont: {
        fontFamily: "iconfont",
        fontSize: 24
    },
    toolBarModal: {
        borderTopColor: '#eee',
        borderTopWidth: 1,
        width: ScreenWidth,
    },
    toolBarModalItem:{
        width:25,
        height:25,
        borderRadius:50,
        justifyContent:"center",
        alignItems:"center",
        marginRight:17,
        marginTop:20,
        marginBottom:20
    }
});
