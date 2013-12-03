cgClass.AddClass(
    "Filter",
    {
        init : function(options){
            var self = this,
                option = $.extend({
                wrap : $(".wrap"),
                sliders : null,
                radios : [],
                checkboxs : null,
                checkClass : "selected",
                checkboxWrap : ".Js-pack-filter-title-checkbox",
                resultWrap : ".resultWrap",
                ajaxData : null,
                beforeAjax : null,
                init : null,
                callback : null
            }, options);
            /* do something */
            self.outParam = self.applyMethods(self, {
                option : options
            });
        }
    }
);