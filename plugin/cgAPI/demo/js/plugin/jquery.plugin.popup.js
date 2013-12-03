(function($){
/**
 * @author 徐晨 
 * @name jQuery.cgClassPopup
 * @class 弹出框 <a href="../demo/popup.html" target="_blank">demo</a>
 * @constructor
 * @extends Modernizr
 * @extends jQuery
 * @since version 1.0
 * @param {Object} options 参数对象数据
 * @param {String} options.type 弹出框的种类 [ "popup" | "confirm" | "result" ]
 * @param {Object} options.param 附加参数
 * @param {String} options.title 弹出框的标题
 * @param {jQuery Object} options.popupTemp 弹出框html的jQuery对象
 * @param {html} options.template 内容区的html代码片段
 * @param {String} options.message type为confirm时显示的消息提示文本
 * @param {Number} options.time type为result时自动关闭窗口时间
 * @param {css class} options.addClass 附加弹出框样式
 * @param {Boolean} options.isLayer 是否需要遮罩层
 * @param {Boolean} options.isCenter 是否居中
 * @param {Boolean} options.isDrag 是否可拖拽
 * @param {Boolean} options.isOnly 是否为唯一
 * @param {Boolean} options.autoShow 是否在初始化时自动显示弹出框
 * @param {Object} options.append 是否在目标对象中加载
 * @param {Boolean} options.append.isAppend 是否在目标对象中加载
 * @param {jQuery Object} options.append.dom 目标对象的jquery dom
 * @param {Boolean} options.hasBtn 是否需要按钮
 * @param {Boolean} options.hasCancel 是否需要取消按钮
 * @param {Function} options.content 内容区的附加函数
 * @param {Function} options.done 确定按钮的附加函数
 * @param {Function} options.cancel 取消按钮的附加函数
 * @example $.cgClassPopup(
    {
        type : "popup",
  [可选]param : {},
  [可选]title : "弹出框",
  [可选]popupTemp : null || $('<div class="module-popup fn-clear Js-popup-wrap">'+
                    '<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
                    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
                    '<div class="popup-con Js-popup-con"></div>'+
                    '<div class="popup-btn-wrap Js-popup-btn-wrap">'+
                        '<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
                        '<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
                    '</div>'+
                '</div>'),
        template : "<div></div>",
  [可选]addClass : "popupClass",
  [可选]isLayer : true,
  [可选]isCenter : true,
  [可选]isDrag : true,
  [可选]isOnly : false,
  [可选]autoShow : true,
  [可选]append : {
            isAppend : false,
            dom : $(".dom")
        },
  [可选]hasBtn : true,
  [可选]hasCancel : true,
  [可选]content : null || function(opt){},
  [可选]done : null || function(opt){},
  [可选]cancel : null || function(opt){}
    }
); 
oPopup.Events();
 * @example $.cgClassPopup(
    {
        type: "confirm",
  [可选]param : {},
  [可选]title: "提示",
  [可选]doneText : "确定按钮",
  [可选]cancelText : "确定按钮",
        message : "测试弹出框",
  [可选]done : function(opt){},
  [可选]cancel : function(opt){}
    }
); 
 * @example $.cgClassPopup(
    {
        type: "result",
  [可选]param : {},
  [可选]title: "提示",
  [可选]doneText : "确定按钮",
        message : "测试弹出框",
  [可选]time : 2000,
  [可选]content : function(opt){},
  [可选]done : function(opt){}
    }
); 
 */

$.cgClassPopup = function(options){
    var $layer, $popup, $close, $title, $con, $error, $btnWrap, $done, $cancel,
        option = $.extend(/** @lends jQuery.cgClassPopup.prototype*/{
            /**
             * 弹出框的种类 [ "popup" | "confirm" | "result" ]
             * @type String 
             * @default "popup"
             */
            type : "popup",
            /**
             * 附加参数
             * @type Object
             * @default {}
             */
            param : {},
            /**
             * 弹出框的标题
             * @type String
             * @default ""
             */
            title: "",
            /**
             * 确定按钮的文字
             * @type String
             * @default "确定"
             */
            doneText: "确定",
            /**
             * 取消按钮的文字
             * @type String
             * @default "取消"
             */
            cancelText: "取消",
            /**
             * 弹出框html的jQuery对象
             * @type jQuery Dom
             * @default null
             */
            popupTemp : null,
            /**
             * 内容区的html代码片段
             * @type html String
             * @default ""
             */
            template : "",
            /**
             * 弹出框为展示文本类型时显示的消息提示文本
             * @type String
             * @default ""
             */
            message : "",
            /**
             * 如果type = result 自动消失时间
             * @type Number
             * @default null
             */
            time : null,
            /**
             * 附加弹出框样式
             * @type css class
             * @default ""
             */
            addClass : "",
            /**
             * 是否需要遮罩层
             * @type Boolean
             * @default true
             */
            isLayer : true,
            /**
             * 是否居中
             * @type Boolean
             * @default true
             */
            isCenter : true,
            /**
             * 是否唯一
             * @type Boolean
             * @default true
             */
            isDrag : true,
            /**
             * 是否唯一
             * @type Boolean
             * @default false
             */
            isOnly : false,
            /**
             * 是否在初始化时自动显示
             * @type Boolean
             * @default true
             */
            autoShow : true,
            /**
             * 以添加的方式初始化弹出框 isAppend: 是否以添加的方式初始化弹出框; dom: 包裹对象
             * @type Object
             * @default isAppend : false, dom : $(".dom")
             */
            append : {
                isAppend : false,
                dom : $(".dom")
            },
            /**
             * 是否需要按钮
             * @type Boolean
             * @default true
             */
            hasBtn : true,
            /**
             * 是否需要取消按钮
             * @type Boolean
             * @default true
             */
            hasCancel : true,
            /**
             * 内容区的附加函数
             * @type Function
             * @param {Object} opt 外部调用对象
             * @default null
             */
            content :null,
            /**
             * 确定按钮附加函数
             * @type Function
             * @param {Object} opt 外部调用对象
             * @default null
             */
            done :null,
            /**
             * 取消按钮附加函数
             * @type Function
             * @param {Object} opt 外部调用对象
             * @default null
             */
            cancel :null
        }, options),
        targetContent = option.content,
        targetDone = option.done,
        targetCancel = option.cancel,
        boolContent = typeof option.content == "function" ? true : false,
        boolDone = typeof option.done == "function" ? true : false,
        boolCancel = typeof option.cancel == "function" ? true : false;

    $popup = option.popupTemp || $('<div class="module-popup fn-clear Js-popup-wrap">'+
        '<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
        '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
        '<div class="popup-con Js-popup-con"></div>'+
        '<div class="popup-btn-wrap Js-popup-btn-wrap">'+
            '<a class="popup-btn done Js-popup-done" href="javascript:;;"><span class="popup-btn-text">' + option.doneText + '</span></a>'+
            '<a class="popup-btn cancel Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">' + option.cancelText + '</span></a>'+
        '</div>'+
    '</div>');

    $error = $('<p class="confirm-msg"></p>');

    $title = $popup.find(".Js-popup-title");
    $close = $popup.find(".Js-popup-close");
    $con = $popup.find(".Js-popup-con");
    $btnWrap = $popup.find(".Js-popup-btn-wrap");
    $done = $btnWrap.find(".Js-popup-done");
    $cancel = $btnWrap.find(".Js-popup-cancel");

    $.extend(option, {
        oPopup : $popup,
        oCon : $con,
        oBtnWrap : $btnWrap,
        oBtnDone : $done,
        oBtnCancel : $cancel,
        oBtnClose : $close,
        oLayer : $layer,
        /**
         * @name jQuery.cgClassPopup#bindDrag
         * @desc  绑定拖拽事件
         * @event
         */
        bindDrag : function(){
            var _drag = {},
                width = $popup.width(),
                height = $popup.height();
            // bind drag
            $title.css("cursor", "move");
            $popup.on("mousedown", ".Js-popup-title", function(event) {
                event.preventDefault();
                var _position = $popup.position();
                _drag.posLeft = _position.left;
                _drag.posTop = _position.top - $(window).scrollTop();
                _drag.dl = event.pageX;
                _drag.dt = event.pageY;
                $(document).on("mousemove", function(e){
                    e.preventDefault();
                    _drag.ml = e.pageX;
                    _drag.mt = e.pageY;
                    _drag.ol = _drag.posLeft + _drag.ml - _drag.dl;
                    _drag.ot = _drag.posTop + _drag.mt - _drag.dt;
                    $popup.css({
                        left : _drag.ol + "px",
                        top : _drag.ot + "px"
                    });
                });
                $(document).one("mouseup", function(){
                    $(document).off("mousemove mouseup");
                });
            });
        },
        /**
         * @name jQuery.cgClassPopup#positionCenter
         * @desc  使弹出框居中
         * @event
         */
        positionCenter : function(){
            var width = $popup.width(),
                height = $popup.height();
            $popup.css({
                "position" : "fixed",
                "top" : "40%",
                "left" : "50%",
                "margin" : "-" + height / 2 + "px 0 0 -" + width / 2 + "px" 
            });
        },
        /**
         * @name jQuery.cgClassPopup#show
         * @desc  显示弹出框
         * @event
         * @param {Function} callback 回调函数
         */
        show : function(callback){
            option.disableBtn(true);
            option.positionCenter();
            if ( option.isLayer ) {
                $layer.show();
            }
            $popup.show();
            if (Modernizr.csstransitions) {
                $popup.addClass("fadeInDown").delay(800).show(0, function(){$(this).removeClass("fadeInDown");});
            }
            if ( typeof callback == "function" ) {
                callback(option);
            }
        },
        /**
         * @name jQuery.cgClassPopup#hide
         * @desc  隐藏弹出框
         * @event
         * @param {Function} callback 回调函数
         */
        hide : function(callback){
            if ( option.isLayer ) {
                $layer.hide();
            }
            if (!Modernizr.csstransitions) {
                $popup.hide();
            }else{
                $popup.addClass("fadeOutUp").delay(800).hide(0, function(){$(this).removeClass("fadeOutUp");});
            }
            if ( typeof callback == "function" ) {
                callback(option);
            }
        },
        /**
         * @name jQuery.cgClassPopup#close
         * @desc  关闭弹出框
         * @event
         * @param {Function} callback 回调函数
         */
        close : function(callback){
            if ( option.isLayer ) {
                $layer.remove();
            }
            if (!Modernizr.csstransitions) {
                $popup.remove();
            }else{
                $popup.addClass("fadeOutUp").delay(700).hide(0, function(){
                    $popup.remove();
                });
            }
            if ( typeof callback == "function" ) {
                callback(option);
            }
        },
        /**
         * @name jQuery.cgClassPopup#showTip
         * @desc  显示错误信息
         * @event
         * @param {String} str 错误信息的字符串
         */
        showTip : function(str){
            $popup.addClass("rock").delay(500).show("0", function(){
                $(this).removeClass("rock");
                option.disableBtn(true);
            });
            if ( !$con.find($error).length ) {
                $con.append($error);
            }
            $error.show().html(str);
        },
        /**
         * @name jQuery.cgClassPopup#removeTip
         * @desc  隐藏错误信息
         * @event
         */
        removeTip : function(){
            $error.hide();
        },
        /**
         * @name jQuery.cgClassPopup#reset
         * @desc  重置内容区内容
         * @event
         * @param {html String} newHtml 重置内容区的html，但是事件不会重置
         */
        reset : function(newHtml){
            if ( !!newHtml ) {
                $con.html(newHtml);
            } else{
                $con.html(option.template);
            }
        },
        /**
         * @name jQuery.cgClassPopup#disableBtn
         * @desc  改变确定按钮状态
         * @event
         * @param {Boolean} isReset 为true时确定按钮可用，反之不可用
         */
        disableBtn : function(isReset){
            var self = this;
            if ( isReset ) {
                $done.removeClass("popup-btn-disabled");
            } else{
                $done.addClass("popup-btn-disabled");
            }
        }
    });

    // 派生多种类型
    switch(option.type){
        case "popup":
        break;
        case "confirm":
            if ( !option.message ) {
                return false;
            }
            option.title = option.title || "提示";
            option.template = '<p class="confirm-msg">' + option.message + '</p>';
            if ( boolDone ) {
                option.done = function(){
                    targetDone(option);
                    option.close();
                }
            }
        break;
        case "result":
            if ( !option.message ) {
                return false;
            }
            option.title = option.title || "提示";
            if ( typeof option.message == "string" ) {
                option.template = '<p class="confirm-msg">' + option.message + '</p>';
            }
            if ( option.message.constructor == Array && option.message.length ) {
                var _str = "";
                for( var i = 0; i < option.message.length; i++ ){
                    _str += '<p class="confirm-error-msg">' + option.message[i] + '</p>';
                }
                option.template = _str;
            }
            option.hasCancel = false;
            if ( !!option.time ) {
                if ( boolContent ) {
                    targetContent(option);
                }
                option.content = function(){
                    setTimeout(function(){
                        option.close();
                    }, option.time);
                }
            }
        break;
        default:
        break;
    }

    if ( !option.title ) {
        $title.hide();
    }

    if ( option.isLayer ) {
        $layer = $("<div class='module-popup-layer'></div>");
        $("body").append($layer);
    }

    if ( option.isOnly ) {
        $(".module-popup-layer").remove();
        $(".Js-popup-wrap").remove();
    }

    if ( option.append.isAppend ) {
        option.append.dom.append( $popup );
    } else{
        $("body").append( $popup );
    }

    // add new class
    if ( option.addClass ) {
        $popup.addClass(option.addClass);
    }

    // append content template
    $con.append(option.template);

    // bind popup init function
    if ( typeof(option.content) == "function" ) {
        option.content( option );
    }
    // bind btn close method
    $popup.on("click", ".Js-popup-close", function() {
        if ( option.hasCancel && boolCancel ) {
            option.cancel( option );
        } else{
            if ( !option.hasCancel && boolDone ) {
                option.done( option );
            }
            option.close();
        }
    // bind btn done method
    }).on("click", ".Js-popup-done", function() {
        if ( option.hasBtn && !$(this).hasClass("popup-btn-disabled") && boolDone ) {
            option.disableBtn();
            option.done( option );
        }
        if ( !boolDone ) {
            option.close();
        }
        return false;
    // bind btn cancel method
    }).on("click", ".Js-popup-cancel", function() {
        if ( boolCancel ) {
            option.cancel( option );
        }else{
            option.close();
        }
    });

    // bind drag and drop
    if ( option.isDrag ) {
        option.bindDrag();
    }

    // change button
    if ( option.hasBtn ) {
        if ( !option.hasCancel ) {
            $cancel.remove();
        }
    }else{
        $btnWrap.remove();
    }

    // bind wrap position
    if ( option.isCenter && !option.append.isAppend ) {
        $(window).resize(function(){
            option.positionCenter();
        });
    }

    // change auto show
    if ( option.autoShow ) {
        option.show();
    }

    return option;
};

/**
 * @author 徐晨 
 * @name jQuery.cgConfirm
 * @class 提示框 
 * @constructor
 * @extends jQuery
 * @since version 1.0
 * @param {Object} options 参数对象数据
 * @param {Boolean} options.isLayer 是否需要遮罩层
 * @param {String} options.title 弹出框的标题
 * @param {String} options.message 显示的消息提示文本
 * @param {Object} options.doneBtn 确定按钮
 * @param {Function} options.doneBtn.fun 确定按钮的附加函数
 * @param {Object} options.cancelBtn 取消按钮
 * @param {Function} options.cancelBtn.has 是否需要取消按钮
 * @param {Function} options.cancelBtn.fun 取消按钮的附加函数
 * @example $.cgConfirm({
  [可选]isLayer: true,
  [可选]title: "提示",
        message : "测试弹出框",
  [可选]doneBtn : {
            fun : function( events ){}
        },
  [可选]cancelBtn : {
            has : true,
            fun : function( events ){}
        }
    }); 
 */

$.cgConfirm = function( options ) {
    var option = $.extend({
            title: "提示",
            message: "",
            doneBtn: {
                fun: function( events ){
                    // alert("OK");
                }
            },
            cancelBtn: {
                has : true,
                fun : function( events ) {
                    // alert("Cancel");
                }
            },
            isLayer : true
        }, options),
        $popup = $('<div class="module-popup fn-clear Js-popup-wrap">'+
            // '<div class="popup-wrap fn-clear Js-popup-wrap">'+
            '<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
            '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
            '<div class="popup-con Js-popup-con">'+
            '<p class="confirm-msg Js-popup-msg">' + option.message + '</p>'+
            '</div>'+
            '<div class="btn-wrap">'+
   //          '<input type="button" class="popup-btn input-btn Js-popup-done" value="确定">'+
            // '<input type="button" class="popup-btn input-btn Js-popup-cancel" value="取消">'+
            '<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
            '<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
            '</div>'+
            // '</div>'+
            '</div>');
    if ( option.isLayer ) {
        var $layer = $("<div class='module-popup-layer'></div>");
        $("body").append($layer);
    }
    $("body").append( $popup );
    // console.log(option);
    var $confirm = $popup,
        $confirmTitle = $confirm.find('.Js-popup-title').hide(),
        $confirmMessage = $confirm.find('.Js-popup-msg'),
        $confirmDone = $confirm.find('.Js-popup-done'),
        $confirmCancel = $confirm.find('.Js-popup-cancel').hide(),
        $confirmClose = $confirm.find('.Js-popup-close'),
        openConfirm = function() {
            // bind title
            if(option.title){
                $confirmTitle.show();
            }
            // bind message
            if(option.message){
                $confirmMessage.text( option.message ).show();
            }
            // bind done button
            if(option.doneBtn.fun && $.isFunction(option.doneBtn.fun)){
                $confirmDone.one("click", function( event ) {
                    option.doneBtn.fun( event );
                    closeConfirm();
                });
            }
            // bind close button
            $confirmClose.one("click", function(){
                closeConfirm();
            });
            // bind cancel button
            if ( option.cancelBtn.has ) {
                $confirmCancel.show();
                if(option.cancelBtn.fun && $.isFunction(option.cancelBtn.fun)){
                    $confirmCancel.one("click", function( event ) {
                        option.cancelBtn.fun( event );
                        closeConfirm();
                    });
                }
                // reset bind close button
                $confirmClose.off("click").one("click", function(){
                    $confirmCancel.click();
                });
            }
            // bind wrap position
            positionCenter();
            $(window).resize(function(){
                positionCenter();
            });
            $popup.show();
        },
        positionCenter = function(){
            var objWidht = $popup.width(),
                objHeight = $popup.height();
            $popup.css( { "margin-left" : "-" + objWidht / 2 + "px" } );
        },
        closeConfirm = function() {
            $popup.remove();
            if ( option.isLayer ) {
                $layer.remove();
            }
        };
    // console.log($confirm.length);
    openConfirm();
};

/**
 * @author 徐晨 
 * @name jQuery.cgResultTips
 * @class 提示框 
 * @constructor
 * @extends jQuery
 * @since version 1.0
 * @param {String} options.title 弹出框的标题
 * @param {String} options.type 弹窗模式 [message | error]
 * @param {String|Array} options.message 显示的消息提示文本 type为message时为字符串类型，type为error时为字符串数组类型
 * @param {Number} options.time type为message时自动关闭窗口时间
 * @example $.cgResultTips({
  [可选]title: "提示",
        type : "message|error",
        message : [message : "string" | error : ["array"]],
  [可选]time : 2000
    }); 
 */
$.cgResultTips = function(options){
    var option = $.extend({
        title : "",
        type : "",
        message : [],
        time : 3000
    }, options);
    var str = "";
    switch(option.type){
        case "message" :
            if ( typeof(option.message) == "string" ) {
                str = '<p class="confirm-msg Js-popup-msg">' + option.message + '</p>';
            }
            option.title = option.title ? option.title : "操作成功";
            option.con = function(opt){
                setTimeout(function(){
                    opt.oPopup.fadeOut("normal", function(){
                        opt.close();
                    });
                }, option.time);
            };
            break;
        case "error" :
            if ( option.message.constructor === Array && option.message.length > 0 ) {
                for( var i = 0; i < option.message.length; i++ ){
                    str += '<p class="confirm-error-msg Js-popup-msg">' + option.message[i] + '</p>';
                }
            }
            option.title = option.title ? option.title : "操作失败";
            option.con = function(opt){

            };
            break;
        default :
            break;
    };
    $.cgPopup({
        title : option.title,
        template : str,
        isLayer : true,
        hasBtn : true,
        hasCancel : false,
        content : function(opt){
            option.con(opt);
        },
        done : function(opt){
            opt.close();
        }
    });
};

/**
 * @author 徐晨 
 * @name jQuery.cgPopup
 * @class 弹出框 
 * @constructor
 * @extends jQuery
 * @since version 1.0
 * @param {Object} options 参数对象数据
 * @param {String} options.title 弹出框的标题
 * @param {jQuery Object} options.popupTemp 弹出框html的jQuery对象
 * @param {html} options.template 内容区的html代码片段
 * @param {css class} options.addClass 附加弹出框样式
 * @param {Boolean} options.isLayer 是否需要遮罩层
 * @param {Boolean} options.isCenter 是否居中
 * @param {Boolean} options.isDrag 是否可拖拽
 * @param {Boolean} options.isOnly 是否为唯一
 * @param {Object} options.append 是否在目标对象中加载
 * @param {Boolean} options.append.isAppend 是否在目标对象中加载
 * @param {jQuery Object} options.append.dom 目标对象的jquery dom
 * @param {Boolean} options.hasBtn 是否需要按钮
 * @param {Boolean} options.hasCancel 是否需要取消按钮
 * @param {Function} options.content 内容区的附加函数
 * @param {Function} options.done 确定按钮的附加函数
 * @param {Function} options.cancel 取消按钮的附加函数
 * @example $.cgPopup(
    {
  [可选]title : "弹出框",
  [可选]popupTemp : null || $('<div class="module-popup fn-clear Js-popup-wrap">'+
                    '<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
                    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
                    '<div class="popup-con Js-popup-con"></div>'+
                    '<div class="popup-btn-wrap Js-popup-btn-wrap">'+
                        '<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
                        '<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
                    '</div>'+
                '</div>'),
        template : "<div></div>",
  [可选]addClass : "popupClass",
  [可选]isLayer : true,
  [可选]isCenter : true,
  [可选]isDrag : true,
  [可选]isOnly : false,
  [可选]append : {
            isAppend : false,
            dom : $(".dom")
        },
  [可选]hasBtn : true,
  [可选]hasCancel : true,
  [可选]content : null || function(opt){},
  [可选]done : null || function(opt){},
  [可选]cancel : null || function(opt){}
    }
); 

 */

$.cgPopup = function(options){
    var option = $.extend({
        title: "提示",
        template : "",
        addClass : "",
        isLayer : true,
        isCenter : true,
        isOnly : false,
        append : {
            isAppend : false,
            dom : $(".dom")
        },
        // hasError : false,
        hasBtn : true,
        hasCancel : true,
        content : function(option){},
        done : function(option){},
        cancel : function(option){}
    }, options);
    if ( option.template == "" ) {
        return false;
    }
    var $popup = $('<div class="module-popup fn-clear Js-popup-wrap">'+
                  // '<div class="popup-wrap fn-clear">'+
                    '<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
                    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
                    '<div class="popup-con Js-popup-con"></div>'+
                    '<div class="btn-wrap Js-popup-btn-wrap">'+
                        // '<input type="button" class="popup-btn input-btn Js-popup-done" value="确定">'+
                        // '<input type="button" class="popup-btn input-btn Js-popup-cancel" value="取消">'+
                        '<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
                        '<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
                    '</div>'+
                  // '</div>'+
                '</div>');
    var $error = $('<ul class="result-tips-error result-tips"></ul>');
    if ( option.isLayer ) {
        var $layer = $("<div class='module-popup-layer'></div>");
        $("body").append($layer);
    }
    if ( option.isOnly ) {
        $(".module-popup-layer").remove();
        $(".Js-popup-wrap").remove();
    }
    if ( option.append.isAppend ) {
        option.append.dom.append( $popup );
    } else{
        $("body").append( $popup );
    }
    // if ( option.hasError ) {
    //     $popup.find(".Js-popup-btn-wrap").after($error);
    // }
    // add new class
    if ( option.addClass ) {
        $popup.addClass(option.addClass);
    }
    var $mainWrap = $popup.find(".Js-popup-main-wrap"),
        $btnWrap = $popup.find(".Js-popup-btn-wrap"),
        $btnDone = $btnWrap.find(".Js-popup-done"),
        $btnCancel = $btnWrap.find(".Js-popup-cancel"),
        $btnClose = $popup.find(".Js-popup-close"),
        $con = $popup.find(".Js-popup-con"),
        positionCenter = function(){
            var objWidht = $popup.width(),
                objHeight = $popup.height();
            $popup.css( { "margin-left" : "-" + objWidht / 2 + "px" } );
        };
    // out param
    $.extend(option, {
        oPopup : $popup,
        oBtnWrap : $btnWrap,
        oBtnDone : $btnDone,
        oBtnCancel : $btnCancel,
        oBtnClose : $btnClose,
        oCon : $con,
        oTip : $error,
        /**
         * @name jQuery.cgPopup#close
         * @desc  关闭弹出框
         * @event
         * @param {Function} callback 回调函数
         */
        close : function(){
            $popup.remove();
            if ( option.isLayer ) {
                $layer.remove();
            }
        },
        /**
         * @name jQuery.cgPopup#showTip
         * @desc  显示错误信息
         * @event
         * @param {String} str 错误信息的字符串
         */
        showTip : function(str){
            $mainWrap.append($error);
            $error.html(str);
        },
        /**
         * @name jQuery.cgPopup#removeTip
         * @desc  隐藏错误信息
         * @event
         */
        removeTip : function(str){
            $error.remove();
        },
        /**
         * @name jQuery.cgPopup#disableBtn
         * @desc  改变确定按钮状态
         * @event
         * @param {Boolean} disable 为true时确定按钮不可用，反之可用
         */
        disableBtn : function(disable){
            if (disable) {
                option.oBtnDone.prop("disabled", true);
            }else{
                option.oBtnDone.prop("disabled", false);
            }
        }
    });
    // append content template
    $con.append(option.template);

    $popup.show();
    // bind popup init function
    if ( typeof(option.content) ) {
        option.content(option);
    }

    if ( option.hasBtn ) {
        $btnDone.on("click", function(){
            if ( typeof(option.done) == "function" && !$(this).prop("disabled") ) {
                option.done(option);
            }
        });
        if ( option.hasCancel ) {
            $btnCancel.on("click", function(){
                if ( typeof(option.cancel) == "function" ) {
                    option.cancel(option);
                }
                option.close();
            });
            $btnClose.on("click", function(){
                $btnCancel.click();
            });
        } else{
            $btnCancel.remove();
            $btnClose.on("click", function(){
                option.close();
            });
        }
    }else{
        $btnWrap.remove();
        $btnClose.on("click", function(){
            if ( typeof(option.done) == "function" ) {
                option.done(option);
            }
            option.close();
        });
    }

    // bind wrap position
    if ( option.isCenter ) {
        positionCenter();
        $(window).resize(function(){
            positionCenter();
        });
    }
};


}(jQuery));