/**
 * @author 徐晨 
 * @name cgClass.ModulePopupLogin
 * @class 登录弹出框 <a href="../demo/popup-login.html" target="_blank">demo</a>
 * @constructor
 * @extends cgClass.Popup
 * @extends jQuery
 * @since version 0.1 
 * @param {Object} options 参数对象数据
 * @param {css class} options.addClass 登陆框的样式名称
 * @param {String} options.url 登录接口
 * @param {String} options.dataType 回调数据类型
 * @param {Boolean} options.autoShow 是否默认弹出
 * @param {Function} options.callback 登录接口的回调函数
 * @example cgClass.Create(
	"ModulePopupLogin",
	{
  [可选]addClass : "module-popup-login",
		url : "url",
		dataType : "json",
  [可选]autoShow : true,
		callback : function(opt){
			// opt为cgClass.Popop的外部提供参数
			// 关闭方式为opt.close()
		}
	}
); 
 * @example var oLogin = cgClass.Create(
	"ModulePopupLogin",
	{
  [可选]addClass : "module-popup-login",
		url : "url",
		dataType : "json",
		autoShow : false,
		callback : function(opt){
			// opt为cgClass.Popop的外部提供参数
			// 关闭方式为opt.hide()
		}
	}
	oLogin.show();
); 
 */
cgClass.AddClass(
	"ModulePopupLogin",
	{
		init : function(options){
			var self = this,
				option = $.extend(/** @lends cgClass.ModulePopupLogin.prototype*/{
					/**
			         * 登陆框的样式名称
			         * @type css class
			         * @default {}
			         */
					addClass : "module-popup-login",
					/**
			         * 登录接口
			         * @type String
			         * @default {}
			         */
					url : "url",
					/**
			         * 回调数据类型
			         * @type String
			         * @default {}
			         */
					dataType : "json",
					/**
			         * 是否默认弹出
			         * @type Boolean
			         * @default {}
			         */
					autoShow : true,
					/**
			         * 登录接口的回调函数
			         * @type Function
			         * @default null
			         */
					callback : null
				}, options),
				loginPopupCon = '<div class="text Js-name"><input type="text" placeholder="请输入用户名" /><p class="error">请输入用户名</p></div>'+
						'<div class="text Js-password"><input type="password" placeholder="请输入密码" /><p class="error">请输入密码</p></div>'+
						'<div class="remember"><label><input type="checkbox" /> 记住密码</label></div>',
				targetContent = option.content,
				popupOption = $.extend(option, {
					type: "popup",
					title: "用户登录",
					template : loginPopupCon,
					content : function(opt){
						if ( typeof targetContent == "function" ) {
							targetContent(opt);
						}
						opt.oCon.on("blur", ".text input", function(){
							self.testLoginNull($(this));
						});
					},
					done : function(opt){
						var $con = opt.oCon,
							$text = $con.find(".text"),
							$name = $con.find(".Js-name input"),
							$psw = $con.find(".Js-password input");
						opt.removeTip();
						if ( $.trim( $name.val() ) == "" || $.trim( $psw.val() ) == "" ) {
							self.testLoginNull($name);
							self.testLoginNull($psw);
							opt.disableBtn(true);
						}
						else{
							$con.find(".error").slideUp();
							$.ajax({
								url : option.url,
								type : "get",
								dataType : option.dataType,
								data : { username : $name.val(), password : $psw.val() },
								success : function(result){
									if ( typeof option.callback == "function" ) {
										option.callback(result, opt);
									}
									// if ( result.success ) {
									// 	opt.close();
									// } else{
									// 	opt.disableBtn(true);
									// 	opt.showTip("用户名或者密码错误");
									// }
								},
								error : function(){
									opt.showTip("登录失败，请重新尝试");
								}
							});
						}
					},
					cancel : function(opt){
						opt.hide();
					}
				});
			self.popup = cgClass.Create("Popup", popupOption);
		},
		/**
		 * @name cgClass.ModulePopupLogin#testLoginNull
		 * @desc  验证输入框是否为空
		 * @event
		 */
		testLoginNull : function($text){
			if ( $.trim( $text.val() ) == "" ) {
				$text.siblings(".error").slideDown("fast").closest(".text").addClass("text-error");
			}else{
				$text.siblings(".error").slideUp("fast").closest(".text").removeClass("text-error");
			}
		},
		/**
		 * @name cgClass.ModulePopupLogin#show
		 * @desc  显示弹出框
		 * @event
		 */
		show : function(callback){
			this.popup.reset();
			this.popup.show(callback);
		}
	}
);