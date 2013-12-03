/**
 * @author 徐晨 
 * @name cgClass.Autocomplete
 * @class 自动完成插件 <a href="../demo/autocomplete.html" target="_blank">demo</a>
 * @constructor
 * @extends cgClass
 * @extends cgClass.Ajax
 * @extends jQuery
 * @extends jQuery.getFromTemplate
 * @since version 1.0 
 * @param {Object} options 参数对象数据
 * @param {jQuery Object} options.wrap 包裹的jquery dom
 * @param {String html} options.template 展示项的js模板
 * @param {jQuery class} options.autoList 展示列表的钩子名称
 * @param {jQuery class} options.autoItem 展示项的钩子名称
 * @param {jQuery class} options.autoText 输入框的钩子名称
 * @param {jQuery Object} options.autoBtn 提交按钮的jquery dom
 * @param {Boolean} options.hasBtn 是否存在提交按钮
 * @param {css class} options.hoverClass 悬停显示项时添加的样式名
 * @param {Function} options.init 模块初始化时的附加事件
 * @param {Function} options.createSearchList 生成显示列表的事件
 * @param {Function} options.action 表单提交的事件
 */
cgClass.AddClass(
    "Autocomplete",
    {
        init : function(options){
            var self = this,
                option = $.extend(/** @lends cgClass.Autocomplete.prototype*/{
                    /**
                     * 需要验证的表格包裹的jquery dom
                     * @type jQuery Object
                     */
                    wrap : $(".Js-auto-frame"),
                    /**
                     * 展示列表的钩子名称
                     * @type String html
                     * @default null 
                     */
                    template : null,
                    /**
                     * 展示列表的钩子名称
                     * @type jQuery class
                     * @default ".Js-auto-list"
                     */
                    autoList : ".Js-auto-list",
                    /**
                     * 展示项的钩子名称
                     * @type jQuery class
                     * @default ".Js-auto-item"
                     */
                    autoItem : ".Js-auto-item",
                    /**
                     * 输入框的钩子名称
                     * @type jQuery class
                     * @default ".Js-auto-text"
                     */
                    autoText : ".Js-auto-text",
                    /**
                     * 提交按钮的jquery dom
                     * @type jQuery dom
                     * @default $(".Js-auto-btn")
                     */
                    autoBtn : $(".Js-auto-btn"),
                    /**
                     * 是否存在提交按钮
                     * @type Boolean
                     * @default true
                     */
                    hasBtn : true,
                    /**
                     * 悬停显示项时添加的样式名
                     * @type css class
                     * @default "selected"
                     */
                    hoverClass : "selected",
                    /**
                     * 模块初始化时的附加事件
                     * @type Function
                     * @default null || init : function(option){}
                     */
                    init : function(option){},
                    /**
                     * 生成显示列表的事件
                     * @type Function
                     * @default function(option, val){}
                     */
                    createSearchList : function(option, val, addItem){},
                    /**
                     * 表单提交的事件
                     * @type Function
                     * @default function(option, val){}
                     */
                    action : function(option, val){}
                }, options),
                $wrap = option.wrap,
                $list = $wrap.find(option.autoList),
                $text = $wrap.find(option.autoText),
                $btn = $wrap.find(option.autoBtn),
                $temp = option.template || '<li class="auto-item Js-auto-item hide-row"><a href="javascript:void(0)" title="#{title}">#{title}</a></li>',
                keys = {
                    back: 8,
                    enter:  13,
                    escape: 27,
                    up:     38,
                    down:   40,
                    array:  [13, 27, 38, 40]
                },
                keyDate = [],
                chooseData = [];

            self.wrap = $wrap;
            self.list = $list;
            self.text = $text;
            self.btn = $btn;
            self.itemTemp = $temp;

            // out param
            self.outParam = self.applyMethods(self, {
                oWrap : $wrap,
                oList : $list,
                oText : $text,
                oBtn : $btn,
                returnText : self.returnText,
                addItem : self.addItem,
                showList : self.showList,
                closeList : self.closeList
            });


            // bind when auto item hover change item's class
            $wrap.on(
                "mouseenter",
                option.autoItem,
                function(){
                    $(this).addClass(option.hoverClass);
                }
            ).on(
                "mouseleave",
                option.autoItem,
                function(){
                    $(this).removeClass(option.hoverClass);
                }
            ).on(
            // bind when auto item clicked return function
                "click",
                option.autoItem,
                function(){
                    self.closeList();
                    if ( typeof( option.action ) == "function" ) {
                        option.action(self.outParam, $.trim( $(this).children().attr("title") ), $(this) );
                    }
                    self.returnText( $(this).children().attr("title") );
                }
            ).on(
            // bind when auto item keyup return function
                "keyup",
                option.autoText,
                function(event){
                    var keyCode = event.keyCode;
                    keyDate.push((new Date()).getTime());
                    var thisTime = keyDate[(keyDate.length - 1)];
                    var val = "";
                    if($.inArray(keyCode, keys.array) !=-1){
                        val = $.trim( $text.val() ); 
                        if ( $list.is(":hidden") && $list.children(option.autoItem).length ) {
                            self.showList();
                        }
                        var $item = $list.children(option.autoItem),
                            $cur = $item.filter("." + option.hoverClass);
                        switch (keyCode){
                            case keys.up:
                                if ( $cur.length ){
                                    $cur.removeClass(option.hoverClass).prev().addClass(option.hoverClass);
                                }else{
                                    $item.last().addClass(option.hoverClass);
                                }
                            break;
                            case keys.down:
                                if ( $cur.length ){
                                    $cur.removeClass(option.hoverClass).next().addClass(option.hoverClass);
                                }else{
                                    $item.first().addClass(option.hoverClass);
                                }
                            break;
                            case keys.enter:
                                $list.hide();
                                if ( typeof( option.action ) == "function" ) {
                                    if ( $cur.length ) {
                                        $cur.click();
                                    } else{
                                        option.action(self.outParam, $.trim( $text.val() ), $cur );
                                    }
                                }
                            break;
                            default :
                            break;
                        }
                    }else{
                        // 延时显示searchlist 减少多余查询
                        setTimeout(function(){
                            val = $.trim( $text.val() );
                            if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
                                option.createSearchList(self.outParam, val);
                            }else if ( val == "" ){
                                self.closeList();
                            }
                        }, 300);
                    }
                }
            ).on(
            // bind when auto item keydown return function
                "keydown",
                option.autoText,
                function(event){
                    var keyCode = event.keyCode;
                    if ( keyCode == keys.back && $.trim( $(this).val() ) == "" && $list.is(":visible") ){
                        self.closeList();
                    }
                }
            ).on(
            // bind when auto item focus return function
                "focus",
                option.autoText,
                function(){
                    if( $.trim( $(this).val() ) != "" && $list.children().length && $list.is(":hidden") ){
                        self.showList();
                    }
                }
            );

            if ( option.hasBtn ) {
                option.autoBtn.on("click", function(){
                    self.closeList();
                    if ( typeof( option.action ) == "function" ) {
                        option.action(self.outParam, $.trim( $text.val() ) );
                    }
                });
            }

            // init
            if ( typeof option.init == "function" ) {
                option.init(self.outParam);
            }
        },
        /**
         * @name cgClass.Autocomplete#returnText
         * @desc  替换输出框的值为带入参数
         * @event
         * @param {String} value 替换输入框的值
         */
        returnText : function(value){
            this.text.val( $.trim(value) );
        },
        /**
         * @name cgClass.Autocomplete#addItem
         * @desc  添加展示项
         * @event
         * @param {Array} data 展示项的数据 例:["abc", "efg"]
         */
        addItem : function(data){
            var self = this;
            self.list.empty();
            if ( data.constructor === Array && data.length ) {
                $.each(data, function(index, item){
                    self.list.append( $.getFromTemplate( self.itemTemp, item ) );
                });
                self.showList();
            }else{
                self.closeList();
            }
        },
        /**
         * @name cgClass.Autocomplete#showList
         * @desc  显示显示列表，并绑定隐藏列表功能
         * @event
         */
        showList : function(){
            var self = this;
            self.list.slideDown("fast", "linear", function(){
                $(document).one("click", function(){
                    self.list.hide();
                });
            });
        },
        /**
         * @name cgClass.Autocomplete#closeList
         * @desc  隐藏显示列表
         * @event
         */
        closeList : function(){
            this.list.hide();
        }
    }
);
