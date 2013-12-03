/** 
* @fileOverview cg classes 
* @author xu chen
* @date：2013-10-15
* @update：2013-10-15
* @version 0.1 
*/ 

/**
 * @author 徐晨
 * @name cgClass
 * @class 基础对象
 * @constructor
 * @example var cgClass = {};
 */

var cgClass = window.cgClass = { ajaxQueue : {}, ajaxQueueComplete: {}, ajaxQueueCallback : {} };


/**
 * @author 徐晨 
 * @name BaseClass
 * @class 创建基础js类
 * @constructor
 * @extends cgClass
 * @since version 0.1 
 * @param {Object} parent 可选参数，被继承类
 * @example var newClass = new cgClass.BaseClass(parentClass); 
 */
cgClass.BaseClass = function(parent){
    var _class = function(){
        this.init.apply(this, arguments);
    };
    // Inherit
    if ( parent ) {
    	var subClass = function(){};
    	subClass.prototype = parent.prototype;
    	_class.prototype = new subClass;
    }
    _class.prototype.init = function(){};
    _class.fn = _class.prototype;
    _class.fn.parent = _class;
	_class._super = _class.__proto__;


	/**
	 * @name BaseClass#attrs
	 * @desc  为实体类添加属性
	 * @event
	 * @param {Object} obj 需要添加的属性
	 * @example 
	 * newClass.attrs({
	 *     key : "value"
	 * }); 
	 */
	_class.attrs = function(obj){
		var included = obj.included;
		for( var i in obj ){
			_class[i] = obj[i];
		}
		if ( included ) {
			included( _class );
		}
	}
	/**
	 * @name BaseClass#extend
	 * @desc  为实体类添加原型方法
	 * @event
	 * @param {Object} obj 需要添加的原型方法
	 * @example 
	 * newClass.extend({
	 *     key : function(arguments){}
	 * }); 
	 */
	_class.extend = function(obj){
		var extended = obj.extended;
		for( var i in obj ){
			_class.fn[i] = obj[i];
		}
		if ( extended ) {
			extended( _class );
		}
	}

    return _class;
};

/**
 * @author 徐晨 
 * @name AddClass
 * @class 创建一个构造函数
 * @constructor
 * @extends cgClass
 * @since version 0.1 
 * @param {String} className 函数名称
 * @param {String} parent [可选] 父类函数名称
 * @param {Object} handler 原型方法的集合
 * @example
 * cgClass.AddClass(
 *     "ClassName",
 *     {
 *         init : function(options){},	
 *         test : function(){}	
 *     }
 * ); 
 */
cgClass.AddClass = function(className){
	var className = className;
	if ( !!cgClass[className] ) {
		alert("this class is had");
		return false;
	}
	var	_arguments = [].slice.apply(arguments),
		parent,
		handler = _arguments.slice(-1)[0];
	if ( !!_arguments[1] && typeof _arguments[1] == "string" ) {
		parent = _arguments[1];
	}
	function _Class(arg){
		this.outParam = {};
		this.fn = this.prototype;
		this._super = this.__proto__;
		this.init(arg);
		return this;
	}
	// Inherit
    if ( parent ) {
    	var subClass = function(){};
    	subClass.prototype = parent.prototype;
    	_Class.prototype = new subClass;
    }

    _Class.prototype.init = function(){};

    if ( !!handler && typeof handler == "object" ) {
	    for( var key in handler ){
	    	_Class.prototype[key] = handler[key];
	    }	
    }

    /**
	 * @name AddClass#applyMethods
	 * @desc  生成外部调用的对象 赋值于this.outParam并返回赋值
	 * @event
	 * @param {Object} _this 当前作用于this
	 * @param {Object} moethods 被复制对象
	 * @example applyMethods(this, {
	 *     attrKey : value,
	 *     methodKey : function(arguments){}
	 * }); 
	 */
    _Class.prototype.applyMethods = function(_this, methods){
    	var self = this,
    		_methods = methods,
    		newMethods = {};
    	$.each(_methods, function(key, item) {
    		_thisMethod = item;
	    	if ( typeof item == "function" ) {
	    		newMethods[key] = function(){
	    			item.apply(_this, arguments);
	    		};
	    	}else{
	    		newMethods[key] = item;
	    	}
    	});
	    return newMethods;
    }

	cgClass[className] = _Class;
};
/**
 * @author 徐晨 
 * @name Create
 * @class 创建一个新的实例
 * @constructor
 * @extends cgClass
 * @since version 0.1 
 * @param {String} className 实例名称
 * @param {Object} arg 实例默认参数
 * @param {Function} callback [可选] 回调函数
 * @param {Object} callback.self 生成的实例
 * @example var newInstance = new cgClass.Create(
	"className",
	{
		arg : "value",
		method : function(){}
	}
); 
 * @example cgClass.Create(
	"className",
	{
		arg : "value",
		method : function(){}
	}
); 
 * @example cgClass.Create(
	"className",
	{
		arg : "value"
	},
	function(self){
		self.doMethods();
	}
); 
 */
