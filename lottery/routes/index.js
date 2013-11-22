var cookie = require('../tools/cookie');
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { });
};

exports.view = function(req, res){
    res.send('view');
};

exports.lottery = function(req, res){
    res.render('lottery', { });
};

exports.doLottery = function(req, res){
    var _cookieData = req.headers.cookie;
    var thisCookie = new cookie(_cookieData);
    var result = {};
    var num = thisCookie.get('lotteryNum');
    var arrPrize = ["failed", "third", "second", "first"];
    var prize = parseInt(Math.random()*(3-0+1)+0);
    num = ( num == '' ) ? 3 : Math.floor(num);
    result.success = true;
    result.num = num;
    result.prize = arrPrize[prize];
    res.writeHead(200, { 'Content-Type': 'application/json'} );
    res.end( JSON.stringify( result ) );
}

exports.canJoin = function(req, res){
    var result = {};
    var url = ["view", "lottery"];
    var prize = parseInt(Math.random()*(1-0+1)+0);
    result.success = true;
    result.url = url[prize];
    res.writeHead(200, { 'Content-Type': 'application/json'} );
    res.end( JSON.stringify( result ) );
}