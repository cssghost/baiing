/** 
* @fileOverview Tools classes 
* @author xu chen
* @date：2013-10-15
* @update：2013-10-15
* @version 0.1 
*/ 

var cgTools = {};

/** 
* @author xu chen 
* @return {Bool} 是否在目标数组中存在
* @description 判断是否在目标数组中存在，如果存在，触发回调函数
* @example cgTools.isInArray(array, value, callback); 
* @since version 0.1 
* @param {Array} arr 目标数组
* @param {param} value 查询值
* @param {Function} callback 回调函数 参数为查询值的下标
*/ 
cgTools.isInArray = function(arr, value, callback){
	var result = false;
	if ( arr && arr.constructor && arr.length ) {
		for( var i = 0; i < arr.length; i++ ){
			if ( arr[i] == value ) {
				result = true;
				if ( typeof callback == "function" ) {
					callback(i);
				}
				break;
			}
		}
	}
	return result;
}

/** 
* @author xu chen 
* @return {Bool} 是否在目标数据对象中存在
* @description 判断是否在目标数据对象中存在，如果存在，触发回调函数
* @example cgTools.isInObject(obj, key, value, callback); 
* @since version 0.1 
* @param {Object} obj 目标数据对象
* @param {String} key 键名
* @param {param} value 键值
* @param {Function} callback 回调函数 参数为key, value
*/ 
cgTools.isInObject = function(obj, key, value, callback){
	var result = false;
	if ( obj[key] == value ) {
		result = true;
		if ( typeof callback == "function" ) {
			callback(key, value);
		}
	}
	return result;
}
