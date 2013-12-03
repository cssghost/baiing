(function($){

/**
 * @author 徐晨 
 * @name jQuery.Verification
 * @class 验证插件 <a href="../demo/verification-register.html" target="_blank">demo</a>
 * @constructor
 * @extends jQuery
 * @since version 1.0 
 * @param {Object} options 参数对象数据
 * @param {jQuery Object} options.wrap 需要验证的表格包裹的jquery dom
 * @param {jQuery class} options.hookDom 被验证项的钩子名称
 * @param {Object} options.map 附加验证条件
 * @param {jQuery Object} options.btn 触发提交事件的按钮
 * @param {Object} options.parseAjaxData 附加ajax data
 * @param {Function} options.successTemp 返回成功提示的html片段
 * @param {Function} options.errorTemp 返回错误提示的html片段
 * @param {jQuery class} options.otherInput 特殊input的钩子名称
 * @param {Function} options.init 验证前的附加事件
 * @param {Function} options.error 验证错误时候的附加事件
 * @param {Function} options.success 验证成功时候的附加事件
 * @example $.cgVerification({
        wrap : $(".register-wrap"),
        hookDom: ".Js-verification",
        map : "",
        btn : $(".Js-matchAll"),
        parseAjaxData : null,
        successTemp : null,
        errorTemp : null,
        init : function(){},
        error : function($errorDom){
            console.log($errorDom);
        },
        success : function($btn, event){
            console.log($btn, event);
        },
        otherInput : ".other"
    });
 * @example
 * <div class="label-wrap fn-clear">
            <div class="span-name">不为空且2到5个字符：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="不为空且2到5个字符:notNull/strRange,{2-5}" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">是否重复：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="是否重复:notNull/isHave" data-same-id="id" data-same-url="url" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">手机：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="手机:mobile" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">邮箱：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="邮箱:email" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">网址：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="网址:url" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">整数：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="整数:onlyNum" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">整数或者浮点数字：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="整数或者浮点数字:onlyNumFloat" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">只能是数字,小数位为2位：</div>
            <div class="input-wrap">
                <input type="text" class="input-text Js-verification" data-ver="只能是数字,小数位为2位:numLast,{1-2}" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">单选：</div>
            <div class="input-wrap Js-verification" data-type="notText" data-ver="单选:notSelect">
                <input type="radio" name="radio" value="radio01" />
                <input type="radio" name="radio" value="radio02" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">多选：</div>
            <div class="input-wrap Js-verification" data-type="notText" data-ver="多选:notSelect">
                <input type="checkbox" name="checkbox" value="checkbox01" />
                <input type="checkbox" name="checkbox" value="checkbox02" />
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">多选：</div>
            <div class="input-wrap">
                <select class="Js-verification" data-ver="多选:notNull">
                    <option value="">choose</option>
                    <option value="option01">option01</option>
                </select>
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">选框：</div>
            <div class="input-wrap">
                <select multiple="multiple" class="Js-verification" data-ver="选框:notNull">
                    <option value="">choose</option>
                    <option value="option01">option01</option>
                </select>
            </div>
        </div>
        <div class="label-wrap fn-clear">
            <div class="span-name">根据隐藏域判断是否为空：</div>
            <div class="input-wrap Js-verification" data-type="notText" data-input-type="other" data-ver="根据隐藏域判断是否为空:otherNotNull">
                <input type="text" class="input-text" />
                <input type="hidden" class="other" />
            </div>
        </div>
 */

$.cgVerification = function( options ) {
    var option = $.extend({
        wrap : $(".wrap"),
        hookDom: ".Js-verification",
        map : "",
        btn : $("Js-btn"),
        parseAjaxData : null,
        successTemp : null,
        errorTemp : null,
        init : function(){},
        error : function(){},
        success : function(){},
        otherInput : ".other"
    }, options);
    if ( option.map == "" ) {
        var map = {
            "notNull" : {
                msg : "{name}不能为空",
                reg : /[^\s|.]/
            },
            "otherNotNull" : {
                msg : "{name}不能为空",
                reg : /[^\s|.]/
            },
            "notSelect" : {
                msg : "{name}为必填项，请选择有效项",
                reg : /[^\s|.]/
            },
            "mobile" : {
                msg : "{name}为无效手机格式",
                reg : /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/
            },
            "email" : {
                msg : "{name}为无效邮箱格式",
                reg : /^\w+([-+.']\w+)*@\w+([.]\w+)*\.\w+([.]\w+)*$/
            },
            "url" : {
                msg : "{name}为无效网址格式",
                reg : /^(\w+:\/\/)?\w+(\.\w+)+.*$/
            },
            "onlyNumLastTwo" : {
                msg : "{name}只能是数字,最多2位小数",
                reg : /^\d+(\.\d{1,2})?$/
            },
            "onlyNum" : {
                msg : "{name}只能是整数",
                reg : /^\d+$/
            },
            "onlyNumFloat" : {
                msg : "{name}只能是数字",
                reg : /^\d+(\.\d+)?$/
            },
            "numLast" : {
                msg : "{name}只能是数字,小数位为{range}" //numLast,{1-2}
            },
            "numRange" : {
                msg : "{name}数值范围为{range}"  //numRange,{1-2}
            },
            "strRange" : {
                msg : "{name}字数范围为{range}"  //strRange,{1-2}
            },
            "notSpecialChar" : {
                msg : "{name}不能包含特殊字符",
                reg : /^[\w\u4E00-\u9FA5]+$/
            },
            "isHave" : {
                msg : "{name}重复"
            }
        };
        option.map = {};
        $.extend( option.map, map );
    }
    var flag = true, errorDom, isAjax = null, isSame = true;
    // parse Verification condition
    var _parseVer = function(str){
        var arrCondition = str.split(":"),
            parseData = { name : arrCondition[0], condition : arrCondition[1].split("/") };
        return parseData;
    };
    // thrown error
    var _thrown = function(data){
        errorDom = data.dom;
        if ( data.msg == undefined ) {
            data.msg = option.map[data.ver].msg.replace("{name}", data.name);
        }
        var temp = "";
        data.dom.nextAll(".Js-verification-state").remove();
        if ( option.errorTemp != null) {
            temp = option.errorTemp(data.msg);
        }else{
            temp = '<a href="javascript:javascript:void(0);" class="state error Js-verification-state">' + data.msg + '</a>';
        }
        var $_nextAll = data.dom.nextAll();
        if ( $_nextAll.length ) {
            $_nextAll.last().after(temp);
        } else{
            data.dom.after(temp);
        }
        
    };
    // verified
    var _verified = function(data){
        data.dom.nextAll(".Js-verification-state").remove();
        // var temp = "";
        // if ( option.successTemp != null) {
        //     temp = option.successTemp();
        // }else{
        //     temp = '<a href="javascript:javascript:void(0);" class="state right Js-verification-state">&nbsp;</a>';
        // }
        // var $_nextAll = data.dom.nextAll();
        // if ( $_nextAll.length ) {
        //     $_nextAll.last().after(temp);
        // } else{
        //     data.dom.after(temp);
        // }
    };

    // test num last 
    var _testNumLast =  function (data) {
        var range = /numLast,{(.+?)}/.exec(data.ver)[1],
            valMin = range.split("-")[0],
            valMax = range.split("-")[1],
            _reg = new RegExp('^\\d+(\\.\\d{' + valMin + ',' + valMax + '})$');
        // data.val = parseFloat(data.val);
        data.msg = data.msg.replace("{range}", range);
        if(_reg.test(data.val)) {
            return true;
        } else {
            return data.msg;
        }
    }

    // test num range
    var _testNumRange =  function (data) {
        var range = /numRange,{(.+?)}/.exec(data.ver)[1],
            valMin = range.split("-")[0],
            valMax = range.split("-")[1];
        data.val = parseFloat(data.val);
        data.msg = data.msg.replace("{range}", range);
        if(data.val >= valMin && data.val <= valMax) {
            return true;
        } else {
            return data.msg;
        }
    }
    // test str range
    var _testStrRange =  function (data) {
        var range = /strRange,{(.+?)}/.exec(data.ver)[1],
            strMin = range.split("-")[0],
            strMax = range.split("-")[1],
            // arrStr = data.val.split(""),
            _strLength = data.val.length;
            // _strLength = 0;
        // for (var i = 0; i < arrStr.length; i++ ) {
        //     if( /[\u4e00-\u9fa5]/.test( arrStr[i] ) ){
        //         _strLength += 2;
        //     }
        //     else{
        //         _strLength++;
        //     }
        // }
        data.msg = data.msg.replace("{range}", range);
        if(_strLength >= strMin && _strLength <= strMax) {
            return true;
        } else {
            return data.msg;
        }
    }

    // test same
    var _testSame =  function (data) {

        $.ajax({
            type : "post",
            url : data.ajaxUrl,
            data : data.ajaxData,
            async : false,
            dataType:"json",
            success : function(result, textStatus) {
                if ( result.success ) {
                    isSame = false;
                }else{
                    isSame = true;
                }
            },
            error : function() {
                isSame = true;
            }
        });
    }

    // bind input function
    option.wrap.on("focus", option.hookDom, function(){

    }).on("blur", option.hookDom, function(){
            var $this = $(this),
                condition = _parseVer( $(this).attr("data-ver") );
            if ( $this.attr("data-type") == "notText" ) {
                switch( $this.attr("data-input-type") ){
                    case "select" :
                        var _selectVal = $this.find("select").first().val();
                        if ( _selectVal == "" ) {
                            flag = false;
                            _thrown({
                                dom : $this.find("select").first(),
                                ver : "notSelect",
                                name : condition.name
                            });
                        }else{
                            // _verified({ dom : $this.find("input").last() });
                        }
                    break;
                    case "other" :
                        var _otherVal = $this.find(option.otherInput).val();
                        if ( _otherVal == "" ) {
                            flag = false;
                            _thrown({
                                dom : $this.find("input").last(),
                                ver : "otherNotNull",
                                name : condition.name
                            });
                        }else{
                            _verified({ dom : $this.find("input").last() });
                        }
                    break;
                    default :
                        var checkedLength = $this.find("input:checked").length;
                        if( $.inArray("notSelect", condition.condition) != -1 && checkedLength == 0 ) {
                            flag = false;
                            _thrown({
                                dom : $this.find("input").last() ,
                                ver : "notSelect",
                                name : condition.name
                            });
                        }else{
                            _verified({ dom : $this.find("input").last() });
                        }
                    break;
                };
            } else{
                var val = $.trim( $this.val() );
                if ( $this.filter("select[multiple='multiple']").length ) {
                    if( $.inArray("notNull", condition.condition) != -1 && !$this.children().length ) {
                        flag = false;
                        _thrown({
                            dom : $this,
                            ver : "notNull",
                            name : condition.name
                        });
                    }else{
                        _verified({ dom : $this });
                    }
                }
                else if ( val == "" ) {
                    if( $.inArray("notNull", condition.condition) != -1 ) {
                        flag = false;
                        _thrown({
                            dom : $this,
                            ver : "notNull",
                            name : condition.name
                        });
                    }else{
                        _verified({ dom : $this });
                    }
                }else{
                    for( var i = 0; i < condition.condition.length; i++ ){
                        var _thisVer = condition.condition[i];
                        if ( _thisVer.split(",")[0] in option.map ) {
                            switch( _thisVer.split(",")[0] ){
                                case "numLast" :
                                    var _numRangeMsg =  option.map["numLast"].msg.replace("{name}", condition.name);
                                    var _testResult = _testNumLast({ msg : _numRangeMsg, ver : _thisVer, val : val });
                                    if ( _testResult == true ) {
                                        _verified({ dom : $this });
                                    } else{
                                        flag = false;
                                        _thrown({
                                            dom : $this,
                                            ver : _thisVer,
                                            name : condition.name,
                                            msg : _testResult
                                        });
                                        return false;
                                    }
                                    break;
                                case "numRange" :
                                    var _numRangeMsg =  option.map["numRange"].msg.replace("{name}", condition.name);
                                    var _testResult = _testNumRange({ msg : _numRangeMsg, ver : _thisVer, val : val });
                                    if ( _testResult == true ) {
                                        _verified({ dom : $this });
                                    } else{
                                        flag = false;
                                        _thrown({
                                            dom : $this,
                                            ver : _thisVer,
                                            name : condition.name,
                                            msg : _testResult
                                        });
                                        return false;
                                    }
                                    break;
                                case "strRange" :
                                    var _strRangeMsg =  option.map["strRange"].msg.replace("{name}", condition.name);
                                    var _testResult = _testStrRange({ msg : _strRangeMsg, ver : _thisVer, val : val });
                                    if ( _testResult == true ) {
                                        _verified({ dom : $this });
                                    } else{
                                        flag = false;
                                        _thrown({
                                            dom : $this,
                                            ver : _thisVer,
                                            name : condition.name,
                                            msg : _testResult
                                        });
                                        return false;
                                    }
                                    break;
                                case "isHave" :
                                    var _isHaveMsg =  option.map["isHave"].msg.replace("{name}", condition.name);
                                    var _ajaxData = {
                                            label : val,
                                            id : $this.attr("data-same-id") == "" ? "" : $this.attr("data-same-id")
                                        },
                                        _newTime = (new Date()).getTime(),
                                        _ajaxUrl = $this.attr("data-same-url");
                                    _ajaxUrl = /\?/.exec( _ajaxUrl ) == null ? _ajaxUrl + "?newTime=" + _newTime : _ajaxUrl + "&newTime=" + _newTime;
                                    if ( typeof( option.parseAjaxData ) == "function" ) {
                                        _ajaxData = option.parseAjaxData(_ajaxData, $this);
                                    }
                                    var _testResult = _testSame({ msg : _isHaveMsg, ajaxUrl : _ajaxUrl, ajaxData : _ajaxData });
                                    // $(document).ajaxComplete(function(){
                                        if ( isSame == false ) {
                                            _verified({ dom : $this });
                                        } else{
                                            flag = false;
                                            _thrown({
                                                dom : $this,
                                                ver : _thisVer,
                                                name : condition.name,
                                                msg : _isHaveMsg
                                            });
                                            return false;
                                        }
                                    // });
                                    break;
                                default:
                                    if ( option.map[_thisVer].reg.test(val) ) {
                                        _verified({ dom : $this });
                                    } else{
                                        flag = false;
                                        _thrown({
                                            dom : $this,
                                            ver : _thisVer,
                                            name : condition.name
                                        });
                                        return false;
                                    }
                                    break;
                            }
                        }else{
                            alert("验证信息配置有误");
                        }
                    }
                }
            }
        });
    // bind btn function
    option.btn.on("click", function(event){
        if ( typeof(option.init) == "function" ) {
            option.init();
        }
        flag = true;
        if ( option.wrap.find(option.hookDom).length != 0 ) {
            option.wrap.find(option.hookDom).each(function(){
                $(this).blur();
                if ( $(this).attr("data-same-url") != undefined ) {
                    // $(document).ajaxComplete(function(){
                        if ( !flag ) {
                            return false;
                        }
                    // });
                }else{
                    if ( !flag ) {
                        return false;
                    }
                }
            });
        }

        if ( flag ) {
            if ( typeof(option.success) == "function" ) {
                option.success(option.btn, event);
            }
        } else{
            if ( typeof(option.error) == "function" ) {
                option.error(errorDom);
            }
        }
    });
};

}(jQuery));