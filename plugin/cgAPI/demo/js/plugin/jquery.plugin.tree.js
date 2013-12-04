(function($){

/**
 * @author 徐晨 
 * @name jQuery.cgTree
 * @class 自动完成插件 <a href="../demo/tree.html" target="_blank">demo</a>
 * @constructor
 * @extends jQuery
 * @extends jQuery.getFromTemplate
 * @since version 1.0 
 * @param {Object} options 参数对象数据
 * @param {jQuery Object} options.wrap 包裹的jquery dom
 * @param {json} options.treeData 树形数据 {"id":"id","pId":"pId|null","name":"描述型知识"(,"prefix":"c")}
 * @param {css class} options.addClass 点击节点时需要添加的样式
 * @param {Boolean} options.isPreFix 是否存在特殊识别符
 * @param {jQuery Object} options.template 节点模板对象（按照jQuery.getFromTemplate方法）
 * @param {Function} options.nodeFun 点击节点时的附加事件
 * @param {Function} options.addOtherFun 添加非末级节点时的附加事件
 * @param {Function} options.addLastFun 添加末级节点时的附加事件
 * @param {Function} options.callback 模块初始化时的附加事件
 * @example
 * $.cgTree({
        wrap : $(".Js-has-prefix"),
        treeData : [{"id":"c102","pId":"c97","prefix":"c","name":"描述型知识","type":"catalog"}],
        template : $("#Js-tree-item-template"),
        isPreFix : true,
        callback : function (opt) {
        }
    });
 * @example
 *  <ul class="module-tree-list Js-has-prefix"></ul>
    <script id="Js-tree-item-template" type="application/template">
        <li class="Js-tree-item li-item fn-clear #{status}" style="padding-left:#{padding}px; border-bottom:1px solid #EEE;" data-id="#{newID}" data-lv="#{lv}" data-prefix="#{prefix}">
            <span class="tree-icon" style="left:#{padding}px">
                <img src="images/lib/i.gif" class="icon-lv Js-tree-icon" />
            </span>
            <a href="#{url}" class="name Js-tree-link">#{name}</a>
        </li>
    </script>
 */
$.cgTree = function( options ) {
    var option = $.extend({
        wrap : $(".tree-list"),
        treeData : [],
        addClass : "",
        isPreFix : true,
        template : null,
        nodeFun : null,
        addOtherFun : null,
        addLastFun : null,
        callback : null
    }, options);
    var _arrTree = { root : [] },
        _thisTreeData = [],
        _strTemp = $('<div><li style="margin-left:#{padding}px" id="color_#{id}" class="Js-tree-item #{status}" data-id="#{id}" data-lv="#{lv}" data-pid="#{pId}">'+
                        '<a href="javascript:void(0)"  class="tree-link Js-tree-link" data-id="#{id}">#{name}</a>'+
                    '</li></div>'),
        _temp = option.template ? option.template : _strTemp,
        _createTree = function(item){
            var $item;
            if ( _arrTree[item.id] ) {
                item.hasChild = true;
                item.status = "on"; 
                $item = option.addItem(item);
                if ( typeof(option.addOtherFun) == "function" ) {
                    option.addOtherFun($item, item);
                }
                $.each(_arrTree[item.id], function(i, t){
                    t.lv = Math.floor(item.lv) + 1;
                    _createTree(t);
                });
            }else{
                item.hasChild = false;
                item.status = "last";
                $item = option.addItem(item);
                if ( typeof(option.addLastFun) == "function" ) {
                    option.addLastFun($item, item);
                }
            }
        };
    $.extend(option, {
        /**
         * @name jQuery.cgTree#addItem
         * @desc  添加一个节点
         * @event
         * @param {object} item 节点的json数据
         * @return {jQuery Object} [ 被添加节点的jQuery对象]
         */
        addItem : function(item){

            item.padding = item.lv * 20;
            item.newID = item.id;
            if ( option.isPreFix ) {
                var _r = new RegExp( "^" + item.prefix , "gi" );
                item.newID = item.newID.replace(_r, "");
            }else{
                item.prefix = undefined;
            }
            var $li = $.getFromTemplate( _temp, item );
            option.wrap.append( $li );
            return $li;
        },
        /**
         * @name jQuery.cgTree#openRoot
         * @desc  打开所有顶级节点，并关闭其他节点
         * @event
         */
        openRoot : function(){
            option.wrap.find(".Js-tree-item").hide().filter(".on").removeClass("on").addClass("off");
            $.each(_arrTree.root, function(index, item){
                option.wrap.find(".Js-tree-item[data-id='" + item.newID + "'][data-prefix='" + item.prefix + "']").show().removeClass("off").addClass("on");
                if ( !!_arrTree[item.id] ) {
                    $.each(_arrTree[item.id], function(i, t){
                        option.wrap.find(".Js-tree-item[data-id='" + t.newID + "'][data-prefix='" + t.prefix + "']").show().filter(".on").removeClass("on").addClass("off");
                    });
                }
            });
        },
        /**
         * @name jQuery.cgTree#openSelected
         * @desc  打开当前节点
         * @event
         * @param {String} id 要打开的节点id
         * @param {String} prefix 要打开的节点id的特殊识别符
         */
        openSelected : function(id, prefix){
            // console.log(id, prefix);
            var _id = id;
            if ( !!prefix ) {
                id = prefix + id;
            }
            if ( !!_arrTree[id] ){
                if ( !!prefix ) {
                    option.wrap.find(".Js-tree-item[data-id='" + _id + "'][data-prefix='" + prefix + "']").removeClass("off").addClass("on");
                    $.each(_arrTree[id], function(index, item){
                        option.wrap.find(".Js-tree-item[data-id='" + item.newID + "'][data-prefix='" + item.prefix + "']").show();
                    });
                }else{
                    option.wrap.find(".Js-tree-item[data-id='" + _id + "']").removeClass("off").addClass("on");
                    $.each(_arrTree[id], function(index, item){
                        option.wrap.find(".Js-tree-item[data-id='" + item.newID + "']").show();
                    });
                }
            }
        },
        /**
         * @name jQuery.cgTree#closeSelected
         * @desc  关闭当前节点
         * @event
         * @param {String} id 要关闭的节点id
         * @param {String} prefix 要关闭的节点id的特殊识别符
         */
        closeSelected : function(id, prefix){
            // console.log(id, prefix);
            var _id = id;
            if ( !!prefix ) {
                id = prefix + id;
            }
            // console.log(id);
            if ( _arrTree[id] ){
                if ( !!prefix ) {
                    option.wrap.find(".Js-tree-item[data-id='" + _id + "'][data-prefix='" + prefix + "']").removeClass("on").addClass("off");
                    $.each(_arrTree[id], function(index, item){
                        option.wrap.find(".Js-tree-item[data-id='" + item.newID + "'][data-prefix='" + item.prefix + "']").hide();
                        var _closeID = item.id;
                        if ( option.isPreFix ) {
                            var _r = new RegExp( "^" + item.prefix , "gi" );
                            _closeID = _closeID.replace(_r, "");
                        }
                        option.closeSelected(_closeID, item.prefix);
                    });
                }else{
                    option.wrap.find(".Js-tree-item[data-id='" + _id + "']").removeClass("on").addClass("off");
                    $.each(_arrTree[id], function(index, item){
                        option.wrap.find(".Js-tree-item[data-id='" + item.newID + "']").hide();
                        var _closeID = item.id;
                        if ( option.isPreFix ) {
                            var _r = new RegExp( "^" + item.prefix , "gi" );
                            _closeID = _closeID.replace(_r, "");
                        }
                        option.closeSelected(_closeID, item.prefix);
                    });
                }
            }
        }
    });
    // parse data
    _thisTreeData = [].concat(option.treeData);
    $.each(_thisTreeData, function(index, item){
        // console.log(item);
        if( (item.open != undefined && item.open) || item.pId == "null" || item.pId == null ){
            item.lv = 0;

            _arrTree.root.push(item);
        }else{
            if (!_arrTree[item.pId]) {
                _arrTree[item.pId] = [];
            }
            _arrTree[item.pId].push(item);
        }
    });
    // console.log(_arrTree.root);
    // init create tree
    $.each(_arrTree.root, function(index, item){
        _createTree(item);
    });
    // bind click fun
    option.wrap.on("click", ".Js-tree-item", function(event){
        var $item = $(this),
            _id = $item.data("id"),
            _preFix = $item.data("prefix"),
            $element = $(event.target);
        if ( $element.hasClass("Js-tree-link") || $element.hasClass("Js-tree-icon") ) {
            if ( option.addClass != "" ) {
                option.wrap.children(".cur").removeClass( option.addClass );
                $item.addClass( option.addClass );
            }
            if ( $element.hasClass("Js-tree-link") && typeof(option.nodeFun) == "function" )  {
                option.nodeFun($item, option, _id);
                // return false;
            }
            if ( $item.hasClass("off") ) {
                if ( option.isPreFix ) {
                    option.openSelected(_id, _preFix);
                } else{
                    option.openSelected(_id);
                }
            } else if ( $item.hasClass("on") ) {
                if ( option.isPreFix ) {
                    option.closeSelected(_id, _preFix);
                } else{
                    option.closeSelected(_id);
                }
            }
        }
    });
    if ( typeof(option.callback) == "function" ) {
        option.callback(option);
    }
};
}(jQuery));