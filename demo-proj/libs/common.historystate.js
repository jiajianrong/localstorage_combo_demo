/** 
 * @authors jiajianrong@58.com
 * @date    2016-05-09
 * 
 * 浏览器前进后退监听
 * 
 * Demo:
 *  
 *  var historystate = require('libs/common.historystate');
    
    historystate({
        backFn: function(){
            // 处理回退逻辑
        },
        backRefreshFn: function(){
            // 处理回退刷新逻辑
        }
    })
 * 
 */


define("libs/common.historystate", function(require, exports, module){

    module.exports = 
    
        (function () {
            var doFn = {backFn: [], backRefreshFn: [], elseFn: []},
                refresh = 1;
            
            // window.history.state!==null || // 电脑版chrome v19以上竟然是null且不触发onpopstate
            window.history.replaceState({support: 1}, '');
            
            window.addEventListener('popstate', function (e) {
                if (e.state) {
                    doFn.backFn.forEach(function ( fn ) {fn()});
                    refresh && doFn.backRefreshFn.forEach(function ( fn ) {fn()});
                } else {
                    refresh = 0;
                    doFn.elseFn.forEach(function ( fn ) {fn()});
                }
            });
    
            return function ( opts ) {
                for ( var key in opts ) {
                    typeof opts[key] === 'function' && doFn[key].push(opts[key])
                }
            }
        })()

    
});