(function($){
//$.fn

//$
/*******************************************************************************************************
 *	baiing View : $.getFromTemplate()	替换模板
 *	@param [options:template($dom)]		template jquery dom
 *	@param [options:model(obj)]			{ name : value }
 ********************************************************************************************************/
$.getFromTemplate = function( template, model ){
    var templateData;
    if ( template.constructor === jQuery ) {
        templateData = template.html();
    }else if ( template.constructor === String  ){
        templateData = template;
    }
    templateData = templateData.replace(
        new RegExp( "\\#\\{([^\\}]+)\\}", "gi" ),
        function( $0, $1 ){
            if ($1 in model){
                return( model[ $1 ] );
            } else {
                return( $0 )
            }
        }
    );
    if ( template.constructor === jQuery ) {
        return( $( templateData ).data( "model", model ) );
    }else if ( template.constructor === String  ){
        return templateData;
    }
};

/*******************************************************************************************************
 *	baiing View : $.cgPopup()	弹出框 * 为必填
 *	@param [options:title(str)]			*title text
 *	@param [options:template(html)]		*content html
 *	@param [options:addClass(str)]		popup new class
 *	@param [options:isLayer(bool)]		if true, add mask layer
 *	@param [options:hasBtn(bool)]		if false, all button hide without close button
 *	@param [options:hasCancel(bool)]	if false, cancel button hide
 *	@param [options:content(fun)]		content function
 *	@param [options:done(fun)]			*done function
 *	@param [options:cancel(fun)]		cancel function
 ********************************************************************************************************
 *	@param [out:oPopup($dom)]			dom : popup
 *	@param [out:oBtnWrap($dom)]			dom : popup wrap
 *	@param [out:oBtnDone($dom)]			dom : popup done button
 *	@param [out:oBtnCancel($dom)]		dom : popup cancel button
 *	@param [out:oBtnClose($dom)]		dom : popup close button
 *	@param [out:oCon($dom)]				dom : popup content
 *  @param [out:close(fun)]             action : close popup
 *  @param [out:showTip(fun)]           action : show error tips
 *  @param [out:removeTip(fun)]         action : remove error tips
 *  @param [out:disableBtn(fun)]        action : edit done's btn status to disabled or not
 *	@param [out:positionCenter(fun)]	action : change popup to center
 ********************************************************************************************************/
$.cgPopup = function(options){
    var $layer, $popup, $close, $title, $con, $error, $btnWrap, $done, $cancel,
        option = $.extend(/** @lends cgClass.Popup.prototype*/{
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
         * @name cgClass.Popup#bindDrag
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
         * @name cgClass.Popup#positionCenter
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
         * @name cgClass.Popup#show
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
         * @name cgClass.Popup#hide
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
         * @name cgClass.Popup#close
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
         * @name cgClass.Popup#showTip
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
         * @name cgClass.Popup#removeTip
         * @desc  隐藏错误信息
         * @event
         */
        removeTip : function(){
            $error.hide();
        },
        /**
         * @name cgClass.Popup#reset
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
         * @name cgClass.Popup#disableBtn
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
                        self.close();
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