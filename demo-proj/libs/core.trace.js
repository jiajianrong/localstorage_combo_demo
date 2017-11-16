/** 
 * @authors jiajianrong@58.com
 * @date    2016-06-14
 * 
 * 发送日志
 * 
 * 注：
 * 对于普通页面标签里的打点，因为click代理是注册在body上，
 * ios不支持非clickable元素的click冒泡到body
 * 
 * 所以ios下务必将 data-trace 写在<a>或<input>或<button>之类的clickable的元素上
 * 如希望将 data-trace 写在 <div>上，必须给<div>加 cursor:pointer
 * 或者在<div>上注册click事件（使用代理的话代理元素不能是body），然后手动调用send方法打点
 * 
 * 否则ios下<div>等非clickable的元素不支持 data-trace 自动打点
 * 
 * 
 * 
 * 注：
 * 默认使用script.src打点
 * 对于https站点自动回退至image.src （浏览器开启无图模式时 无效）
 * 详情参见 /page/page-trace-usage/
 * 
 * 
 * 
 * 
 * 
 * 
 * 自动打点 Demo
 * 
 * (1)
 * <a href='javascript:;' data-trace='6'>test</a>
 * 
 * (2)
 * <a href='javascript:;' data-trace='abc'>test</a> // 不推荐，发送的打点最好为int
 * 
 * (3)
 * <a href='/next/page/url.html?p1=a&p2=b' data-trace='6'>test</a> // 打点后页面自动跳转
 * 
 * (4)
 * <div style='cursor:pointer;' data-trace='6'>test</div>
 * 
 * (5)
 * <a href='javascript:;' data-trace='{"tid":6,"otherParam":"aaa"}'>test</a>
 * <a href='/next/page/url.html?p1=a&p2=b' data-trace='{"tid":6,"otherParam":"aaa"}'>test</a>
 * <a href='javascript:;' data-trace='{"tid":6,"otherParam":"aaa","tgtUrl":"/next/page/url.html?p1=a&p2=b"}'>test</a>
 * // 支持json对象 以发送多个打点参数
 * // 注：w3c对于element嵌入json的标准是外层单引号，里层双引号。 写反则无效
 * // 自动打点不支持json里写callback回调函数，若有需求请使用手动打点（如下）
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 手动打点 Demo
 * 
 * var coretrace = require('libs/core.trace');
 * 在业务代码里的调用方式：
 * 
 * 
 * 
 * (1) 唯一形参，参数可以为  数值  或  字符串  或  自定义的trace对象
 * 
 * (1.1)
 * coretrace.send(6);
 * 
 * (1.2)
 * coretrace.send('abc'); // 不推荐，发送的打点最好为int
 * 
 * (1.3)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb'
 * });
 * 
 * (1.4)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     tgtUrl: '/next/page/url.html?p1=a&p2=b' // 指定发送打点后页面跳转路径
 * });
 * 
 * (1.5)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     callback: function() {} // 打点完成的回调 ，支持页面跳转，如 location.href='/next/page/url.html?p1=a&p2=b'
 * });
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * (2) 双形参，第二个参数为  页面跳转的字符串
 * 
 * (2.1)
 * coretrace.send(6, '/next/page/url.html?p1=a&p2=b');
 * 
 * (2.2)
 * coretrace.send('abc', '/next/page/url.html?p1=a&p2=b'); // 不推荐，发送的打点最好为int
 * 
 * (2.3)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb'
 * }, '/next/page/url.html?p1=a&p2=b' );
 * 
 * (2.4)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     callback: function() {} // 打点完成的回调 
 * }, '/next/page/url.html?p1=a&p2=b' );   
 * // 注：同时定义 第一个参数的callback 和  第二个参数为字符串时，callback里最好不要有页面跳转的逻辑；否则二者冲突必定有一个失效
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * (3) 双形参，第二个参数为  回调函数 （  支持页面跳转，如 location.href='/next/page/url.html?p1=a&p2=b' ）
 * 
 * (3.1)
 * coretrace.send(6, function(){});
 * 
 * (3.2)
 * coretrace.send('abc', function(){}); // 不推荐，发送的打点最好为int
 * 
 * (3.3)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb'
 * }, function(){} );
 * 
 * (3.4)
 * coretrace.send({
 *     tid: 6,
 *     otherParam1: 'aaa',
 *     otherParam2: 'bbb',
 *     callback: function() {}
 * }, function(){} );   
 * // 注：同时定义 第一个参数的callback 和  第二个参数为回调函数时，后者会覆盖前者。因为确实没有必要把回调逻辑拆为两个callback 
 * 
 * 
 * 
 */


