(function($){

$.cgAutoComplete = function(options){
    var option = {
        frameBox : $(".Js-auto-frame"),
        autoList : ".Js-auto-list",
        autoItem : ".Js-auto-item",
        autoText : ".Js-auto-text",
        autoBtn : $(".Js-auto-btn"),
        hoverClass : "selected",
        titleClass : "",
        isSearch : false,
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