/**
 * @author 徐晨 
 * @name cgClass.Popup
 * @class 弹出框 <a href="../demo/popup.html" target="_blank">demo</a>
 * @constructor
 * @extends cgClass
 * @extends Modernizr
 * @extends jQuery
 * @since version 0.1 
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
 * @example cgClass.Create(
	"Popup",
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
 * @example cgClass.Create(
	"Popup",
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
 * @example cgClass.Create(
	"Popup",
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
cgClass.AddClass(
	"Popup",
	{
		init : function (options) {
			var self = this,
				$layer, $popup, $close, $title, $con, $error, $btnWrap, $done, $cancel,
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

		    self.option = option;

		    self.popup = $popup = option.popupTemp || $('<div class="module-popup fn-clear Js-popup-wrap">'+
				  	'<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
				    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
				    '<div class="popup-con Js-popup-con"></div>'+
				    '<div class="popup-btn-wrap Js-popup-btn-wrap">'+
				    	'<a class="popup-btn done Js-popup-done" href="javascript:;;"><span class="popup-btn-text">' + option.doneText + '</span></a>'+
            			'<a class="popup-btn cancel Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">' + option.cancelText + '</span></a>'+
				    '</div>'+
				'</div>');

		    self.error = $error = $('<p class="confirm-msg"></p>');

		    self.template = option.template;
	        self.title = $title = $popup.find(".Js-popup-title");
	        self.btnClose = $close = $popup.find(".Js-popup-close");
	        self.con = $con = $popup.find(".Js-popup-con");
		    self.btnWrap = $btnWrap = $popup.find(".Js-popup-btn-wrap");
	        self.btnDone = $done = $btnWrap.find(".Js-popup-done");
	        self.btnCancel = $cancel = $btnWrap.find(".Js-popup-cancel");

	        // out param
		    self.outParam = self.applyMethods(self, {
		    	param : option.param,
				oPopup : $popup,
				oCon : $con,
		        oBtnWrap : $btnWrap,
		        oBtnDone : $done,
		        oBtnCancel : $cancel,
		        oBtnClose : $close,
				oLayer : $layer,
				show : self.show,
				hide : self.hide,
				close : self.close,
				reset : self.reset,
				showTip : self.showTip,
				removeTip : self.removeTip,
				disableBtn : self.disableBtn
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
	        		self.template = '<p class="confirm-msg">' + option.message + '</p>';
	        		if ( boolDone ) {
		        		option.done = function(){
		        			targetDone(self.outParam);
		        			self.close();
		        		}
	        		}
	        	break;
	        	case "result":
	        		if ( !option.message ) {
	        			return false;
	        		}
	        		option.title = option.title || "提示";
	        		if ( typeof option.message == "string" ) {
	        			self.template = '<p class="confirm-msg">' + option.message + '</p>';
	        		}
	        		if ( option.message.constructor == Array && option.message.length ) {
	        			var _str = "";
	        			for( var i = 0; i < option.message.length; i++ ){
		                    _str += '<p class="confirm-error-msg">' + option.message[i] + '</p>';
		                }
	        			self.template = _str;
	        		}
	        		option.hasCancel = false;
	        		if ( !!option.time ) {
	        			if ( boolContent ) {
	        				targetContent(self.outParam);
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
		        self.layer = $layer = $("<div class='module-popup-layer'></div>");
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
		    $con.append(self.template);

		    // bind popup init function
		    if ( typeof(option.content) == "function" ) {
		        option.content( self.outParam );
		    }
		    // bind btn close method
		    $popup.on("click", ".Js-popup-close", function() {
		    	if ( option.hasCancel && boolCancel ) {
		    		option.cancel(self.outParam);
		    	} else{
		    		if ( !option.hasCancel && boolDone ) {
		                option.done(self.outParam);
		            }
		    		self.close();
		    	}
		    // bind btn done method
		    }).on("click", ".Js-popup-done", function() {
		    	if ( option.hasBtn && !$(this).hasClass("popup-btn-disabled") && boolDone ) {
		    		self.disableBtn();
		            option.done(self.outParam);
		    	}
		    	if ( !boolDone ) {
		            self.close();
		    	}
		    	return false;
		    // bind btn cancel method
		    }).on("click", ".Js-popup-cancel", function() {
		    	if ( boolCancel ) {
                    option.cancel(self.outParam);
                }else{
                	self.close();
                }
		    });

		    // bind drag and drop
		    if ( option.isDrag ) {
		    	self.bindDrag();
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
		            self.positionCenter();
		        });
		    }

		    // change auto show
		    if ( option.autoShow ) {
		    	self.show();
		    }
		},
		/**
		 * @name cgClass.Popup#bindDrag
		 * @desc  绑定拖拽事件
		 * @event
		 */
		bindDrag : function(){
			var self = this,
				_drag = {};
            // bind drag
	        self.title.css("cursor", "move");
	        self.popup.on("mousedown", ".Js-popup-title", function(event) {
	            event.preventDefault();
	            var _position = self.popup.position();
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
	                self.popup.css({
	                    left : _drag.ol + "px",
	                    top : _drag.ot + "px"
	                });
	            });
	            $(document).one("mouseup", function(){
	                $(document).off("mousemove");
	            });
	        });
		},
		/**
		 * @name cgClass.Popup#positionCenter
		 * @desc  使弹出框居中
		 * @event
		 */
		positionCenter : function(){
			var self = this,
				width = self.popup.width(),
                height = self.popup.height();
            self.popup.css({
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
			var self = this;
			self.positionCenter();
			if ( self.option.isLayer ) {
                self.layer.show();
            }
			self.popup.show();
			if (Modernizr.csstransitions) {
				self.popup.addClass("fadeInDown").delay(800).show(0, function(){$(this).removeClass("fadeInDown");});
			}
			if ( typeof callback == "function" ) {
				callback(self.outParam);
			}
		},
		/**
		 * @name cgClass.Popup#hide
		 * @desc  隐藏弹出框
		 * @event
		 * @param {Function} callback 回调函数
		 */
		hide : function(callback){
			var self = this;
			if ( self.option.isLayer ) {
                self.layer.hide();
            }
			if (!Modernizr.csstransitions) {
				self.popup.hide();
			}else{
				self.popup.addClass("fadeOutUp").delay(800).hide(0, function(){$(this).removeClass("fadeOutUp");});
			}
			if ( typeof callback == "function" ) {
				callback(self.outParam);
			}
		},
		/**
		 * @name cgClass.Popup#close
		 * @desc  关闭弹出框
		 * @event
		 * @param {Function} callback 回调函数
		 */
		close : function(callback){
			var self = this;
			if ( self.option.isLayer ) {
                self.layer.remove();
            }
            if (!Modernizr.csstransitions) {
				self.popup.remove();
			}else{
				self.popup.addClass("fadeOutUp").delay(700).hide(0, function(){
					self.popup.remove();
				});
			}
			if ( typeof callback == "function" ) {
				callback(self.outParam);
			}
		},
		/**
		 * @name cgClass.Popup#showTip
		 * @desc  显示错误信息
		 * @event
		 * @param {String} str 错误信息的字符串
		 */
		showTip : function(str){
			var self = this;
			self.popup.addClass("rock").delay(500).show("0", function(){
				$(this).removeClass("rock");
				self.disableBtn(true);
			});
			if ( !self.con.find(self.error).length ) {
				self.con.append(self.error);
			}
		    self.error.show().html(str);
		},
		/**
		 * @name cgClass.Popup#removeTip
		 * @desc  隐藏错误信息
		 * @event
		 */
		removeTip : function(){
			this.error.hide();
		},
		/**
		 * @name cgClass.Popup#reset
		 * @desc  重置内容区内容
		 * @event
		 * @param {html String} newHtml 重置内容区的html，但是事件不会重置
		 */
		reset : function(newHtml){
			var self = this;
			if ( !!newHtml ) {
				self.con.html(newHtml);
			} else{
				self.con.html(self.template);
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
				self.btnDone.removeClass("popup-btn-disabled");
			} else{
				self.btnDone.addClass("popup-btn-disabled");
			}
		}
	}
);