define("libs/core.trace", function(require, exports, module){
    
    
    var encode = encodeURIComponent,
        decode = decodeURIComponent,
        
        // TODO: 根据项目修改为正确地址
        COOKIE_KEY = 'jr8_t_c_v1',
        COOKIE_DOMAIN = '.58.com',

        TRACE_URL_PREFIX = '//jrlog.58.com/trace?project=test&',
        INFO_URL_PREFIX = '//jrlog.58.com/info?project=test&';



    /**
     * helper
     */
    var isWinLoaded = (function() {
        var winLoaded = false;
        
        var winLoadedHander = function () {
            winLoaded = true;
            window.removeEventListener( 'load', winLoadedHander );
        }
        
        window.addEventListener( 'load', winLoadedHander );
        
        return function() {
            return winLoaded;
        }
    })();
    
    
    
    
    /**
     * helper
     */
    var json2query = function(obj) {
        var arr;
        
        arr = Object.getOwnPropertyNames(obj).map( function(k){
            return encode(k) + '=' + encode(obj[k]);
        } );
        
        return arr.join('&');
    };
    
    
    /**
     * helper
     */
    var mixin = function(obj1) {
        var mixins = Array.prototype.slice.call(arguments,1);
        
        mixins.forEach(function(o){
            for(var k in o){
                obj1[k]=o[k];
            }
        });
    };
    
    
    /**
     * helper
     */
    var setCookie = function(key, value, expires, domain){
        document.cookie = key + "=" + encode(value)
            + (domain ? ";domain="+domain : "")
            + (expires ? ";path=/;expires=" + expires.toGMTString()+";" : "");
    };
    
    
    /**
     * helper
     */
    var getCookie = function(key){
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
            result = reg.exec(document.cookie);
        return result ? decode(result[2]) : null;
    }
    
    
    
    /**
     * helper
     */
    var makeUID = (function () {
        
        var uid = getCookie(COOKIE_KEY),
            exp,
            t;
        
        if (!uid) {
            uid = location.host.replace( /\W/gi, '' ) + '.' + (+new Date()) + Math.random();
            exp = new Date();
            t = exp.getTime();
            t += 1000*3600*24*365*10;
            exp.setTime(t);
            setCookie( COOKIE_KEY, uid, exp, COOKIE_DOMAIN );
        }
        
        return function() {
            return uid;
        }
    })();



    /**
     * helper
     */
    var makePPU = (function() {

        var ppu = getCookie('PPU'),
            arr,
            uid;

        uid = (ppu && ppu.trim() && (arr = ppu.match(/(?:\'|\"|&)?UID=([^&]+)/)) && arr[1]) || 'notlogin';

        return function() {
            return uid;
        }
    })();



    /**
     * mobile info
     */
    var makeMobileInfo = (function() {
        
        var ua = navigator.userAgent,
            uaMap = {
                android: /Android|Linux/i.test(ua),
                iPhone: /iPhone|iPad/i.test(ua)
            },
            /*
             * 2017-03-27 增加ua类型判断
             */
            uaArr = [
                {name: '58app',               value: !!getCookie('58ua')},
                {name: 'wx',                  value: /micromessenger/ig.test(ua)},
                {name: 'qqbrowser',           value: /qqbrowser/i.test(ua)},
                {name: 'uc',                  value: /ucbrowser/i.test(ua)},
                {name: 'sogoumobilebrowser',  value: /sogoumobilebrowser/i.test(ua)},
                {name: 'baidubrowser',        value: /baidubrowser/i.test(ua)},
                {name: 'baiduapp',            value: /baiduboxapp/i.test(ua)},
                {name: 'samsungbrowser',      value: /samsungbrowser/i.test(ua)},
                {name: 'miuibrowser',         value: /miuibrowser/i.test(ua)},
                {name: 'vivo',                value: /vivo/i.test(ua)},
                {name: 'ganji_app',           value: /ganji/i.test(ua)},
                {name: 'others',              value: true}
            ],
            os,
            browser;
        
        
        function getOS() {
            return os || (os = uaMap.android ? 'android' : uaMap.iPhone ? 'iphone' : ua);
        }
        
        function getBrowser() {
            if (browser) return browser;
            
            for ( var i=0; i<uaArr.length; i++ ) {
                if ( uaArr[i].value ) return ( browser = uaArr[i].name );
            }
        }
        
        function getScreenSize() {
            return window.screen.height + '*' + window.screen.width + '*' + window.devicePixelRatio;
        }
        
        
        // 探测浏览器是否支持localStorage
        function lsSupport() {
            var flag = null,    // 
                key = "jr8_ls_detect";
            
            return function() {
                if(flag === null) {
                    try {
                        flag = (window.localStorage.setItem(key, 1), 
                                window.localStorage.getItem(key), 
                                window.localStorage.removeItem(key), 
                                1);
                    } catch (e) {
                        flag = 0;
                    }
                }
                return flag;
            };
        };
        
        
        return function() {
            return {
                os: getOS(),
                browser: getBrowser(),
                scrsize: getScreenSize(),
                fullua: ua,
                lsSupport: lsSupport()()
            }
        }
    })();
    
    
    
    
    /**
     * performance info
     * 没做缓存，不要调多次
     */
    var makePerformanceInfo = function() {
        
        if ( !performance || !performance.timing )
            return null;
        
        
        var pt = performance.timing;
  
        if (pt.requestStart === 0 || pt.responseStart === 0 || pt.responseEnd === 0 || 
            pt.responseEnd - pt.responseStart < 0 || pt.domContentLoadedEventStart - pt.navigationStart < 0)
            return null;
        
        
        var dns = pt.domainLookupEnd - pt.domainLookupStart,
            conn = pt.connectEnd - pt.connectStart,
            req = pt.responseStart - pt.requestStart,
            res = pt.responseEnd - pt.responseStart,
            rt = pt.responseEnd - pt.navigationStart,
            intr = pt.domContentLoadedEventStart - pt.navigationStart;
        
        
        return {
            dns: dns,
            conn: conn,
            req: req,
            res: res,
            rt: rt,
            intr: intr,
            referrer: encode(document.referrer)
        }
    };
    
    
    
    
    
    
    
    
    
    
    /**
     * @param {Object} traceObj
     * 
     * traceObj格式为
     * {
     *     tid: 1,
     *     pid: 1,
     *     tgtUrl: 'string',
     *     ...
     * }
     */
    function Trace (traceObj) {
        this.traceObj = traceObj;
    }
    
    
    /**
     * 适配 Trace.send
     */
    var TraceProxy = {
        
        /**
         * 打点
         * @param {Object} traceObj
         * @param {Object} callback
         */
        send: function( traceObj, callback ) {
            
            var t = typeof traceObj;
            
            if ( t==='string' || t==='number' ) {
                traceObj = {tid: traceObj}
            }
            
            if ( typeof callback==='string' ) {
                traceObj.tgtUrl = callback;
            } else if ( typeof callback==='function' ) {
                traceObj.callback = callback;
            }
            
            var trace = new Trace(traceObj);
            trace.send();
        },
        
        /**
         * 信息统计
         * @param {Object} traceObj
         */
        sendInfo: function( traceObj ) {
            var trace = new Trace(traceObj);
            trace.sendInfo();
        }
        
    };
    
    
    
    
    Trace.prototype = {
        

        /**
         * 对外暴露接口：发送打点数据
         */
        send: function() {
            
            var to = this.traceObj,
                tgtUrl = to.tgtUrl,
                traceParams,
                isLeave = false,
                callback;
            
            // 包裹trace对象
            this.wrapTraceObj();
            
            // stringify
            traceParams = json2query(to);
            
            
            if (to.callback) {
                callback = to.callback;
                isLeave = this.checkIfCallbackLeave();
                // 修正callback参数
                traceParams = traceParams.replace(/callback=[^#&]+/,'callback=true');
            }
            
            
            if (this.checkIfDirectLeave()) {
                
                var l = this.emulateLeave(tgtUrl);
                
                // combine callbacks
                if (callback) {
                    callback = (function() {
                        var c = callback;
                        return function() {
                            c.apply(null);
                            l.apply(null);
                        };
                    })();
                    
                } else {
                    callback = l;
                }
                
                isLeave = isLeave || true;
            }
            
            
            this.sendFacade( TRACE_URL_PREFIX+traceParams, callback, isLeave );
            
        },
        
        
        
        
        
        
        /**
         * 对外暴露接口：发送基础统计数据
         */
        sendInfo: function() {
            
            var to = this.traceObj,
                traceParams;
            
            // 包裹trace对象
            this.wrapTraceObj();
            
            // stringify
            traceParams = json2query(to);
            
            
            this.sendFacade( INFO_URL_PREFIX+traceParams, null, false );
            
        },
        
        
        
        
        
        /**
         * 添加必要信息到trace obj
         */
        wrapTraceObj: function() {
            
            mixin( this.traceObj, {
                page: encode(location.href),
                _: +new Date(),
                uid: makeUID(),
                loginuid: makePPU()
            });

        },
        
        
        
        
        
        /**
         * send统一出口
         * 
         * @param {Object} url
         * @param {Object} cb
         * @param {Object} leave
         */
        sendFacade: function( url, cb, leave ) {
            
            var https = /^https/i.test(location.protocol);
            var args = Array.prototype.slice.call(arguments);
            
            /**
             * 2017-03-30 增加navigator.sendBeacon判断
             */
            if (navigator.sendBeacon) {
                // AB test: 验证sendBeacon的有效性
                if( Math.random() < 0.5 ) {
                    args[0] += '&sendType=sendBeacon';
                    this.sendViaNavBeac.apply(this, args);
                    return;
                } else {
                    args[0] += '&sendType=normal';
                }
            }
            
            
            /* 2017-04-24 日志服务器已支持https
            if (https)
                this.sendViaImage.apply(this, args);
            else*/
            this.sendViaScript.apply(this, args);
            
        },
        
        
        
        
        
        /**
         * navigator.sendBeacon方式发送打点
         *
         * @param traceUrl
         * @param callback
         * @param isLeave
         */
        sendViaNavBeac: function (traceUrl, callback, isLeave) {

            window.navigator.sendBeacon(traceUrl);

            callback = callback || function () {};

            callback.apply(null);
        },
        
        
        
        
        
        
        /**
         * 用script.src方式发送，用来替代image.src
         * 
         * @param traceUrl
         * @param callback
         */
        sendViaScript: function(traceUrl, callback, isLeave) {
            
            var script,
                
                
                sent = false,
                
                
                callback = callback || function(){},
                
                
                sendTimer = setTimeout(function(){
                    
                    clearTimeout(sendTimer);
                    sendTimer = null;
                    
                    script = document.createElement('SCRIPT');
                    
                    script.onload = script.onerror = function() {
                        sent = true;
                        callback.apply(null);
                    };
                    
                    script.src = traceUrl;
                    
                    document.body.appendChild(script);
                    
                },0),
                
                
                timeoutTimer = setTimeout( function(){
                    
                    clearTimeout(timeoutTimer);
                    timeoutTimer = null;
                    
                    script.onreadystatechange = script.onload = script.onerror = script.readyState = null;
                    
                    !sent && callback.apply(null);
                    
                    document.body.removeChild(script);
                    
                }, isLeave?300:3000 );
            
            
        },
        
        
        
        
        
        /**
         * 用image.src发送打点
         * 
         * @param traceUrl
         * @param callback
         */
        sendViaImage: function(traceUrl, callback, isLeave) {
            
            var img,
                
                
                sent = false,
                
                
                callback = callback || function(){},
                
                
                sendTimer = setTimeout(function(){
                    
                    clearTimeout(sendTimer);
                    sendTimer = null;
                    
                    img = new Image();
                    
                    img.onload = img.onerror = function() {
                        sent = true;
                        callback.apply(null);
                    };
                    
                    img.src = traceUrl;
                    
                },0),
                
                
                timeoutTimer = setTimeout( function(){
                    
                    clearTimeout(timeoutTimer);
                    timeoutTimer = null;
                    
                    img.onreadystatechange = img.onload = img.onerror = img.readyState = null;
                    
                    !sent && callback.apply(null);
                    
                }, isLeave?300:3000 );
            
            
        },
        
        
        
        
        /**
         * 模拟页面跳转
         * 
         * @param {Object} tgtUrl
         */
        emulateLeave: function(tgtUrl) {
            
            return function() {
                
                // convert url to absolute path
                var elA = document.createElement('a');
                elA.href = tgtUrl;
                tgtUrl = elA.href;
                
                // webkit在onload之前，如果有非用户发起的跳转，那么页面不会记入history。也就是跳转后点返回，回不到跳转前的页面
                if (isWinLoaded()) {
                    location.href = tgtUrl;
                
                // 如果使用模拟点击，那么js改变的页面状态在跳转返回后不会保留。比如点击下一页加载更多后，点击打点跳转，再返回，页面只有初始的第一页内容。
                } else {
                    // UC浏览器dispatch event有问题，模拟点击的href是tel:等无法触发
                    elA.click();
                }
                
            };
            
        },
        
        
        
        
        /**
         * helper
         * 判断是否需要页面跳转
         */
        checkIfCallbackLeave: function() {
            
            var callback = this.traceObj.callback,
                isLeave = false;
            
            if ( callback ) {
                var cbStr = callback.toString();
                isLeave = /location\.href\s*=/i.test(cbStr);
            }
            
            return isLeave;
        },
        
        
        
        /**
         * helper
         * 判断是否需要页面跳转
         */
        checkIfDirectLeave: function() {
            
            var tgtUrl = this.traceObj.tgtUrl,
                isLeave = false;
            
            // 目标不为空，且不以#打头
            isLeave = tgtUrl && ( !/^#/i.test(tgtUrl) );
            
            // 若为javascript时，不为浏览器前进后退
            if ( /^\s*javascript/i.test(tgtUrl) ) {
                isLeave = /(?:history)|(?:go)/i.test(tgtUrl);
            }
            
            return isLeave;
        }
        
        
        
    };

    
    
    
    
    
    
    
    
    document.body.addEventListener( 'click', function __trace(e){
        
        var traceElement = e.target,
            traceObject;
        
        while( traceElement && 
               traceElement.parentNode!==document.body && 
               traceElement!==document.body &&
               !traceElement.getAttribute('data-trace') ) {
            traceElement = traceElement.parentNode;
        }
        
        if (!traceElement)
            return;
        
        traceObject = traceElement.getAttribute('data-trace');
        
        if (!traceObject)
            return;
        
        // 计算traceObject
        traceObject = /\{/.test(traceObject) ? JSON.parse(traceObject) : { tid: traceObject };
        
        
        // 当前trace元素是a标签？
        if ( traceElement.tagName.toLowerCase()==='a' ) {
            var url = traceObject.tgtUrl = ( traceObject.tgtUrl || traceElement.getAttribute('href') );
            if ( ! /(?:^#)|(?:^tel\:)/i.test(url) ) {
                e.preventDefault();
            }
        }
        
        
        TraceProxy.send( traceObject );
    } );
    
    
    
    
    
    
    
    /*
     * 2017-03-27 增加 dom readystate 判断
     */
    var __info = function() {
        
        var mobile = makeMobileInfo(),
            perfor = makePerformanceInfo(),
            info = {};
        
        mixin( info, mobile, perfor );
        
        TraceProxy.sendInfo( info );
    };
    
    if ( /complete|loaded|interactive/.test(document.readyState) && document.body ) 
        __info();
    else 
        document.addEventListener( "DOMContentLoaded", __info );
    
    
    
    
    
    
    
    
    
    
    
    module.exports = TraceProxy;

});