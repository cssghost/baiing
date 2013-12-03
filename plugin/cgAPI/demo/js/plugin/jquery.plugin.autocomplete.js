(function($){

/**
 * @author 徐晨 
 * @name jQuery.cgAutoComplete
 * @class 自动完成插件 <a href="../demo/autocomplete.html" target="_blank">demo</a>
 * @constructor
 * @extends jQuery
 * @extends jQuery.getFromTemplate
 * @since version 1.0 
 * @param {Object} options 参数对象数据
 * @param {jQuery Object} options.frameBox 包裹的jquery dom
 * @param {jQuery class} options.autoList 展示列表的钩子名称
 * @param {jQuery class} options.autoItem 展示项的钩子名称
 * @param {jQuery class} options.autoText 输入框的钩子名称
 * @param {jQuery Object} options.autoBtn 提交按钮的jquery dom
 * @param {Boolean} options.isSearch 是否需要搜索框
 * @param {css class} options.hoverClass 悬停显示项时添加的样式名
 * @param {Function} options.init 模块初始化时的附加事件
 * @param {Function} options.createSearchList 生成显示列表的事件
 * @param {Function} options.action 表单提交的事件
 * @example
 * $.cgAutoComplete({
        frameBox : $(".Js-auto-wrap"),
        autoList : ".Js-auto-list",
        autoItem : ".Js-auto-item",
        autoText : ".Js-auto-text",
        autoBtn : $(".Js-auto-btn"),
        hoverClass : "selected",
        init : function(opt){},
        createSearchList : function(opt, val){
            var json = {
                "success": true,
                "list": [
                    {
                        "title": "商旅套餐e-什么是商旅套餐e？"
                    },
                    {
                        "title": "八一套餐e-什么是八一套餐e？"
                    },
                    {
                        "title": "八一套餐e-申请了八一套餐e后，可以更改套餐e吗？..."
                    },
                    {
                        "title": "天翼校园套餐e-校园套餐e有什么套餐e可选包？..."
                    },
                    {
                        "title": "八一套餐e-八一套餐e有什么套餐e可选包？..."
                    },
                    {
                        "title": "天翼校园套餐e-申请了校园套餐e后，可以更改套餐e吗..."
                    },
                    {
                        "title": "大众套餐e卡-大众套餐e卡有什么套餐e可选包？..."
                    }
                ]
            };
            opt.list.empty();
            if ( json.list && json.list.constructor === Array && json.list.length ) {
                $.each(json.list, function( index, item ){
                    opt.addItem( $("#Js-frame-auto-search-item-template"), item );
                });
                opt.showList();
            }else{
                opt.closeList();
            }
            // $.ajax({
            //     url : "api/autocomplete.txt",
            //     type : "post",
            //     dataType : "json",
            //     success : function(result){
            //         if ( result.success ) {
            //             if ( result.list && result.list.constructor === Array && result.list.length ) {
            //                 opt.list.empty();
            //                 $.each(result.list, function( index, item ){
            //                     opt.addItem( $("#Js-frame-auto-search-item-template"), item );
            //                 });
            //                 opt.showList();
            //             }
            //         }else{
            //             opt.closeList();
            //         }
            //     },
            //     error : function(result){
            //         opt.closeList();
            //     }
            // });
        },
        action : function(opt, val, $item){
            opt._returnText(val);
            console.log("action:" + val);
        }
    });
 * @example
 *  <div class="wrap Js-auto-wrap">
        <div class="search-form">
            <input class="search-text Js-auto-text" type="text" name="q" x-webkit-speech="" autocomplete="off" />
        </div>
        <a class="search-button Js-auto-btn" href="javascript:void(0)">搜索</a>
        <ul class="search-list Js-auto-list"></ul>
    </div>
<script id="Js-frame-auto-search-item-template" type="application/template">
    <li class="auto-item Js-auto-item hide-row">
        <a href="javascript:void(0)" title="#{title}">#{title}</a>
    </li>
</script>
 */

$.cgAutoComplete = function(options){
    var option = {
        frameBox : $(".Js-auto-frame"),
        autoList : ".Js-auto-list",
        autoItem : ".Js-auto-item",
        autoText : ".Js-auto-text",
        autoBtn : $(".Js-auto-btn"),
        hoverClass : "selected",
        titleClass : "",
        isSearch : true,
        init : function(){},
        action : function(option, val){},
        createSearchList : function(option, val){}
    };
    $.extend(option, options);
    // 添加外部调用函数（受保护）
    $.extend(option, {
        _returnText : function(value){
            option.text.val( value );
        },
        addItem : function($temp, data){
            option.list.append( $.getFromTemplate( $temp, data ) );
        },
        showList : function(){
            option.list.show();
            $(document).one("click", function(){
                option.list.hide();
            });
        }
    });
    var keys = {
        back: 8,
        enter:  13,
        escape: 27,
        up:     38,
        down:   40,
        array:  [13, 27, 38, 40]
    },keyDate = [], chooseData = [];

    var $list = option.frameBox.find(option.autoList),
        $text = option.frameBox.find(option.autoText);
    $.extend(option, { list : $list, text : $text });
    $list.on("mouseenter", option.autoItem, function(){
        $(this).addClass(option.hoverClass);
        option._returnText( $(this).children().attr("title") );
    }).on("mouseleave", option.autoItem,function(){
            $(this).removeClass(option.hoverClass);
        });

    $list.on("click", option.autoItem, function(){
        option._returnText( $(this).children().attr("title") );
        $list.hide();
        if ( typeof( option.action ) == "function" ) {
            option.action(option, $.trim( $text.val() ) );
        }
    });

    $text.off("keyup").on("keyup", function(event){
        var keyCode = event.keyCode;
        keyDate.push((new Date()).getTime());
        var thisTime = keyDate[(keyDate.length - 1)];
        var val = "";
        // 需要检索列表
        if (option.isSearch) {
            if($.inArray(keyCode, keys.array) !=-1){
                if( $list.is(":visible") ){
                    var $item = $list.children(option.autoItem),
                        $cur = $item.filter("." + option.hoverClass);
                    switch (keyCode){
                        case keys.up:
                            if ( $cur.length ){
                                $item.removeClass(option.hoverClass);
                                if ( $cur.index() == 1 ) {
                                    $item.last().addClass(option.hoverClass);
                                } else{
                                    if ( $cur.prev().hasClass(option.titleClass) ) {
                                        $cur.prev().prev().addClass(option.hoverClass);
                                    } else{
                                        $cur.prev().addClass(option.hoverClass);
                                    }
                                }
                            }else{
                                $item.last().addClass(option.hoverClass);
                            }
                            option._returnText( $item.filter("." + option.hoverClass).children().attr("title") );
                            break;
                        case keys.down:
                            if ( $cur.length ){
                                $item.removeClass(option.hoverClass);
                                if ( $cur.index() == $item.length ) {
                                    $item.first().addClass(option.hoverClass);
                                } else{
                                    if ( $cur.next().hasClass(option.titleClass) ) {
                                        $cur.next().next().addClass(option.hoverClass);
                                    } else{
                                        $cur.next().addClass(option.hoverClass);
                                    }
                                }
                            }else{
                                $item.first().addClass(option.hoverClass);
                            }
                            option._returnText( $item.filter("." + option.hoverClass).children().attr("title") );
                            break;
                        case keys.enter:
                            $list.hide();
                            if ( typeof( option.action ) == "function" ) {
                                option.action(option, $.trim( $text.val() ) );
                            }
                            break;
                        default :
                            break;
                    }
                }else{
                    if( keyCode == keys.enter ){
                        if ( typeof( option.action ) == "function" ) {
                            option.action(option, $.trim( $text.val() ) );
                        }
                    }
                }
            }else{
                // 延时显示searchlist 减少多余查询
                setTimeout(function(){
                    val = $text.val();
                    if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
                        option.createSearchList(option, val);
                    }else if ( val == "" ){
                        option.list.hide();
                    }
                }, 300);
            }
            // 不需要检索列表
        } else{
            val = $(this).val();
            if (val != "") {
                if (keyCode == keys.enter) {
                    // option.createChosen($(this), val);
                    return false;
                }
            }
        };
    });

    $text.off("keydown").on("keydown", function(event){
        var keyCode = event.keyCode;
        if (keyCode == keys.back) {
            if( $.trim( $(this).val() ) === ""){
                if($list.is(":visible")){ $list.hide(); }
            }
        }
    });

    option.autoBtn.on("click", function(){
        $list.hide();
        if ( typeof( option.action ) == "function" ) {
            option.action(option, $.trim( $text.val() ) );
        }
    });
}

}(jQuery));