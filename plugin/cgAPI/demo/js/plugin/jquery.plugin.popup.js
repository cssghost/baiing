(function($){
/**
 * @author 徐晨 
 * @name jQuery.cgPopup
 * @class 弹出框 <a href="../demo/popup.html" target="_blank">demo</a>
 * @constructor
 * @extends Modernizr
 * @extends jQuery
 * @since version 1.0
 * @param {Object} options 参数对象数据
 * @param {String} options.type 弹出框的种类
 * @param {Object} options.param 附加参数
 * @param {String} options.title 弹出框的标题
 * @param {jQuery Object} options.popupTemp 弹出框html的jQuery对象
 * @param {html} options.template 内容区的html代码片段
 * @param {String} options.message type为confirm时显示的消息提示文本
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
 * @example $.cgPopup(
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
 * @example $.cgPopup(
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
 * @example $.cgPopup(
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
$.cgPopup = function(options){
    var $layer, $popup, $close, $title, $con, $error, $btnWrap, $done, $cancel,
        option = $.extend(/** @lends jQuery.cgPopup.prototype*/{
            /**
             * 弹出框的种类
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
         * @name jQuery.cgPopup#bindDrag
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
         * @name jQuery.cgPopup#positionCenter
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
         * @name jQuery.cgPopup#show
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
         * @name jQuery.cgPopup#hide
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
         * @name jQuery.cgPopup#close
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
         * @name jQuery.cgPopup#showTip
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
         * @name jQuery.cgPopup#removeTip
         * @desc  隐藏错误信息
         * @event
         */
        removeTip : function(){
            $error.hide();
        },
        /**
         * @name jQuery.cgPopup#reset
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
         * @name jQuery.cgPopup#disableBtn
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


}(jQuery));