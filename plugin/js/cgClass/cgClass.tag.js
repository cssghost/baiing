/** 
* @fileOverview Module Tag
* @author xu chen
* @date：2013-10-17
* @update：2013-10-17
* @version 0.1 
*/ 

cgClass.AddClass(
	"Tag",
	{
		init : function(options){
			var self = this,
				option = $.extend({
					wrap : $(".wrap"),
					tagList : ".tagList",
					tagItem : ".item",
					conList : ".conList",
					conItem : ".conItem",
					selectClass : "selected",
				}, options);
			option.wrap.find(option.tagList).on("click", option.tagItem, function(){
				var $tag = $(this),
					_index = $(this).index();
				if ( !$tag.hasClass(option.selectClass) ) {
					$tag.addClass(option.selectClass).siblings().removeClass(option.selectClass);
					option.wrap.find(option.conList).find(option.conItem).eq(_index).show().siblings().hide();
				}
			});
		}
	}
);