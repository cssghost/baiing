(function($){
//$.fn

//$
/*******************************************************************************************************
 *	baiing View : $.getFromTemplate()	替换模板
 *	@param [options:template($dom)]		template jquery dom
 *	@param [options:model(obj)]			{ name : value }
 ********************************************************************************************************/
$.getFromTemplate = function( template, model ){
    var templateData;
    if ( template.constructor === jQuery ) {
        templateData = template.html();
    }else if ( template.constructor === String  ){
        templateData = template;
    }
    templateData = templateData.replace(
        new RegExp( "\\#\\{([^\\}]+)\\}", "gi" ),
        function( $0, $1 ){
            if ($1 in model){
                return( model[ $1 ] );
            } else {
                return( $0 )
            }
        }
    );
    if ( template.constructor === jQuery ) {
        return( $( templateData ).data( "model", model ) );
    }else if ( template.constructor === String  ){
        return templateData;
    }
};


}(jQuery));