cgClass.Create = function(className, arg, callback){
	var className = className,
		_class,
		arg = arg || {};
	if ( !!cgClass[className] ){
		_class = new cgClass[className](arg);
		if ( typeof callback == "function" ) {
			callback( _class );
		}else{
			return _class;
		}
	}else{
		var _script = document.createElement("script");  
		_script.type = 'text/javascript';  
		_script.onload = _script.onreadystatechange = function() {  
		    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) { 
		        _class = new cgClass[className](arg);
				if ( typeof callback == "function" ) {
					callback( _class );
				}
		        _script.onload = _script.onreadystatechange = null;  
		    }
		};  
		_script.src = "js/cgClass/cgClass." + className + ".js";  
		document.body.appendChild(_script);  
	}
};

/**
 * @author 徐晨 
 * @name Ajax
 * @class Ajax方法
 * @constructor
 * @extends cgClass
 * @extends jQuery
 * @since version 0.1 
 * @param {Object} config 配置对象
 * @param {String} config.url 发送请求的地址
 * @param {String} config.type ["get" : "post"] 请求方式

 * @param {String} config.dataType 请求方式
 * @param {String} config.dataType.xml  返回 XML 文档，可用 jQuery 处理。
 * @param {String} config.dataType.text  返回 String 字符串，可用 jQuery 处理。
 * @param {String} config.dataType.textJson type自动转为text，返回数据预处理为 JSON 数据。
 * @param {String} config.dataType.html 返回纯文本 HTML 信息；包含 script 元素。
 * @param {String} config.dataType.script 返回纯文本 JavaScript 代码。不会自动缓存结果。
 * @param {String} config.dataType.json 返回 JSON 数据 。
 * @param {String} config.dataType.jsonp 使用 JSONP 形式调用函数时，如 "myurl?callback=?" jQuery 将自动替换 ? 为正确的函数名，以执行回调函数。

 * @param {String} config.queue ajax队列的名称
 * @param {Number} config.timeout 设置请求超时时间（毫秒）。此设置将覆盖全局设置。

 * @param {Function} config.beforeSend 在发送请求之前调用，并且传入一个 XMLHttpRequest 作为参数
 * @param {Function} config.success 当请求之后调用。传入返回后的数据，以及包含成功代码的字符串。
 * @param {Function} config.error 在请求出错时调用。传入 XMLHttpRequest 对象，描述错误类型的字符串以及一个异常对象（如果有的话）
 * @param {Function} config.complete 请求完成后回调函数 (请求成功或失败时均调用)

 * @param {Object} defData 默认参数

 * @example
 * cgClass.Ajax({
 *     url : "api/ajax.txt",	
 *     data : {},	
 *     dataType : "textJson",	
 *     queue : "ajaxQueue",	
 *     success : function(){},	
 *     error : function(){}	
 * }); 
 * cgClass.AjaxQueueCallback.ajaxQueue = function(){}
 */
cgClass.Ajax = function(config, defData){
	var self = this,
		defData = defData || {},
		option = $.extend(
			{
				url : "url",
				type: "get",
				dataType: "json",
				queue : "",
				timeout: (30 * 1000),
				queueCallback : function(){},
				beforeSend : function(xhr, ajax){},
				success: function( request, statusText ){},
				error: function( request, statusText, error ){},
				complete: function( request, statusText ){}
			},
			config
		);

	option.data = $.extend(defData, option.data);

	var targetSuccess = config.success,
		targetError = config.error,
		targetComplete = config.complete;

	// 添加dataType==>textJson
	if ( option.dataType == "textJson" && config.success ) {
		option.dataType = "text";
		option.success = function(request, statusText){
			request = $.parseJSON( request );
			targetSuccess(request, statusText);
		};
	}

	// ajax queue
	if ( !!option.queue ) {
		var _ajaxQueue = self.ajaxQueue[option.queue];
		if ( !_ajaxQueue ) {
			_ajaxQueue = 0;
		}
		_ajaxQueue++;
		self.ajaxQueue[option.queue] = _ajaxQueue;
		option.complete = function(request, statusText){
			var queueResult;
			self.ajaxQueue[option.queue]--;
			if ( config.complete  ) {
				targetComplete(request, statusText);
			}
			if(!self.ajaxQueueComplete[option.queue]){
				self.ajaxQueueComplete[option.queue] = [];
			}
			if ( typeof option.queueCallback == "function" ) {
				self.ajaxQueueComplete[option.queue].push(option.queueCallback);
			}
			if ( !self.ajaxQueue[option.queue] ) {
				if ( self.ajaxQueueComplete[option.queue].length ) {
					for( var i = 0; i < self.ajaxQueueComplete[option.queue].length; i++ ){
						queueResult = self.ajaxQueueComplete[option.queue][i]();
						if (queueResult) { break; }
					}
				}
				if ( !!self.ajaxQueueCallback[option.queue] && typeof self.ajaxQueueCallback[option.queue] == "function" ) {
					self.ajaxQueueCallback[option.queue]();
				}
			}
		};
	}

	return $.ajax( option );			
};


