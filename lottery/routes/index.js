var cookie = require('../tools/cookie');
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { });
};

exports.doLottery = function(req, res){
    var _cookieData = req.headers.cookie;
    var thisCookie = new cookie(_cookieData);
    var result = {};
    var num = thisCookie.get('lotteryNum');
    num = ( num == '' ) ? 3 : Math.floor(num);
    result.success = num <= 0 ? false : true;
    result.num = num;
    res.writeHead(200, { 'Content-Type': 'application/json'} );
    res.end( JSON.stringify( result ) );
}