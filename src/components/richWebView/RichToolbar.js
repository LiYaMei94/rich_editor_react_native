import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { actions } from './const';
import PropTypes from 'prop-types';

const defaultActions = [
    actions.insertImage,
    actions.setUnderline,
    actions.setBold,
    actions.setItalic,
    actions.alignLeft,
    actions.alignCenter,
    actions.alignRight,
    actions.heading1,
    actions.heading2,
    actions.heading3,
    actions.heading4,
    actions.heading5,
    actions.insertBulletsList,//无序列表
    actions.insertOrderedList,//有序列表
];

function getDefaultIcon() {
    const texts = {};
    texts[actions.insertImage] = '\ue620';
    texts[actions.setUnderline] = '\ue611';
    texts[actions.setBold] = '\ue720';
    texts[actions.setItalic] = '\ue61a';


    texts[actions.insertBulletsList] = '\ue80c';

    texts[actions.insertOrderedList] = '\ue807';
    texts[actions.alignLeft] = '\ue63d';
    texts[actions.alignCenter] = '\ue65b';
    texts[actions.alignRight] = '\ue63e';

    texts[actions.heading1] = '\ue649';
    texts[actions.heading2] = '\ue64a';
    texts[actions.heading3] = '\ue64b';
    texts[actions.heading4] = '\ue655';
    texts[actions.heading5] = '\ue656';
    return texts;
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
    };

    constructor(props) {
        super(props);
        const actions = this.props.actions ? this.props.actions : defaultActions;
        this.state = {
            editor: undefined,
            selectedItems: [],
            actions,
            data: this.getRows(actions, [])
        };
    }

    //---- new-s -----
    shouldComponentUpdate(nextProps, nextState) {
        let that = this;
        return nextProps.actions !== that.props.actions
            || nextState.editor !== that.state.editor
            || nextState.selectedItems !== that.state.selectedItems
            || nextState.actions !== that.state.actions
    }
    //---- new-e-----

    // componentDidReceiveProps(newProps) {
    UNSAFE_componentWillReceiveProps(newProps) {
        const actions = newProps.actions ? newProps.actions : defaultActions;
        this.setState({
            actions,
            data: this.getRows(actions, this.state.selectedItems)
        });
    }

    getRows(actions, selectedItems) {
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
        if (selectedItems !== this.state.selectedItems) {
            this.setState({
                selectedItems,
                data: this.getRows(this.state.actions, selectedItems)
            });
        }
    }

    _getButtonIcon(action) {
        if (this.props.iconMap && this.props.iconMap[action]) {
            return this.props.iconMap[action];
        } else if (getDefaultIcon()[action]) {
            return getDefaultIcon()[action];
        } else {
            return undefined;
        }
    }

    _getButtonEle(action, selected, icon) {
        return this.props.renderActionEle ?
            this.props.renderActionEle(action, selected) :
            icon ? <Text style={[styles.editorIconfont, { color: selected ? this.props.selectedIconTint : this.props.iconTint }]}>{icon}</Text> : null;
    }
    _defaultRenderAction(action, selected) {
        const icon = this._getButtonIcon(action);
        console.log(action)
        return (
            <TouchableOpacity
                key={action}
                style={[
                    styles.editorIconfontContainer,
                ]}
                onPress={() => this._onPress(action)}
            >
                {this._getButtonEle(action, selected, icon)}
            </TouchableOpacity>
        );
    }
    _renderAction(action, selected) {
        return this.props.renderAction ?
            this.props.renderAction(action, selected) :
            this._defaultRenderAction(action, selected);
    }

    _onPressAddImage(){
        let that=this;
        if (that.props.onPressAddImage) {
            that.props.onPressAddImage().then((res)=>{
                let src=`data:${res.mime};base64,`+ res.data;
                //console.log(res)
                that.state.editor.insertImage(src);
            })
        }
    }
    
    render() {
        return (
            <View
                style={[{ height: 50, backgroundColor: '#D3D3D3', alignItems: 'center' }, this.props.style]}
            >
                <FlatList
                    horizontal
                    keyExtractor={(item, index) => item.action + '-' + index}
                    data={this.state.data}
                    alwaysBounceHorizontal={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => this._renderAction(item.action, item.selected)}
                />
            </View>
        );
    }

    _onPress(action) {
        switch (action) {
            case actions.setBold:
            case actions.setItalic:
            case actions.insertBulletsList:
            case actions.insertOrderedList:
            case actions.setUnderline:
            case actions.heading1:
            case actions.heading2:
            case actions.heading3:
            case actions.heading4:
            case actions.heading5:
            case actions.heading6:
            case actions.setParagraph:
            case actions.removeFormat:
            case actions.alignLeft:
            case actions.alignCenter:
            case actions.alignRight:
            case actions.alignFull:
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
            //case actions.setTextColor:

        }
    }
}

const styles = StyleSheet.create({
    editorIconfontContainer: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: "center"
    },
    editorIconfont: {
        fontFamily: "iconfont",
        fontSize: 24
    }
});
