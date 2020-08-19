const sandbox = {
	testQuery: function(cb) {
		setTimeout(function() {console.log(cb(100500)); }, 2000);
	},

	testResult: function(result) {
		callback(result);  // cb from init
	}
}

module.exports = sandbox;