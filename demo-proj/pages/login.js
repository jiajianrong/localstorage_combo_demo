define('page/login/login', function(require, exports, module) {
	'use strict';
	
	var $ = require('zepto');
	//console.log($)
	
	require('libs/core.trace');
	
	module.exports = function(opt) {
		$('#place_holder').text('seeing this msg means everything works, check localstorage for details. you can delete one or more localstorage item and refresh the page')
		
		setTimeout(()=>(
			$('#username').val('admin')
		), 2000)
	}
})