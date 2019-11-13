/*
 * @Descripttion: HTML
 * @version: 
 * @Author: liyamei
 * @Date: 2019-11-11 18:46:15
 * @LastEditors: liyamei
 * @LastEditTime: 2019-11-13 17:55:40
 */

const HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <style>
        * {outline: 0px solid transparent;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-touch-callout: none;}
        html, body { margin: 0; padding: 0;font-family: Arial, Helvetica, sans-serif; font-size:1em;}
        body { overflow-y: hidden; -webkit-overflow-scrolling: touch;height: 100%;background-color: #FFF;}
        img {max-width: 98%;margin-left:auto;margin-right:auto;display: block;}
        .content {  font-family: Arial, Helvetica, sans-serif;color: #000033; width: 100%;height: 100%;-webkit-overflow-scrolling: touch;padding-left: 0;padding-right: 0;}
        .pell { height: 100%;}
        .pell-content { outline: 0; overflow-y: auto;padding:4px 5px 0;height: 100%;}
        table {width: 100% !important;}
        table td {width: inherit;}
        table span { font-size: 12px !important; }
    </style>
</head>
<body>
<div class="content"><div id="editor" class="pell"></div></div>
<script>
    (function (exports) {
        var defaultParagraphSeparatorString = 'defaultParagraphSeparator';
        var formatBlock = 'formatBlock';
        var addEventListener = function addEventListener(parent, type, listener) {
            return parent.addEventListener(type, listener);
        };
        var appendChild = function appendChild(parent, child) {
            return parent.appendChild(child);
        };
        var createElement = function createElement(tag) {
            return document.createElement(tag);
        };
        var queryCommandState = function queryCommandState(command) {
            return document.queryCommandState(command);
        };
        var queryCommandValue = function queryCommandValue(command) {
            return document.queryCommandValue(command);
        };

        var exec = function exec(command,value) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            return document.execCommand(command, false, value);
        };
        
        var postAction = function(data){
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
        };

        var editor = null, o_height = 0;
        
        var Actions = {
            fontColor:{
                state: function() {
                    return queryCommandState('foreColor');
                },
                result: function(color) {
                    return exec('foreColor',color);
                }
            },
            fontSize:{
                state: function() {
                    return queryCommandState('fontSize');
                },
                result: function(size) {
                    return exec('fontSize',size);
                }
            },
            heading:{
                result: function(h) {
                    return exec(formatBlock, '<'+h+'>');
                }
            },
            bold: {
                state: function() {
                    return queryCommandState('bold');
                },
                result: function() {
                    return exec('bold');
                }
            },
            italic: {
                state: function() {
                    return queryCommandState('italic');
                },
                result: function() {
                    return exec('italic');
                }
            },
            underline: {
                state: function() {
                    return queryCommandState('underline');
                },
                result: function() {
                    return exec('underline');
                }
            },
            strikethrough: {
                state: function() {
                    return queryCommandState('strikeThrough');
                },
                result: function() {
                    return exec('strikeThrough');
                }
            },
            
            justifyLeft: {
                state: function() {
                    return queryCommandState('justifyLeft');
                },
                result: function() {
                    return exec('justifyLeft');
                }
            },
            justifyCenter: {
                state: function() {
                    return queryCommandState('justifyCenter');
                },
                result: function() {
                    return exec('justifyCenter');
                }
            },
            justifyRight: {
                state: function() {
                    return queryCommandState('justifyRight');
                },
                result: function() {
                    return exec('justifyRight');
                }
            },
            /*h1: {
                result: function() {
                    return exec(formatBlock, '<h1>');
                }
            },
            h2: {
                result: function() {
                    return exec(formatBlock, '<h2>');
                }
            },
            h3: {
                result: function() {
                    return exec(formatBlock, '<h3>');
                }
            },
            h4: {
                result: function() {
                    return exec(formatBlock, '<h4>');
                }
            },
            h5: {
                result: function() {
                    return exec(formatBlock, '<h5>');
                }
            },*/
            paragraph: {
                result: function() {
                    return exec(formatBlock, '<p>');
                }
            },
            quote: {
                result: function() {
                    return exec(formatBlock, '<blockquote>');
                }
            },
            orderedList: {
                state: function() {
                    return queryCommandState('insertOrderedList');
                },
                result: function() {
                    return exec('insertOrderedList');
                }
            },
            unorderedList: {
                state: function() {
                    return queryCommandState('insertUnorderedList');
                },
                result: function() {
                    return exec('insertUnorderedList');
                }
            },
            
            code: {
                result: function() {
                    return exec(formatBlock, '<pre>');
                }
            },
            line: {
                result: function() {
                    return exec('insertHorizontalRule');
                }
            },
            link: {
                result: function() {
                    var url = window.prompt('Enter the link URL');
                    if (url) exec('createLink', url);
                }
            },
            image: {
                result: function(url) {
                    if (url) { exec('insertHTML', "<br><div><img src='"+ url +"'/></div><br>");}
                }
            },
            content: {
                setHtml: function(html) {
                    editor.content.innerHTML = html;
                },
                getHtml: function() {
                    return editor.content.innerHTML;
                },
                blur: function() {
                    editor.content.blur();
                },
                focus: function() {
                    editor.content.focus();
                },
                postHtml: function (){
                    postAction({type: 'CONTENT_HTML_RESPONSE', data: editor.content.innerHTML});
                }
            },

            UPDATE_HEIGHT: function() {
                var height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);
                if (o_height !== height){
                    postAction({type: 'OFFSET_HEIGHT', data: o_height = height});
                }
            },
        };

        var init = function init(settings) {

            var defaultParagraphSeparator = settings[defaultParagraphSeparatorString] || 'div';


            var content = settings.element.content = createElement('div');
            content.contentEditable = true;
            content.spellcheck = false;
            content.autocapitalize = 'off';
            content.autocorrect = 'off';
            content.autocomplete = 'off';
            content.className = "pell-content";
            content.oninput = function (_ref) {
                var firstChild = _ref.target.firstChild;

                if (firstChild && firstChild.nodeType === 3){
                    exec(formatBlock, '<' + defaultParagraphSeparator + '>');
                }else if (content.innerHTML === '<br>') {
                    content.innerHTML = '';
                }
                settings.onChange(content.innerHTML);
            };
            content.onkeydown = function (event) {
                if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
                    setTimeout(function () {
                        return exec(formatBlock, '<' + defaultParagraphSeparator + '>');
                    }, 0);
                }
            };
            appendChild(settings.element, content);

            if (settings.styleWithCSS) exec('styleWithCSS');
            exec(defaultParagraphSeparatorString, defaultParagraphSeparator);

            var actionsHandler = [];
            for (var k in Actions){
                if (typeof Actions[k] === 'object' && Actions[k].state){
                    actionsHandler[k] = Actions[k]
                }
            }

            var handler = function handler() {

                var activeTools = [];
                for(var k in actionsHandler){
                    if ( Actions[k].state() ){
                        activeTools.push(k);
                    }
                }
                postAction({type: 'SELECTION_CHANGE', data: activeTools});
                return true;
            };
            addEventListener(content, 'touchend', function(){
                setTimeout(handler, 100);
            });
            addEventListener(content, 'blur', function () {
                postAction({type: 'SELECTION_CHANGE', data: []});
            });
            addEventListener(content, 'focus', function () {
                postAction({type: 'CONTENT_FOCUSED'});
            });
            
            var message = function (event){
                var msgData = JSON.parse(event.data), action = Actions[msgData.type];
                if (action ){
                    if ( action[msgData.name]){
                        action[msgData.name](msgData.data);
                        if (msgData.name === 'result'){
                            content.focus();
                            handler();
                        }
                    } else {
                        action(msgData.data);
                    }
                }
            };

            document.addEventListener("message", message , false);
            window.addEventListener("message", message , false);
            document.addEventListener('touchend', function () {
                content.focus();
            });
            return settings.element;
        };

        editor = init({
            element: document.getElementById('editor'),
            defaultParagraphSeparator: 'div',
        })
    })(window);
</script>
</body>
</html>
`;

export {
    HTML
}
