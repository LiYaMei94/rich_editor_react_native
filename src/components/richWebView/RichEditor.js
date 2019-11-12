import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {actions, messages} from './const';
import {Dimensions, PixelRatio, Platform, StyleSheet, View} from 'react-native';
import {HTML} from './editor';
import PropTypes from 'prop-types';
const PlatformIOS = Platform.OS === 'ios';

export default class RichTextEditor extends Component {
    static propTypes = {
        initialContentHTML: PropTypes.string,
        editorInitializedCallback: PropTypes.func,
    };

    static defaultProps = {
        contentInset: {},
        style: {}
    };

    constructor(props) {
        super(props);
        this._sendAction = this._sendAction.bind(this);
        this.registerToolbar = this.registerToolbar.bind(this);
        this.isInit = false;
        this.state = {
            selectionChangeListeners: [],
            height: 0,
        };
        this.focusListeners = [];
    }

    onMessage = (event) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            switch (message.type) {
                case messages.CONTENT_HTML_RESPONSE:
                    if (this.contentResolve) {
                        this.contentResolve(message.data);
                        this.contentResolve = undefined;
                        this.contentReject = undefined;
                        if (this.pendingContentHtml) {
                            clearTimeout(this.pendingContentHtml);
                            this.pendingContentHtml = undefined;
                        }
                    }
                    break;
                case messages.LOG:
                    console.log('FROM EDIT:', ...message.data);
                    break;
                case messages.SELECTION_CHANGE: {
                    const items = message.data;
                    this.state.selectionChangeListeners.map((listener) => {
                        listener(items);
                    });
                    break;
                }
                case messages.CONTENT_FOCUSED: {
                    this.focusListeners.map(da => da());
                    break;
                }
                case messages.OFFSET_HEIGHT:
                    this.setWebHeight(message.data);
                    break;
            }
        } catch (e) {
            //alert('NON JSON MESSAGE');
        }
    };

    setWebHeight = (height)=>{
        console.log(height);
        if (height !== this.state.height){
            this.setState({height});
        }
    };

    render() {
        let {height,style} = this.props;

        return (
            <View style={[style, {height: height}]}>
                <WebView
                    useWebKit={true}
                    scrollEnabled={false}
                    {...this.props}
                    hideKeyboardAccessoryView={true}
                    keyboardDisplayRequiresUserAction={false}
                    ref={(r) => {
                        this.webviewBridge = r
                    }}
                    onMessage = {this.onMessage}
                    originWhitelist={["*"]}
                    dataDetectorTypes={'none'}
                    domStorageEnabled={false}
                    bounces={false}
                    javaScriptEnabled={true}
                    source={{html: HTML}}
                    onLoad={() => this.init()}
                />
            </View>
        );
    }

    _sendAction(type, action, data) {

        let jsonString = JSON.stringify({type, name: action, data});
        if (this.webviewBridge){
            this.webviewBridge.postMessage(jsonString);
            // console.log(jsonString)
        }
    }

    //-------------------------------------------------------------------------------
    //--------------- Public API

    registerToolbar(listener) {
        this.setState({
            selectionChangeListeners: [...this.state.selectionChangeListeners, listener]
        });
    }

    setContentFocusHandler (listener){
        this.focusListeners.push(listener);
    }

    setContentHTML(html) {
        this._sendAction(actions.content, "setHtml", html);
    }

    

    blurContentEditor() {
        this._sendAction(actions.content, 'blur');
    }

    focusContentEditor() {
        this._sendAction(actions.content, 'focus');
    }

    insertImage(attributes) {
        this._sendAction(actions.insertImage, "result", attributes);
    }

    
    init() {
        let that = this;
        that.isInit = true;
        that.setContentHTML(this.props.initialContentHTML);
        that.props.editorInitializedCallback && that.props.editorInitializedCallback();

        
    }

    async getContentHtml() {
        return new Promise((resolve, reject) => {
            this.contentResolve = resolve;
            this.contentReject = reject;
            this._sendAction(actions.content, "postHtml");

            this.pendingContentHtml = setTimeout(() => {
                if (this.contentReject) {
                    this.contentReject('timeout')
                }
            }, 5000);
        });
    }
}


